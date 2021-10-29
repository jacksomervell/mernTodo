import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { isEmptyStatement } from '@babel/types';


export default class FplMyTools extends Component {


// - [ ] most captain points
// - [ ] Highest TV https://fantasy.premierleague.com/api/entry/133292/history/
// - [ ] Lowest TV https://fantasy.premierleague.com/api/entry/133292/history/
// - [ ] costly attack
// - [ ] costly mid
// - [ ] costly def
// - [ ] formations populatiry
// - [ ] most transfers
// - [ ] most vice cap points
// Chips used https://fantasy.premierleague.com/api/entry/133292/history/
// - [ ] most benched points
// - [ ] most hits https://fantasy.premierleague.com/api/entry/133292/history/
// - [ ] Who leaves the most points on the bench https://fantasy.premierleague.com/api/entry/133292/history/

  constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.onSort = this.onSort.bind(this)

        this.state = {
       coreData:'',
       currentWeek:'',
       leagueId:'',
       arrayOfScores: [],
       leagueLength: 0,
       loading: false,
       historyData: [],
       pointsLeader: '',
       valueLeader: '',
       transfersLeader: '',
                        scoredLeader: '',
                        assistsLeader: '',
                        bonusLeader: '',
                        clean_sheetsLeader : '',
                        goals_concededLeader: '',
                        minutesLeader: '',
                        own_goalsLeader: '',
                        penalties_missedLeader: '',
                        red_cardsLeader: '',
                        savesLeader: '',
                        yellow_cardsLeader: '',
                        benchPointsLeader: '',
                        allWinners: [],
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
        events.forEach(function(element) {
          if(element.finished === true){
            currentWeek = element.id;
            console.log(currentWeek);
          }
        });

      this.setState({
        coreData: result.elements,
        currentWeek: currentWeek,
        })
      })
      .then(
      (result) => {
        this.historyArray = [];
          for(var i=1;i<38;i++){
            fetch(url+"?csurl=https://fantasy.premierleague.com/api/event/"+i+"/live/")
            .then(res => res.json())
            .then(
                (result) => {
                    this.historyArray.push(result.elements);
                }
            )
            .then(
                (result) => {
                    if(this.historyArray.length >= 37){
                        //get rid of empty arrays from array
                        this.historyArray = this.historyArray.filter(function (el) { return el.length > 0 });
                        //an array of every players performance in each gameweek.
                        console.log(this.historyArray.length);
                        this.setState({
                            historyData: this.historyArray
                        })
                    }
                }
            )   
          }
      }
      )
  }


  onButtonClick(){
    let varItems = '';
    this.tempArray = [];
    this.leagueName = ''
    this.allScores = [];
    this.setState({
      loading: true,
      arrayOfScores: []
    })

    const url = 'https://ffwhatif.herokuapp.com/proxy.php';

    fetch(url+"?csurl=https://fantasy.premierleague.com/api/leagues-classic/" + this.state.leagueId + "/standings/")
      .then(res => res.json())
      .then(
        response => {
          varItems = response.standings.results;
          varItems = varItems.slice(0,50);
          this.leagueName = response.league.name;
          for (var i = 0; i < varItems.length; i++) {
            this.tempArray.push(varItems[i].entry)
          }
          this.setState({
            leagueLength: this.tempArray.length
          })
        },
      ).then(
        response => {

        const whatIfForTeam = this.whatIfForTeam;
        const tempArray = this.tempArray;

        for (const listItem of tempArray) {
          whatIfForTeam(listItem);
        }

        //  tempArray.forEach(function(listItem, index){
        //   whatIfForTeam(listItem);
        //  });

      }
        )
  }

  onSort(event, sortKey) {
    const data = this.state.arrayOfScores;
    data.sort((a, b) => b[sortKey] - a[sortKey])
    this.setState({ data })
  }



  whatIfForTeam = (teamId) => {

    let playerName = '';
    let varItems = ''
    let tempArray = [];
    this.state.playerArray = [];
    let outfieldscore = '';

    const url = 'https://ffwhatif.herokuapp.com/proxy.php';

    let goalsScored = 0;
    let assists = 0;
    let bps = 0;
    let conceded = 0;
    let minutes = 0;
    let ownGoals = 0;
    let penaltiesMissed = 0;
    let penaltiesSaved = 0;
    let redCards = 0;
    let saves = 0;
    let yellows = 0;
    let cleanSheets = 0;
    let benchPoints = 0;
    let thisTeam = '';

    for(let b=1;b<=this.state.historyData.length;b++){
            Promise.all([
                fetch(url + "?csurl=https://fantasy.premierleague.com/api/entry/" + teamId +"/"),
                fetch(url + "?csurl=https://fantasy.premierleague.com/api/entry/" + teamId +"/history/"),
                fetch(url+"?csurl=https://fantasy.premierleague.com/api/entry/" + teamId + "/event/"+b+"/picks/")
            ])
        //  fetch(url + "?csurl=https://fantasy.premierleague.com/api/entry/" + teamId +"/")
         .then(([res1, res2, res3]) => Promise.all([res1.json(), res2.json(), res3.json()]))
          .then(
            ([res1, res2, res3]) => {
              let counter = 0;
              let location = b-1;
              for(var q=0; q<11;q++){
                  if(this.state.historyData[location].length){ 
                    let thisPlayer = res3.picks[q].element -1;
                    let thisPlayerData = this.state.historyData[location][thisPlayer].stats;
                      
                      goalsScored += thisPlayerData.goals_scored;
                      bps += thisPlayerData.bonus;
                      conceded += thisPlayerData.goals_conceded;
                      minutes += thisPlayerData.minutes;
                      ownGoals += thisPlayerData.own_goals;
                      penaltiesMissed += thisPlayerData.penalties_missed;
                      penaltiesSaved += thisPlayerData.penalties_saved;
                      redCards += thisPlayerData.red_cards;
                      saves += thisPlayerData.saves;
                      yellows += thisPlayerData.yellow_cards;
                      cleanSheets += thisPlayerData.clean_sheets;
                      assists += thisPlayerData.assists;
                  }
                  counter = counter+1;
                  console.log(counter);
                }

              if(b==this.state.historyData.length && counter == 11){
                var teamName = res1.player_first_name + ' ' + res1.player_last_name;
                var points = res1.summary_overall_points;
                var value = res1.last_deadline_value / 10;
                var transfers = res1.last_deadline_total_transfers;

                var benchPoints = 0;

                var res2Weeklies = res2.current;

                res2Weeklies.forEach(element =>  benchPoints += element.points_on_bench);

                thisTeam = {
                  teamName: teamName,
                  points,
                  value,
                  transfers,
                  team:teamId, 
                  scored:goalsScored,
                  assists: assists,
                  bonus: bps,
                  clean_sheets: cleanSheets,
                  goals_conceded: conceded,
                  minutes: minutes,
                  own_goals: ownGoals,
                  penalties_missed: penaltiesMissed,
                  penalties_saved: penaltiesSaved,
                  red_cards: redCards,
                  saves: saves,
                  yellow_cards: yellows,
                  benchPoints: benchPoints}
              

                    this.setState({ loading: false, arrayOfScores: [...this.state.arrayOfScores, thisTeam ] })
              
                  }
                }
          ).then(
                (result) => {
                    if(this.state.leagueLength == this.state.arrayOfScores.length){
                        var a = this.state.arrayOfScores;
                        var points = Math.max(...a.map(o=>o.points));
                        var value = Math.max(...a.map(o=>o.value));
                        var transfers = Math.max(...a.map(o=>o.transfers));
                        var scored = Math.max(...a.map(o=>o.scored));
                        var assists = Math.max(...a.map(o=>o.assists));
                        var bonus = Math.max(...a.map(o=>o.bonus));
                        var clean_sheets = Math.max(...a.map(o=>o.clean_sheets));
                        var goals_conceded = Math.max(...a.map(o=>o.goals_conceded));
                        var minutes = Math.max(...a.map(o=>o.minutes));
                        var own_goals = Math.max(...a.map(o=>o.own_goals));
                        var penalties_missed = Math.max(...a.map(o=>o.penalties_missed));
                        var red_cards = Math.max(...a.map(o=>o.red_cards));
                        var saves = Math.max(...a.map(o=>o.saves));
                        var yellow_cards = Math.max(...a.map(o=>o.yellow_cards));                        
                        var benchPoints = Math.max(...a.map(o=>o.benchPoints));
                        //put them all into an array of objects and setstate with this one object

                        this.setState({
                            benchPointsLeader:a.find(function(o){ return o.benchPoints == benchPoints; }),
                            yellow_cardsLeader: a.find(function(o){ return o.yellow_cards == yellow_cards; }),
                            savesLeader: a.find(function(o){ return o.saves == saves; }),
                            red_cardsLeader: a.find(function(o){ return o.red_cards == red_cards; }),
                            penalties_missedLeader: a.find(function(o){ return o.penalties_missed == penalties_missed; }),
                            own_goalsLeader:a.find(function(o){ return o.own_goals == own_goals; }),
                            minutesLeader:a.find(function(o){ return o.minutes == minutes; }),
                            goals_concededLeader: a.find(function(o){ return o.goals_conceded == goals_conceded; }),
                            clean_sheetsLeader:a.find(function(o){ return o.clean_sheets == clean_sheets; }),
                            bonusLeader:a.find(function(o){ return o.bonus == bonus; }),
                            assistsLeader:a.find(function(o){ return o.assists == assists; }),
                            scoredLeader:a.find(function(o){ return o.scored == scored; }),
                            transfersLeader:a.find(function(o){ return o.transfers == transfers; }),
                            valueLeader: a.find(function(o){ return o.value == value; }),
                            pointsLeader:a.find(function(o){ return o.points == points; }),
                         });
                    }
                }
            )
        }
  }

  render() {
    const { error, arrayOfScores, currentWeek, leagueLength, loading,
        pointsLeader,
        valueLeader,
        transfersLeader,
                         scoredLeader,
                         assistsLeader,
                         bonusLeader,
                         clean_sheetsLeader,
                         goals_concededLeader,
                         minutesLeader,
                         own_goalsLeader,
                         penalties_missedLeader,
                         red_cardsLeader,
                         savesLeader,
                         yellow_cardsLeader,
                         benchPointsLeader, historyData} = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else {
      return (
        <div>
      <div className="input-group mb-3">
      <input type="text" className={"mainInput"} value={this.state.leagueId} onChange={this.handleChange} />
        <div className="input-group-append">
           <button type="button"
            onClick={()=>{this.onButtonClick();}}
            style={{cursor:'pointer'}}
           className={'whatifButton btn btn-outline-secondary'}
           disabled={!historyData.length >= currentWeek}
            > Calculate
          </button>
        </div>
      </div>
      { loading ? <p>Loading...</p> : <span></span>}

      { arrayOfScores.length >= leagueLength &&
      <div style={{textAlign:'center'}}>
      <div style={{margin:'10px', display:'inline'}}>
        <div className={"sub"} style={{padding:'0px'}}>
                <span className="pointSpan" style={{borderColor:'1px solid black', backgroundColor:'green', color:'white', padding:'4px'}}>Most Points Benched</span>
                <span className="pointSpan" style={{padding:'4px'}}>{benchPointsLeader.teamName}</span>
                <span className="pointSpan" style={{padding:'4px'}}>{benchPointsLeader.benchPoints} points</span>
              </div>
      </div>
      <div style={{margin:'10px', display:'inline'}}>
        <div className={"sub"} style={{padding:'0px'}}>
                <span className="pointSpan" style={{borderColor:'1px solid black', backgroundColor:'green', color:'white', padding:'4px'}}>Most Points</span>
                <span className="pointSpan" style={{padding:'4px'}}>{pointsLeader.teamName}</span>
                <span className="pointSpan" style={{padding:'4px'}}>{pointsLeader.points} points</span>
              </div>
      </div>
      <div style={{margin:'10px', display:'inline'}}>
        <div className={"sub"} style={{padding:'0px'}}>
                <span className="pointSpan" style={{borderColor:'1px solid black', backgroundColor:'green', color:'white', padding:'4px'}}>Highest Value</span>
                <span className="pointSpan" style={{padding:'4px'}}>{valueLeader.teamName}</span>
                <span className="pointSpan" style={{padding:'4px'}}>£{valueLeader.value}m</span>
              </div>
      </div>
      <div style={{margin:'10px', display:'inline'}}>
        <div className={"sub"} style={{padding:'0px'}}>
                <span className="pointSpan" style={{borderColor:'1px solid black', backgroundColor:'green', color:'white', padding:'4px'}}>Most Transfers</span>
                <span className="pointSpan" style={{padding:'4px'}}>{transfersLeader.teamName}</span>
                <span className="pointSpan" style={{padding:'4px'}}>{transfersLeader.transfers}</span>
              </div>
      </div>
      <div style={{margin:'10px', display:'inline'}}>
        <div className={"sub"} style={{padding:'0px'}}>
                <span className="pointSpan" style={{borderColor:'1px solid black', backgroundColor:'green', color:'white', padding:'4px'}}>Most Goals</span>
                <span className="pointSpan" style={{padding:'4px'}}>{scoredLeader.teamName}</span>
                <span className="pointSpan" style={{padding:'4px'}}>{scoredLeader.scored}</span>
              </div>
      </div>
      <div style={{margin:'10px', display:'inline'}}>
        <div className={"sub"} style={{padding:'0px'}}>
                <span className="pointSpan" style={{borderColor:'1px solid black', backgroundColor:'green', color:'white', padding:'4px'}}>Most Assists</span>
                <span className="pointSpan" style={{padding:'4px'}}>{assistsLeader.teamName}</span>
                <span className="pointSpan" style={{padding:'4px'}}>{assistsLeader.assists}</span>
              </div>
      </div>
      <div style={{margin:'10px', display:'inline'}}>
        <div className={"sub"} style={{padding:'0px'}}>
                <span className="pointSpan" style={{borderColor:'1px solid black', backgroundColor:'green', color:'white', padding:'4px'}}>Most Bonus Points</span>
                <span className="pointSpan" style={{padding:'4px'}}>{bonusLeader.teamName}</span>
                <span className="pointSpan" style={{padding:'4px'}}>{bonusLeader.bonus} points</span>
              </div>
      </div>
      <div style={{margin:'10px', display:'inline'}}>
        <div className={"sub"} style={{padding:'0px'}}>
                <span className="pointSpan" style={{borderColor:'1px solid black', backgroundColor:'green', color:'white', padding:'4px'}}>Most Clean Sheets</span>
                <span className="pointSpan" style={{padding:'4px'}}>{clean_sheetsLeader.teamName}</span>
                <span className="pointSpan" style={{padding:'4px'}}>{clean_sheetsLeader.clean_sheets}</span>
              </div>
      </div>
      <div style={{margin:'10px', display:'inline'}}>
        <div className={"sub"} style={{padding:'0px'}}>
                <span className="pointSpan" style={{borderColor:'1px solid black', backgroundColor:'green', color:'white', padding:'4px'}}>Most Goals Conceded</span>
                <span className="pointSpan" style={{padding:'4px'}}>{goals_concededLeader.teamName}</span>
                <span className="pointSpan" style={{padding:'4px'}}>{goals_concededLeader.goals_conceded}</span>
              </div>
      </div>
      <div style={{margin:'10px', display:'inline'}}>
        <div className={"sub"} style={{padding:'0px'}}>
                <span className="pointSpan" style={{borderColor:'1px solid black', backgroundColor:'green', color:'white', padding:'4px'}}>Most Minutes</span>
                <span className="pointSpan" style={{padding:'4px'}}>{minutesLeader.teamName}</span>
                <span className="pointSpan" style={{padding:'4px'}}>{minutesLeader.minutes} minutes</span>
              </div>
      </div>
      <div style={{margin:'10px', display:'inline'}}>
        <div className={"sub"} style={{padding:'0px'}}>
                <span className="pointSpan" style={{borderColor:'1px solid black', backgroundColor:'green', color:'white', padding:'4px'}}>Most Own Goals</span>
                <span className="pointSpan" style={{padding:'4px'}}>{own_goalsLeader.teamName}</span>
                <span className="pointSpan" style={{padding:'4px'}}>{own_goalsLeader.own_goals}</span>
              </div>
      </div>
      <div style={{margin:'10px', display:'inline'}}>
        <div className={"sub"} style={{padding:'0px'}}>
                <span className="pointSpan" style={{borderColor:'1px solid black', backgroundColor:'green', color:'white', padding:'4px'}}>Pens Missed</span>
                <span className="pointSpan" style={{padding:'4px'}}>{penalties_missedLeader.teamName}</span>
                <span className="pointSpan" style={{padding:'4px'}}>{penalties_missedLeader.penalties_missed}</span>
              </div>
      </div><div style={{margin:'10px', display:'inline'}}>
      <div className={"sub"} style={{padding:'0px'}}>
              <span className="pointSpan" style={{borderColor:'1px solid black', backgroundColor:'green', color:'white', padding:'4px'}}>Most Red Cards</span>
              <span className="pointSpan" style={{padding:'4px'}}>{red_cardsLeader.teamName}</span>
              <span className="pointSpan" style={{padding:'4px'}}>{red_cardsLeader.red_cards}</span>
            </div>
    </div><div style={{margin:'10px', display:'inline'}}>
    <div className={"sub"} style={{padding:'0px'}}>
            <span className="pointSpan" style={{borderColor:'1px solid black', backgroundColor:'green', color:'white', padding:'4px'}}>Most Saves</span>
            <span className="pointSpan" style={{padding:'4px'}}>{savesLeader.teamName}</span>
            <span className="pointSpan" style={{padding:'4px'}}>{savesLeader.saves}</span>
          </div>
  </div><div style={{margin:'10px', display:'inline'}}>
  <div className={"sub"} style={{padding:'0px'}}>
          <span className="pointSpan" style={{borderColor:'1px solid black', backgroundColor:'green', color:'white', padding:'4px'}}>Most Yellow Cards</span>
          <span className="pointSpan" style={{padding:'4px'}}>{yellow_cardsLeader.teamName}</span>
          <span className="pointSpan" style={{padding:'4px'}}>{yellow_cardsLeader.yellow_cards}</span>
        </div>
</div>                  
      </div>
    }

      { arrayOfScores.length > 1 && arrayOfScores.length >= leagueLength &&
          <table className="table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Manager</th>
                <th onClick={e => this.onSort(e, 'points')} style={{cursor:'pointer', 'box-shadow':'inset 0 -3px 0 0 green'}}>Points</th>
                <th onClick={e => this.onSort(e, 'scored')} style={{cursor:'pointer', 'box-shadow':'inset 0 -3px 0 0 green'}}>Goals Scored</th>
                <th onClick={e => this.onSort(e, 'assists')} style={{cursor:'pointer', 'box-shadow':'inset 0 -3px 0 0 green'}}>Assists</th>
                <th onClick={e => this.onSort(e, 'bonus')} style={{ cursor: 'pointer', 'box-shadow': 'inset 0 -3px 0 0 green' }}>Bonus Points</th>
                <th onClick={e => this.onSort(e, 'clean_sheets')} style={{ cursor: 'pointer', 'box-shadow': 'inset 0 -3px 0 0 green' }}>Clean Sheets</th>
                <th onClick={e => this.onSort(e, 'goals_conceded')} style={{ cursor: 'pointer', 'box-shadow': 'inset 0 -3px 0 0 green' }}>Goals Conceded</th>
                <th onClick={e => this.onSort(e, 'minutes')} style={{ cursor: 'pointer', 'box-shadow': 'inset 0 -3px 0 0 green' }}>Minutes</th>
                <th onClick={e => this.onSort(e, 'own_goals')} style={{ cursor: 'pointer', 'box-shadow': 'inset 0 -3px 0 0 green' }}>Own Goals</th>
                <th onClick={e => this.onSort(e, 'penalties_missed')} style={{ cursor: 'pointer', 'box-shadow': 'inset 0 -3px 0 0 green' }}>Pens Missed</th>
                <th onClick={e => this.onSort(e, 'penalties_saved')} style={{ cursor: 'pointer', 'box-shadow': 'inset 0 -3px 0 0 green' }}>Pens Saved</th>
                <th onClick={e => this.onSort(e, 'red_cards')} style={{ cursor: 'pointer', 'box-shadow': 'inset 0 -3px 0 0 green' }}>Reds</th>
                <th onClick={e => this.onSort(e, 'yellow_cards')} style={{ cursor: 'pointer', 'box-shadow': 'inset 0 -3px 0 0 green' }}>Yellows</th>
                <th onClick={e => this.onSort(e, 'benchPoints')} style={{ cursor: 'pointer', 'box-shadow': 'inset 0 -3px 0 0 green' }}>Points benched</th>
                <th onClick={e => this.onSort(e, 'value')} style={{ cursor: 'pointer', 'box-shadow': 'inset 0 -3px 0 0 green' }}>Value</th>
                <th onClick={e => this.onSort(e, 'transfers')} style={{ cursor: 'pointer', 'box-shadow': 'inset 0 -3px 0 0 green' }}>Transfers made</th>
              </tr>
            </thead>
            <tbody>
              {arrayOfScores.map(function (account, index) {
                return (
                  <tr key={index} data-item={account}>
                    <td data-title="Rank">{index + 1}</td>
                    <td data-title="Scored">{account.teamName}</td>
                    <td data-title="Score">{account.points}</td>
                    <td data-title="Score">{account.scored}</td>
                    <td data-title="Score">{account.assists}</td>
                    <td data-title="Score">{account.bonus}</td>
                    <td data-title="Score">{account.clean_sheets}</td>
                    <td data-title="Score">{account.goals_conceded}</td>
                    <td data-title="Score">{account.minutes}</td>
                    <td data-title="Score">{account.own_goals}</td>
                    <td data-title="Score">{account.penalties_missed}</td>
                    <td data-title="Score">{account.penalties_saved}</td>
                    <td data-title="Score">{account.red_cards}</td>
                    <td data-title="Score">{account.yellow_cards}</td>
                    <td data-title="Score">{account.benchPoints}</td>
                    <td data-title="Score">{account.value}</td>
                    <td data-title="Score">{account.transfers}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
      }

      </div>
      )
    }
  }

}