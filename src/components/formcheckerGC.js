<script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.5.4/react.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.5.4/react-dom.min.js"></script>
<script src="https://unpkg.com/babel-standalone@6.15.0/babel.min.js"></script>

Do you play the Official Premier League Fantasy Football game?

If so, you've probably spent hours reading all<strong><span style="color: #0000ff;"> <a style="color: #0000ff;" href="https://www.amazon.com/gp/product/1787290166/ref=as_li_tl?ie=UTF8&amp;tag=gamechangecou-20&amp;camp=1789&amp;creative=9325&amp;linkCode=as2&amp;creativeASIN=1787290166&amp;linkId=e0fe3bd29ddaa06086a1eefe389c264b">the books</a></span></strong>, pouring over stats and watching highlight after highlight while you decide what moves to make.

<!--more-->

But have you ever wondered how many points you'd have if you had <strong>never made a transfer or changed your captain?</strong>

Are those hours spent agonizing over transfer and lineup choices worth it?  Should you have just set and forget from the beginning?

Enter your team ID in the field below to find out how many points you'd have if you'd just left it all alone...

You might also enjoy our other <strong><a href="https://www.game-change.co.uk/fpl-tools/">FPL Tools</a></strong>, which give similar insights into your season.

The excellent book on Mastering FPL from Amazon, <a href="https://www.amazon.co.uk/gp/product/1787290166/ref=as_li_tl?ie=UTF8&amp;tag=gamechangecou-21&amp;camp=1634&amp;creative=6738&amp;linkCode=as2&amp;creativeASIN=1787290166&amp;linkId=39f86dd05dbca8fec11f46de1daeb93a"><strong><em>Wasting your Wildcard, </em>is available from Amazon here.</strong></a>
<div id="root" style="width: 100%;"></div>
<pre><script type="text/babel">

var WhatIf = React.createClass({
  getInitialState: function() {
    return {
         coreData: '',
      isLoaded: false,
      items: '',
      teamId: '',
      player: 'hi',
      score: 0,
      playerArray: [],
      outfieldScore: 0,
      subScore: 0,
      teamName: '',
      currentWeek: '',
      highestScorer: '',
      captain: '',
      captainScore: '',
      capDiff: '',
      averageSubScore: '',
      pointsComingOn: '',
      currentActual: 0,
      currentTransfers: 0,
      currentValue: 0,
      whatifValue: 0,
      rank:0
    }
},

  handleChange(event) {

    this.setState({teamId: event.target.value,
              });
  },

  componentDidMount() {
    const url = 'https://ffwhatif.herokuapp.com/proxy.php';
    fetch(url+"?csurl=https://fantasy.premierleague.com/api/bootstrap-static/")
     .then(res => res.json())
     .then(
      (result) => {
        let currentWeek = 1;
        let events = result.events;
        events.forEach(function(element) {
          if(element.finished === true){
            currentWeek = element.id;
          }
        });


      this.setState({
        coreData: result.elements,
        currentWeek: currentWeek,
        })
      })
  },


  onButtonClick() {

    let varItems = ''
    this.tempArray = [];
    this.state.playerArray = [];
    this.tempPlayerArray = [];
    this.finalArray = [];

    const url = 'https://ffwhatif.herokuapp.com/proxy.php';

    fetch(url+"?csurl=https://fantasy.premierleague.com/api/entry/" + this.state.teamId + "/event/" + this.state.currentWeek + "/picks/")
      .then(res => res.json())
      .then(
      (result) => {
        varItems = result;
        for (var i=0; i<15; i++){
          this.tempArray.push(this.state.coreData.find(theplayer => theplayer.id === varItems.picks[i].element))
        }
       },
      )
      .then(
        (result) => {
        for(var i=0;i<15;i++){
           fetch(url+"?csurl=https://fantasy.premierleague.com/api/element-summary/"+this.tempArray[i].id+"/")
             .then(res => res.json())
            .then((result) => {
                let history = result.history;
                this.tempPlayerArray.push(history);
             }
            )
            .then(
                response => {
                    if(this.tempPlayerArray.length > 14){
                        for(i=0;i<15;i++){
                            let tempArray = (this.state.coreData.find(theplayer => theplayer.id === this.tempPlayerArray[i][0].element))
                            let player = this.tempPlayerArray[i];
                            let gameweeks = player.length;
                            let lastweek = player[gameweeks-1].total_points;
                            let twoweek = player[gameweeks-2].total_points;
                            let threeweek = player[gameweeks-3].total_points;
                            let fourweek = player[gameweeks-4].total_points;

                            let fourWeekScore = lastweek + twoweek +threeweek + fourweek;

                            console.log(tempArray);

                            let playerObject = {
                                'Id': player[0].element,
                                'Name': tempArray.first_name + ' ' + tempArray.second_name,
                                'FourWeekScore': fourWeekScore,
                                'Ownership': tempArray.selected_by_percent,
                                'TotalPpg': tempArray.points_per_game,
                                'PpgLast4': fourWeekScore / 4,
                                'Position' : tempArray.element_type
                            }

                            this.finalArray.push(playerObject);

//tempArray has the players core info, tempPlayerArray has the individual fixture info and history
                        }

                        console.log(this.finalArray);

                        this.setState({
                            playerArray: this.finalArray,
                          })
                    }
                }
            )
        }
       }
      ).then(
        (result) => {
         fetch(url + "?csurl=https://fantasy.premierleague.com/api/entry/" + this.state.teamId +"/")
         .then(res => res.json())
          .then(
            (result) => {
                var teamName = result.player_first_name;
              const currentActual = result.summary_overall_points;
              const currentTransfers = result.last_deadline_total_transfers;
              const currentValue = result.last_deadline_value / 10;

                this.setState({
                teamName: teamName,
                currentActual,
                currentTransfers,
                currentValue
                 });
            },
          )
        }
      )
  },

  render() {
    const { error, currentValue, whatifValue, isLoaded, items, coreData, player, score, currentActual, currentTransfers, playerArray, outfieldScore, teamId, teamName, currentWeek, subScore, highestScorer, highestScore, captain, captainScore, pointsComingOn, vicecaptScore} = this.state;
    if (error) { 
      return <div>Error: {error.message}</div>;
    } else {
      return (
      <div className={"containWhatif"}>
      <div className="input-group mb-3">
      <input type="text" className={"mainInput"} value={this.state.teamId} onChange={this.handleChange} />
        <div className="input-group-append">
          <button type="button"
            onClick={()=>{this.onButtonClick();}}
            style={{ cursor: 'pointer', backgroundColor: 'darkred', color: 'white', border: '0px', margin: '0 auto', height: '38px' }}
            className={'whatifButton btn btn-outline-secondary'}
           disabled={!teamId}
            > Calculate
          </button>
        </div>
      </div>

      {teamName.length > 0 &&
        <h1>{teamName}</h1>
      }

      <div>

<div className={"playerbar"}>

{playerArray.map(item => {

if(item.Position == 1 && playerArray.indexOf(item) < 11){
   return <div key={item.Id} className={"starter"} style={{backgroundColor:'green', color:'white'}}>
   <span className="pointSpan"><strong>{item.Name}</strong></span>
   <span className="pointSpan">Past 4 weeks: <strong>{item.FourWeekScore}pts</strong></span>
   <span className="pointSpan">Ownership: <strong>{item.Ownership}%</strong></span>
   <span className="pointSpan">PPG last 4: <strong>{item.PpgLast4}pts</strong></span>
   <span className="pointSpan">Total PPG: <strong>{item.TotalPpg}pts</strong></span>
    </div>
  }

})}

</div>

<div className={"playerbar"}>

{playerArray.map(item => {

if(item.Position == 2 && playerArray.indexOf(item) < 11){
    return <div key={item.Id} className={"starter"} style={{backgroundColor:'lightBlue', color:'black'}}>
    <span className="pointSpan"><strong>{item.Name}</strong></span>
    <span className="pointSpan">Past 4 weeks: <strong>{item.FourWeekScore}pts</strong></span>
    <span className="pointSpan">Ownership: <strong>{item.Ownership}%</strong></span>
    <span className="pointSpan">PPG last 4: <strong>{item.PpgLast4}pts</strong></span>
    <span className="pointSpan">Total PPG: <strong>{item.TotalPpg}pts</strong></span>
     </div>
   }

})}

</div>

<div className={"playerbar"}>


{playerArray.map(item => {

if(item.Position == 3 && playerArray.indexOf(item) < 11){
    return <div key={item.Id} className={"starter"} style={{backgroundColor:'red', color:'white'}}>
    <span className="pointSpan"><strong>{item.Name}</strong></span>
    <span className="pointSpan">Past 4 weeks: <strong>{item.FourWeekScore}pts</strong></span>
    <span className="pointSpan">Ownership: <strong>{item.Ownership}%</strong></span>
    <span className="pointSpan">PPG last 4: <strong>{item.PpgLast4}pts</strong></span>
    <span className="pointSpan">Total PPG: <strong>{item.TotalPpg}pts</strong></span>
     </div>
   }

})}

</div>

<div className={"playerbar"}>


{playerArray.map(item => {

if(item.Position == 4 && playerArray.indexOf(item) < 11){
    return <div key={item.Id} className={"starter"} style={{backgroundColor:'yellow', color:'black'}}>
       <span className="pointSpan"><strong>{item.Name}</strong></span>
       <span className="pointSpan">Past 4 weeks: <strong>{item.FourWeekScore}pts</strong></span>
       <span className="pointSpan">Ownership: <strong>{item.Ownership}%</strong></span>
       <span className="pointSpan">PPG last 4: <strong>{item.PpgLast4}pts</strong></span>
       <span className="pointSpan">Total PPG: <strong>{item.TotalPpg}pts</strong></span>
     </div>
   }

})}

</div>

<div className={"subbar"}>

{playerArray.map(item => {

if(playerArray.indexOf(item) >= 11){
    return <div key={item.Id} className={"starter"} style={{backgroundColor:'lightGrey', color:'black'}}>
       <span className="pointSpan"><strong>{item.Name}</strong></span>
       <span className="pointSpan">Past 4 weeks: <strong>{item.FourWeekScore}pts</strong></span>
       <span className="pointSpan">Ownership: <strong>{item.Ownership}%</strong></span>
       <span className="pointSpan">PPG last 4: <strong>{item.PpgLast4}pts</strong></span>
       <span className="pointSpan">Total PPG: <strong>{item.TotalPpg}pts</strong></span>
     </div>
   }

})}

</div>

</div>


</div>
);
}
}


});
ReactDOM.render(
  <WhatIf />,
  document.getElementById('root')
);
</script></pre>