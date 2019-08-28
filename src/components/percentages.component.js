 import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default class PercTable extends Component {

  constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);

        this.state = {
          coreData:'',
          isLoaded: false,
          items: '',
          leagueId: '',
          managersArray: [],
          playerArray: [],
          currentWeek: '',
          leagueName: ''
    }

   }



  handleChange(event) {

    this.setState({leagueId: event.target.value,
              });
  }

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
    axios.get('http://localhost:4000/todos/fish')
      .then(res => console.log(res));
  }


  logMeIn() {
    let url = 'https://ffwhatif.herokuapp.com/proxy.php';

    fetch(url+'?csurl=https://users.premierleague.com/accounts/login', {
      method: 'POST',
      // credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: JSON.stringify({
        'login': 'jacksomervell@gmail.com',
        'password': '',
        'app': 'plfpl-web',
        'redirect_uri': 'https://fantasy.premierleague.com/'
      })
    }).then(function (res) {
      console.log(res);
    }
    )
  }


  onButtonClick() {
    let varItems = '';
    this.tempArray = [];
    let picks = '';
    this.tempPlayerArray = [];
    this.leagueName = ''
    let url = 'https://ffwhatif.herokuapp.com/proxy.php';
    fetch("https://fantasy.premierleague.com/api/leagues-classic/" + this.state.leagueId + "/standings/", {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'json',
      },
      data: JSON.stringify({
        'login': 'jacksomervell@gmail.com',
        'password': 'littlederek12',
        'app': 'plfpl-web',
        'redirect_uri': 'https://fantasy.premierleague.com/'
      })
    })
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


  }

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
              style={{cursor:'pointer'}}
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

}