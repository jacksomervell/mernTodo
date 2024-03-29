<p><script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.5.4/react.min.js"></script><br /><script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.5.4/react-dom.min.js"></script><br /><script src="https://unpkg.com/babel-standalone@6.15.0/babel.min.js"></script></p>
<p>Do you play the Official Premier League Fantasy Football game?</p>
<p>If so, you've probably spent hours reading all <strong><a href="https://amzn.to/3tQoqyY">the books</a></strong>, pouring over stats and watching highlight after highlight while you decide what moves to make.</p>
<p><!--more--></p>
<p>But have you ever wondered how many points you'd have if you had <strong>never made a transfer or changed your captain?</strong></p>
<p>Are those hours spent agonizing over transfer and lineup choices worth it?  Should you have just set and forget from the beginning?</p>
<p>Enter your team ID in the field below to find out how many points you'd have if you'd just left it all alone...</p>
<p>You might also enjoy our other <strong><a href="https://www.game-change.co.uk/fpl-tools/">FPL Tools</a></strong>, which give similar insights into your season.</p>
<p>The excellent book on mastering FPL, <a href="https://amzn.to/3tQoqyY"><strong><em>Fantasy Premier League: Unlocking The Secrets To A Top 1% Finish, </em>is available from Amazon here.</strong></a></p>
<div id="root" style="width: 100%;"> </div>
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
      whatIfRank:0,
      currentRank:0
    };
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

    let playerName = '';
    let varItems = ''
    this.tempArray = [];
    this.state.playerArray = [];
    var capt = '';
    var captScore = '';
    var vicecapt = '';
    var vicecaptScore = '';
    var leaguePositionArray=[];

    const url = 'https://ffwhatif.herokuapp.com/proxy.php';

    fetch(url+"?csurl=https://fantasy.premierleague.com/api/entry/" + this.state.teamId + "/event/1/picks/")
      .then(res => res.json())
      .then(
      (result) => {
        varItems = result;
        for (var i=0; i<15; i++){
          this.tempArray.push(this.state.coreData.find(theplayer => theplayer.id === varItems.picks[i].element))
          if(this.tempArray[i].is_cap == true){
            this.tempArray[i].total_points = 0.5 * this.tempArray[i].total_points;
            this.tempArray[i].is_cap = false;
          }

          if(varItems.picks[i].is_captain == true && this.tempArray[i].is_cap != true){
            this.tempArray[i].is_cap = true
            this.tempArray[i].total_points = this.tempArray[i].total_points * 2;
            capt = this.tempArray[i].web_name;
            captScore = this.tempArray[i].total_points;
            }

//vice stuff here

            if(varItems.picks[i].is_vice_captain == true && this.tempArray[i].is_vice != true){
            this.tempArray[i].is_vice = true
            vicecapt = this.tempArray[i].web_name;
            vicecaptScore = this.tempArray[i].total_points;
            }

        }
       },
      )
      .then(
        (result) => {

          var outScore = 0;
          var subScore = 0;
          var highestScore = 0;
          var highestScorer = '';
          var averageSubScore = 0;
          var totalMatchesMissed = 0;
          var scoreToAddFromSubs = 0;
          let totalCost = 0;


//get the total mmax mins played for the seaosn so far
          var allMins = (this.state.currentWeek) * 90;



          console.log(this.state);

          for (var i=0; i<11; i++){
            outScore = outScore + this.tempArray[i].total_points

          //calc how many matches theyve missed
            var minsPlayed = this.tempArray[i].minutes;
            var minsMissed = allMins - minsPlayed;
            var matchesMissed = minsMissed/90;
            totalMatchesMissed = totalMatchesMissed + matchesMissed;
          }

          for (var i=11; i<15; i++){
            subScore = subScore + this.tempArray[i].total_points
          }

          var capMatchesMissed = 0;
          var vicePointsToAdd = 0


          for (var i=0; i<15; i++){

          //calc the highest score and highest scorer
            if (this.tempArray[i].total_points > highestScore && this.tempArray[i].is_cap != true){
              highestScore = this.tempArray[i].total_points;
              highestScorer = this.tempArray[i].web_name;
            }

            if (this.tempArray[i].total_points * 0.5 > highestScore && this.tempArray[i].is_cap == true){
              highestScore = this.tempArray[i].total_points * 0.5;
              highestScorer = this.tempArray[i].web_name;
            }
            if(this.tempArray[i].is_cap == true){
//how many matches did the captian miss?
              var minsPlayed = this.tempArray[i].minutes;
              var minsMissed = allMins - minsPlayed;
              var matchesMissed = minsMissed/90;
              capMatchesMissed = matchesMissed;
            }
          }

          for (var i=0; i<15; i++){
            let price = this.tempArray[i].now_cost / 10;
            totalCost += price; 
          }

          totalCost =  Math.round(totalCost * 100) / 100;

//calc the vice points to add
          for (var i=0; i<15; i++){
            if (this.tempArray[i].is_vice == true){
              var vicePPG = parseInt(this.tempArray[i].points_per_game);
              vicePointsToAdd = vicePPG * capMatchesMissed;
            }

          }

          vicePointsToAdd = Math.abs(parseFloat(vicePointsToAdd.toFixed()));


          averageSubScore = (subScore/4)/this.state.currentWeek;

          scoreToAddFromSubs = totalMatchesMissed * averageSubScore;

          scoreToAddFromSubs = Math.abs(parseFloat(scoreToAddFromSubs.toFixed()));

          this.setState({
            playerArray: this.tempArray,
            outfieldScore: outScore + scoreToAddFromSubs + vicePointsToAdd,
            subScore: subScore,
            highestScorer: highestScorer,
            highestScore: highestScore,
            captain: capt,
            captainScore: captScore,
            averageSubScore: averageSubScore,
            pointsComingOn: Math.abs(scoreToAddFromSubs),
            vicecaptScore: Math.abs(vicePointsToAdd),
            vicecapt: vicecapt,
            whatifValue: totalCost
        })
       }
      )
      .then(
        (result) => {
         fetch(url + "?csurl=https://fantasy.premierleague.com/api/entry/" + this.state.teamId +"/")
         .then(res => res.json())
          .then(
            (result) => {
                var teamName = result.player_first_name;
              const currentActual = result.summary_overall_points;
              const currentTransfers = result.last_deadline_total_transfers;
              const currentValue = result.last_deadline_value / 10;
              const currentRank = result.summary_overall_rank.toLocaleString();

                this.setState({
                teamName: teamName,
                currentActual,
                currentTransfers,
                currentValue,
                currentRank
                 });
            },
          )
        }
      ).then( response => {
        let leagueCounter = 1;
        for(var i=1; i<162; i++){ fetch(url+"?csurl=https://fantasy.premierleague.com/api/leagues-classic/314/standings/?page_standings=" +(i*1000)) .then(res=>res.json())
            .then(
              response => {
                let rank = response.standings.results[0].rank;
                let points = response.standings.results[0].total;
                
                leaguePositionArray[rank] = points;
                leagueCounter++;
              }
            ).then(
              response => {
                 if(leagueCounter === 161) {

                  let outfield = this.state.outfieldScore

                  function arraySearch(arr,val) {
                  let b = 1;
                  let counter = 0
                  for(b=val; b<val*10; b++){
                    for (var i=0; i<arr.length; i++)
                        if (arr[i] === b){                   
                            return i + counter;
                        }
                        counter+=100;
                   }
                    return false;
                  }

                   var whatIfRank = arraySearch(leaguePositionArray, outfield).toLocaleString();

                  this.setState({
                    whatIfRank
                  })
               }
            }

            )
       }
      }
      )
  },

  render() {
    const {whatIfRank, currentRank, error, currentValue, whatifValue, isLoaded, items, coreData, player, score, playerArray, currentActual, currentTransfers, outfieldScore, teamId, teamName, currentWeek, subScore, highestScorer, highestScore, captain, captainScore, pointsComingOn, vicecaptScore} = this.state;
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

          if(item.element_type == 1 && playerArray.indexOf(item) < 11){
             return <div key={item.id} className={"starter"}>
                <span className="pointSpan">{item.web_name} { item.is_cap == true ? '(c)' : item.is_vice == true ? '(vc)' : ''}</span>
                <span className="pointSpan">{item.total_points} points</span>
              </div>
            }

          })}

          </div>

          <div className={"playerbar"}>

          {playerArray.map(item => {

          if(item.element_type == 2 && playerArray.indexOf(item) < 11){
             return <div key={item.id} className={"starter"}>
                <span className="pointSpan">{item.web_name} { item.is_cap == true ? '(c)' : item.is_vice == true ? '(vc)' : ''}</span>
                <span className="pointSpan">{item.total_points} points</span>
              </div>
            }

          })}

          </div>

          <div className={"playerbar"}>


          {playerArray.map(item => {

            if(item.element_type == 3 && playerArray.indexOf(item) < 11){
             return <div key={item.id} className={"starter"}>
                <span className="pointSpan">{item.web_name} { item.is_cap == true ? '(c)' : item.is_vice == true ? '(vc)' : ''}</span>
                <span className="pointSpan">{item.total_points} points</span>
              </div>
            }

          })}

          </div>

          <div className={"playerbar"}>


          {playerArray.map(item => {

            if(item.element_type == 4 && playerArray.indexOf(item) < 11){
             return <div key={item.id} className={"starter"}>
                <span className="pointSpan">{item.web_name} { item.is_cap == true ? '(c)' : item.is_vice == true ? '(vc)' : ''}</span>
                <span className="pointSpan">{item.total_points} points</span>
              </div>
            }

          })}

          </div>

          <div className={"subbar"}>

          {playerArray.map(item => {

            if(playerArray.indexOf(item) >= 11){
             return <div key={item.id} className={"sub"}>
                <span className="pointSpan">{item.web_name} { item.is_cap == true ? '(c)' : item.is_vice == true ? '(vc)' : ''}</span>
                <span className="pointSpan">{item.total_points} points</span>
              </div>
            }

          })}

          </div>

      </div>

      {teamName.length > 0 &&
        <h1>{outfieldScore} points</h1>
      }

    {teamName.length > 0 &&

      <div>
       <p>If <strong>{teamName}</strong> had made no changes since GW1, their score would be <strong>{outfieldScore}.</strong> </p>
       <p>...with <strong>{pointsComingOn}</strong> points coming from the bench via automatic subs, and <strong>{vicecaptScore}</strong> extra points coming from their Vice Captain when their Captain didn't play.</p>
       <p>They captained {captain} who's scored {captainScore * 0.5} points so far. They should have captained {highestScorer}, who has {highestScore} points so far.</p>
       {captain == highestScorer &&
       <p>...wait... that's the same player! Good job picking your captain! </p>
       }
       {captain != highestScorer &&
       <p> If they had, their GW1 team would have {outfieldScore - (0.5 * captainScore) + highestScore} points!</p>
       }
       <p>Your current team value is <strong>{currentValue}</strong>. If you'd made no transfers, your team value would be <strong>{whatifValue}</strong>.</p>

      <p>Your current actual points are <strong> {currentActual} </strong>, and you've made {currentTransfers} transfers. So your transfer activity and captaincy choices have been <strong> worth a total of {currentActual - outfieldScore} points!</strong>  </p>
       
      <p>Check out how you'd be doing in your Mini League if every player hadn't made a change since Gameweek 1 using our <strong><a href='https://www.game-change.co.uk/2020/01/23/fpl-what-if-minileague-machine/'>What-if Mini League Machine!</a></strong></p>
      <p>Your current rank is <strong>{currentRank} </strong>. Your what-if rank would be <strong>{whatIfRank}</strong>.</p>

<p>You might also enjoy this clip of me using the What-if Machine and suffering as a result: </p>

<iframe width="560" height="315" src="https://www.youtube.com/embed/0soYZqA-m70" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
    }
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