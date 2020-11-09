<script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.5.4/react.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.5.4/react-dom.min.js"></script>
<script src="https://unpkg.com/babel-standalone@6.15.0/babel.min.js"></script>

Use this tool to get an overview of the overall player ownership in your Mini-League.

It shows every single player owned in your league, and what percentage of managers in your league own that player.

Just enter your league ID (the number in the URL when you view your league on the official FPL site!) in the box below, and click 'Calculate'.

Other FPL Tools <a href="https://www.game-change.co.uk/fpl-tools/">right here</a>.

The excellent book on Mastering FPL from Amazon, <a href="https://www.amazon.co.uk/gp/product/1787290166/ref=as_li_tl?ie=UTF8&amp;tag=gamechangecou-21&amp;camp=1634&amp;creative=6738&amp;linkCode=as2&amp;creativeASIN=1787290166&amp;linkId=39f86dd05dbca8fec11f46de1daeb93a"><strong><em>Wasting your Wildcard, </em>is available from Amazon here.</strong></a>
<div id="root" style="width: 100%;"></div>
<pre><script type="text/babel">

  var WhatIf = React.createClass({
  getInitialState: function() {
    return { 
      coreData:'',
          isLoaded: false,
          items: '',
          leagueId: '',
          managersArray: [],
          playerArray: [],
          currentWeek: '',
          leagueName: ''
    };
  },



  handleChange(event) {

    this.setState({leagueId: event.target.value,
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
         events.forEach(function (element) {
           if (element.finished === true) {
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
let varItems = '';
    this.tempArray = [];
    let picks = '';
    this.tempPlayerArray = [];
    this.leagueName = ''
    let url = 'https://ffwhatif.herokuapp.com/proxy.php';

    fetch(url+"?csurl=https://fantasy.premierleague.com/api/leagues-classic/" + this.state.leagueId + "/standings/")
      .then(res => res.json())
      .then(
      response => {
        varItems = response.standings.results;
        this.leagueName = response.league.name;
        for (var i=0; i<varItems.length; i++){
          this.tempArray.push(varItems[i].entry)
        }
       },
      ).then(
        response => {

        for(var i=0; i<this.tempArray.length; i++){
          fetch(url+"?csurl=https://fantasy.premierleague.com/api/entry/" + this.tempArray[i] + "/event/" + this.state.currentWeek + "/picks/")
            .then(res=> res.json())
            .then(
              response => {
                picks = response.picks;
                for (var i=0; i<picks.length; i++){
                  this.tempPlayerArray.push(picks[i].element)
                }
              }
            )
            .then(
            response => {
              if(this.tempPlayerArray.length >= this.tempArray.length * 15){
                console.log(this.tempPlayerArray);

                var nameArray = [];

                for (var i=0; i<this.tempPlayerArray.length; i++){
                  var player = (this.state.coreData.find(theplayer => theplayer.id === this.tempPlayerArray[i]))
                  nameArray.push(player.web_name)
                }

                function foo(arr) {
                    var a = [], b = [], prev;
                    arr.sort();
                    for ( var i = 0; i < arr.length; i++ ) {
                        if ( arr[i] !== prev ) {
                            a.push(arr[i]);
                            b.push(1);
                        } else {
                            b[b.length-1]++;
                        }
                        prev = arr[i];
                    }
                    return [a, b];
                }

                var figures = foo(nameArray)
                var totalManagers = this.tempArray.length

                var percentageArray = figures[1].map(function(x) { return Math.round(((x/totalManagers)*100) * 10)/10; });

                var myObj = figures[0].reduce((acc, value, i) => (acc[value] = percentageArray[i], acc), {});

                var sortedTotals = Object.keys(myObj).sort((b, a) => myObj[a]-myObj[b]).reduce((_sortedObj, key) => ({..._sortedObj, [key]: myObj[key]}), {})

                this.setState({
                  playerArray: sortedTotals,
                  leagueName:this.leagueName
                })

                }
              }
            )
        }

       },
      )

      
  },

  render() {
    const {
    error,
    coreData,
      isLoaded,
      items,
      leagueId,
      managersArray,
      playerArray,
      currentWeek,
      leagueName} = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else {
      return (
      <div>
      <div className="input-group mb-3 entries">
        <input type="text" value={this.state.leagueId} onChange={this.handleChange} />
        <div className="input-group-append">
          <button type="button"
              onClick={()=>{this.onButtonClick();}}
              style={{cursor:'pointer', backgroundColor:'darkred', color:'white', border:'0px', margin:'0 auto', height:'38px'}}
              className='whatifButton btn btn-outline-secondary'
              disabled={!leagueId}
            > Calculate</button>
        </div>
      </div>

  {leagueName.length > 0 &&
      <h2>League: {leagueName} </h2>
    }


 {leagueName.length > 0 &&
      <table className="table">
        <thead>
          <tr>
            <th>Player</th>
            <th>Percentage Owned</th>
          </tr>

        </thead>

       <tbody>
        {Object.keys(playerArray).map(function(key) {
            return <tr className='playerRow'>
                      <td className='playerName'> {key}</td>
                      <td className='playerPerc'>{playerArray[key]}</td>
                    </tr>
        })}
        </tbody>
      </table>
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
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-format="autorelaxed"
     data-ad-client="ca-pub-1339622383803601"
     data-ad-slot="1810839493"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>