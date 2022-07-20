import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


export default class WhatIf extends Component {

  constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);

        this.state = {
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
      currentRank:0,
      whatIfRank:0,
        }

      }

  handleChange(event) {

    this.setState({teamId: event.target.value,
              });
  }

  componentDidMount() {
    // this.findRank(510, 1);
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
      .then(
        (result) =>{
      fetch(url+"?csurl=https://understat.com/league/EPL/")
      .then(res => res)
     .then(
      (result) => {
        console.log(result);
      }) 
    })
  }


  onButtonClick() {

    let playerName = '';
    let varItems = ''
    this.tempArray = [];
    this.state.playerArray = [];
    var capt = '';
    var captScore = '';
    var vicecapt = '';
    var vicecaptScore = '';
    var leaguePositionArray = [];


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

          //calc the overall team value
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

          vicePointsToAdd = parseFloat(vicePointsToAdd.toFixed());

          averageSubScore = (subScore/4)/this.state.currentWeek;

          scoreToAddFromSubs = totalMatchesMissed * averageSubScore;

          scoreToAddFromSubs = Math.abs(parseFloat(scoreToAddFromSubs.toFixed()));

          //leaguePosition calc 
         const leaguePosition = 1;
         let positionScores = [];
          
          this.setState({
            playerArray: this.tempArray,
            outfieldScore: outScore + scoreToAddFromSubs + vicePointsToAdd,
            subScore: subScore,
            highestScorer: highestScorer,
            highestScore: highestScore,
            captain: capt,
            captainScore: captScore,
            averageSubScore: averageSubScore,
            pointsComingOn: scoreToAddFromSubs,
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
      )
      .then( response => {
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
  }

  render() {
    const { currentRank, whatIfRank, error, currentValue, whatifValue, isLoaded, items, coreData, player, score, currentActual, currentTransfers, playerArray, outfieldScore, teamId, teamName, currentWeek, subScore, highestScorer, highestScore, captain, captainScore, pointsComingOn, vicecaptScore} = this.state;
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
            style={{cursor:'pointer'}}
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
      <p>Your current rank is <strong>{currentRank} </strong>. Your what-if rank would be <strong>{whatIfRank}</strong>.</p>
      </div>
    }
      </div>
      );
    }
  }

}