import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


export default class WhatIfLeague extends Component {

  constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);

        this.state = {
       coreData:'',
       currentWeek:''
        }

      }

  handleChange(event) {

    this.setState({teamId: event.target.value,
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
    this.tempPlayerArray = [];
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
        },
      ).then(
        response => {

          for (var i = 0; i < this.tempArray.length; i++) {
            this.allScores.push(this.whatIfForTeam(this.tempArray[i]));
         }
         console.log(this.allScores);
        }

        )

  }

  whatIfForTeam(teamId) {

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
          console.log(scoreToAddFromSubs);

          outfieldscore = outScore + scoreToAddFromSubs + vicePointsToAdd;
       }
      )
      .then(
        (result) => {
         fetch(url + "?csurl=https://fantasy.premierleague.com/api/entry/" + this.state.teamId +"/")
         .then(res => res.json())
          .then(
            (result) => {
                var teamName = result.player_first_name;
                return [teamName, outfieldscore];
            },
          )
        }
      )
  }

  render() {
    const { error, isLoaded, items, coreData, player, score, playerArray, outfieldScore, teamId, teamName, currentWeek, subScore, highestScorer, highestScore, captain, captainScore, pointsComingOn, vicecaptScore} = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else {
      return (
      <div>Hi</div>
      )
    }
  }

}