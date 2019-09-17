import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


export default class ChipChecker extends Component {

  constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);



    this.state =  {
      coreData: '',
      isLoading: false,
      items: '',
      leagueId: '',
      managersArray: [],
      playerArray: [],
      currentWeek: '',
      leagueName: '',
      chips: '',
      chipNames: {
        1: 'wildcard',
        2: 'Wildcard 2',
        3: 'Free Hit',
        4: 'Triple Captain',
        5: 'Bench Boost'
    },
    finalChips: [],

    };
  }



  handleChange(event) {

    this.setState({leagueId: event.target.value,
              });
  }

  componentDidMount() {
const url = 'https://ffwhatif.herokuapp.com/proxy.php';
    fetch(url+"?csurl=https://fantasy.premierleague.com/api/bootstrap-static")
     .then(res => res.json())
     .then(
      (result) => {
      var currentWeek = result["current-event"];
      this.setState({
        coreData: result.elements,
        currentWeek: currentWeek,
        })
      })
  }

sort_by_key(array, key)
{
 return array.sort(function(a, b)
 {
  var x = a[key]; var y = b[key];
  return ((x < y) ? 1 : ((x > y) ? -1 : 0));
 });
}




  onButtonClick() {


    let varItems = '';
    let chips = '';
    this.tempArray = [];
    this.playerAndChipArray = [];
    this.leagueName = '';
    let teamId = '';
    let name = '';
    let teamName = '';
    let points = '';
const url = 'https://ffwhatif.herokuapp.com/proxy.php';
      this.setState({
        isLoading: true
      })

    fetch("/todos/fish/" + this.state.leagueId)
      .then(res => res.json())
      .then(res => JSON.parse(res))
      .then(
      response => {
        varItems = response.standings.results;
        this.leagueName = response.league.name;
        for (var i=0; i<varItems.length; i++){
          this.tempArray.push(varItems[i].entry);
        }
      },
      ).then( response => {
        for(var i=0; i<this.tempArray.length; i++){ fetch(url+"?csurl=https://fantasy.premierleague.com/api/entry/" + this.tempArray[i] + "/history/") .then(res=>res.json())
            .then(
              response => {
                chips = response.chips;
                this.playerAndChipArray.push({'points':points, 'chips':chips});
                // teamId = varItems[i].id;
                // name = varItems[i].player_name;
                // teamName = varItems[i].entry_name;
                // points = varItems[i].total;
                // this.playerAndChipArray.push({'id':teamId, 'teamName': teamName, 'name':name, 'points':points, 'chips':chips})
              }
            ).then(
              response => {
                if(this.tempArray.length == this.playerAndChipArray.length) {
                  for (var i=0; i<this.playerAndChipArray.length; i++){
                      var chips = this.playerAndChipArray[i].chips;
                      var thisGuysChips = [];
                      for (var b=0; b<chips.length; b++) {
                          var chipNumber = chips[b].name;
                          thisGuysChips.push(chipNumber)
                      }
                      this.playerAndChipArray[i].chipNumbers = thisGuysChips;

                      this.playerAndChipArray[i].id = varItems[i].id;
                      this.playerAndChipArray[i].name = varItems[i].player_name;
                      this.playerAndChipArray[i].teamName = varItems[i].entry_name;
                      this.playerAndChipArray[i].points = varItems[i].total;
                  }

                   this.setState({
                    finalChips: this.sort_by_key(this.playerAndChipArray, 'points'),
                    leagueName: this.leagueName,
                    isLoading: false
                  })
              }
            }

            )

        }
       }
      )


  }

  render() {
    const {
    error,
    coreData,
      isLoading,
      chips,
      finalChips,
      leagueId,
      leagueName} = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;}
                 else {
                  return (
            <div>
            <div className='entries'>
              <div className="input-group mb-3">
              <input type="text" className={"mainInput"} value={this.state.leagueId} onChange={this.handleChange} />
              <div className="input-group-append">
                <button type="button"
                onClick={()=>{this.onButtonClick();}}
                style={{cursor:'pointer'}}
                className={'whatifButton btn btn-outline-secondary'}
                disabled={!leagueId}
                > Calculate
                </button>
                </div>
              </div>
            </div>
            {leagueName.length > 0 &&
              <h2>League: {leagueName} </h2>
            }

            {isLoading === true &&
              <div>Preparing data...</div>
            }

            {leagueName.length > 0 &&
            <table className='table table-hover table-dark table-striped'>
            <thead>

            <tr>

            <th>Player</th>

            <th>Team</th>

            <th>Points</th>

            <th>Wildcard 1</th>

            <th>Wildcard 2</th>

            <th>Free Hit</th>

            <th>Triple Captain</th>

            <th>Bench Boost</th>


                      </tr>


                    </thead>

            <tbody>
                    {Object.keys(finalChips).map(function(key) {
                        return <tr className='playerRow'>

            <td className='playerName'> {finalChips[key].name}</td>

            <td className='chipCheck'>{finalChips[key].teamName}</td>

            <td className='points'>{finalChips[key].points}</td>

            <td className={(finalChips[key].chipNumbers.indexOf('wildcard') != -1) ? "usedChip" : "notUsed"}>{(finalChips[key].chipNumbers.indexOf('wildcard') != -1) ? 'Used' : 'X'}</td>

            <td className={(finalChips[key].chipNumbers.indexOf('wildcard2') != -1) ? "usedChip" : "notUsed"}>{(finalChips[key].chipNumbers.indexOf('wildcard2') != -1) ? 'Used' : 'X'}</td>

            <td className={(finalChips[key].chipNumbers.indexOf('freehit') != -1) ? "usedChip" : "notUsed"}>{(finalChips[key].chipNumbers.indexOf('freehit') != -1) ? 'Used' : 'X'}</td>

            <td className={(finalChips[key].chipNumbers.indexOf('3xc') != -1) ? "usedChip" : "notUsed"}>{(finalChips[key].chipNumbers.indexOf('3xc') != -1) ? 'Used' : 'X'}</td>

            <td className={(finalChips[key].chipNumbers.indexOf('bboost') != -1) ? "usedChip" : "notUsed"}>{(finalChips[key].chipNumbers.indexOf('bboost') != -1) ? 'Used' : 'X'}</td>


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