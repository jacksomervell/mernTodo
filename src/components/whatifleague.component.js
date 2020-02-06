import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { isEmptyStatement } from '@babel/types';


export default class WhatIfLeague extends Component {

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
          }
        });


      this.setState({
        coreData: result.elements,
        currentWeek: currentWeek,
        })
      })
  }


  onButtonClick(){

    let varItems = '';
    this.tempArray = [];
    this.leagueName = ''
    this.allScores = [];


    fetch("https://fierce-chamber-40748.herokuapp.com/todos/fish/" + this.state.leagueId)
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

         tempArray.forEach(function(listItem, index){
          whatIfForTeam(listItem);
         });

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
    var capt = '';
    var captScore = '';
    var vicecapt = '';
    var vicecaptScore = '';
    let outfieldscore = '';

    const url = 'https://ffwhatif.herokuapp.com/proxy.php';

    fetch(url+"?csurl=https://fantasy.premierleague.com/api/entry/" + teamId + "/event/1/picks/")
      .then(res => res.json())
      .then(
      (result) => {
        varItems = result;

        if(varItems.detail == 'Not found.'){
          // this.setState({ arrayOfScores: [...this.state.arrayOfScores, {teamName: teamId + ' did not join in GW1', outfieldscore: 0}] })
          return;
        }

        for (var i=0; i<15; i++){
          tempArray.push(this.state.coreData.find(theplayer => theplayer.id === varItems.picks[i].element))
          console.log(tempArray[i].total_points);


          if(tempArray[i].is_cap == true){
            tempArray[i].total_points = 0.5 * tempArray[i].total_points;
            tempArray[i].is_cap = false;
          }

          if(varItems.picks[i].is_captain == true && tempArray[i].is_cap != true){
            tempArray[i].is_cap = true
            tempArray[i].total_points = tempArray[i].total_points * 2;
            capt = tempArray[i].web_name;
            captScore = tempArray[i].total_points;
            }

//vice stuff here

            if(varItems.picks[i].is_vice_captain == true && tempArray[i].is_vice != true){
            tempArray[i].is_vice = true
            vicecapt = tempArray[i].web_name;
            vicecaptScore = tempArray[i].total_points;
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

//get the total mmax mins played for the seaosn so far
          var allMins = this.state.currentWeek * 90;

          if(tempArray.length < 1){
            return;
          }
          console.log(tempArray);
          for (var i=0; i<11; i++){

            if(isNaN(tempArray[i].total_points)){
              outScore = outScore + 0;
            } else {
            outScore = outScore + tempArray[i].total_points
            }
            console.log(outScore);
          //calc how many matches theyve missed
            var minsPlayed = tempArray[i].minutes;
            var minsMissed = allMins - minsPlayed;
            var matchesMissed = minsMissed/90;
            totalMatchesMissed = totalMatchesMissed + matchesMissed;
          }

          for (var i=11; i<15; i++){
            subScore = subScore + tempArray[i].total_points
          }

          var capMatchesMissed = 0;
          var vicePointsToAdd = 0


          for (var i=0; i<15; i++){

          //calc the highest score and highest scorer
            if (tempArray[i].total_points > highestScore && tempArray[i].is_cap != true){
              highestScore = tempArray[i].total_points;
              highestScorer = tempArray[i].web_name;
            }

            if (tempArray[i].total_points * 0.5 > highestScore && tempArray[i].is_cap == true){
              highestScore = tempArray[i].total_points * 0.5;
              highestScorer = tempArray[i].web_name;
//how many matches did the captian miss?
              var minsPlayed = tempArray[i].minutes;
              var minsMissed = allMins - minsPlayed;
              var matchesMissed = minsMissed/90;
              capMatchesMissed = matchesMissed;
            }
          }

//calc the vice points to add
          for (var i=0; i<15; i++){
            if (tempArray[i].is_vice == true){
              var vicePPG = parseInt(tempArray[i].points_per_game);
              vicePointsToAdd = vicePPG * capMatchesMissed;
            }

          }

          vicePointsToAdd = parseFloat(vicePointsToAdd.toFixed());


          averageSubScore = (subScore/4)/this.state.currentWeek;

          scoreToAddFromSubs = totalMatchesMissed * averageSubScore;

          scoreToAddFromSubs = Math.abs(parseFloat(scoreToAddFromSubs.toFixed()));

          outfieldscore = outScore + scoreToAddFromSubs + vicePointsToAdd;

          console.log(teamId, [outScore, scoreToAddFromSubs, vicePointsToAdd, totalMatchesMissed, averageSubScore]);

       }
      )
      .then(
        (result) => {
         fetch(url + "?csurl=https://fantasy.premierleague.com/api/entry/" + teamId +"/")
         .then(res => res.json())
          .then(
            (result) => {
                var teamName = result.player_first_name + ' ' + result.player_last_name;
              const currentActual = result.summary_overall_points;
              const currentTransfers = result.last_deadline_total_transfers;
              const difference = currentActual - outfieldscore;
              this.setState({ arrayOfScores: [...this.state.arrayOfScores, { teamName, outfieldscore, currentActual, currentTransfers, difference }] })
            },
          )
        }
      )
  }

  render() {
    const { error, arrayOfScores, leagueLength} = this.state;
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
            > Calculate
          </button>
        </div>
      </div>

      { arrayOfScores.length > 1 && arrayOfScores.length >= leagueLength &&

          <table className="table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Manager</th>
                <th onClick={e => this.onSort(e, 'outfieldscore')} style={{cursor:'pointer', 'box-shadow':'inset 0 -3px 0 0 green'}}>What-if Score</th>
                <th onClick={e => this.onSort(e, 'currentActual')} style={{cursor:'pointer', 'box-shadow':'inset 0 -3px 0 0 green'}}>Actual Score</th>
                <th onClick={e => this.onSort(e, 'difference')} style={{cursor:'pointer', 'box-shadow':'inset 0 -3px 0 0 green'}}>Difference</th>
                <th onClick={e => this.onSort(e, 'currentTransfers')} style={{ cursor: 'pointer', 'box-shadow': 'inset 0 -3px 0 0 green' }}>Transfers made</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              {arrayOfScores.map(function (account, index) {
                return (
                  <tr key={index} data-item={account}>
                    <td data-title="Rank">{index + 1}</td>
                    <td data-title="Name">{account.teamName}</td>
                    <td data-title="Score">{account.outfieldscore}</td>
                    <td data-title="Score">{account.currentActual}</td>
                    <td data-title="Score">{account.difference}</td>
                    <td data-title="Score">{account.currentTransfers}</td>
                    <td data-title="Machine"><a href="/whatIf">View detail</a></td>
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