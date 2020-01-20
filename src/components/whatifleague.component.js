import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


export default class WhatIfLeague extends Component {

  constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);

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

         tempArray.forEach(async function(listItem, index){
          await whatIfForTeam(listItem);
         });

      }
        )
  }

  whatIfForTeam = (teamId) => {

    let playerName = '';
    let varItems = ''
    this.tempArray = [];
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
          this.setState({ arrayOfScores: [...this.state.arrayOfScores, {teamName:'Nope', outfieldscore: '0'}] })
          return;
        }

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

//get the total mmax mins played for the seaosn so far
          var allMins = this.state.currentWeek * 90;

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
//how many matches did the captian miss?
              var minsPlayed = this.tempArray[i].minutes;
              var minsMissed = allMins - minsPlayed;
              var matchesMissed = minsMissed/90;
              capMatchesMissed = matchesMissed;
            }
          }

//calc the vice points to add
          for (var i=0; i<15; i++){
            if (this.tempArray[i].is_vice == true){
              var vicePPG = parseInt(this.tempArray[i].points_per_game);
              vicePointsToAdd = vicePPG * capMatchesMissed;
            }

          }

          vicePointsToAdd = parseFloat(vicePointsToAdd.toFixed());


          averageSubScore = (subScore/4)/this.state.currentWeek;

          scoreToAddFromSubs = totalMatchesMissed * averageSubScore;

          scoreToAddFromSubs = Math.abs(parseFloat(scoreToAddFromSubs.toFixed()));

          outfieldscore = outScore + scoreToAddFromSubs + vicePointsToAdd;

       }
      )
      .then(
        (result) => {
         fetch(url + "?csurl=https://fantasy.premierleague.com/api/entry/" + teamId +"/")
         .then(res => res.json())
          .then(
            (result) => {
                var teamName = result.player_first_name + ' ' + result.player_last_name;
              console.log([teamName, outfieldscore]);
              this.setState({ arrayOfScores: [...this.state.arrayOfScores, { teamName, outfieldscore }] })
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
        <table>
            {arrayOfScores.map(item => {

              return <tr className='row'>
                <td className='Name'> {item.teamName}</td>
                <td className='Score'>{item.outfieldscore}</td>
              </tr>
          })}
        </table>
      }

      </div>
      )
    }
  }

}