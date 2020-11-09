import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


export default class FormChecker extends Component {

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
      rank:0
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
      ) 
  }

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
            style={{cursor:'pointer'}}
           className={'whatifButton btn btn-outline-secondary'}
           disabled={!teamId}
            > Calculate
          </button>
        </div>
      </div>

      <div>

<div className={"playerbar"}>

{playerArray.map(item => {

if(item.Position == 1 && playerArray.indexOf(item) < 11){
   return <div key={item.Id} className={"starter"} style={{backgroundColor:'green', color:'white'}}>
      <span className="pointSpan">{item.Name}</span>
      <span className="pointSpan">Past 4 weeks: {item.FourWeekScore}</span>
      <span className="pointSpan">Ownership: {item.Ownership}</span>
      <span className="pointSpan">PPG last 4: {item.PpgLast4}</span>
      <span className="pointSpan">Total PPG{item.TotalPpg}</span>
    </div>
  }

})}

</div>

<div className={"playerbar"}>

{playerArray.map(item => {

if(item.Position == 2 && playerArray.indexOf(item) < 11){
    return <div key={item.Id} className={"starter"}>
       <span className="pointSpan">{item.Name}</span>
       <span className="pointSpan">Past 4 weeks: {item.FourWeekScore}</span>
       <span className="pointSpan">Ownership: {item.Ownership}</span>
       <span className="pointSpan">PPG last 4: {item.PpgLast4}</span>
       <span className="pointSpan">Total PPG{item.TotalPpg}</span>
     </div>
   }

})}

</div>

<div className={"playerbar"}>


{playerArray.map(item => {

if(item.Position == 3 && playerArray.indexOf(item) < 11){
    return <div key={item.Id} className={"starter"}>
       <span className="pointSpan">{item.Name}</span>
       <span className="pointSpan">Past 4 weeks: {item.FourWeekScore}</span>
       <span className="pointSpan">Ownership: {item.Ownership}</span>
       <span className="pointSpan">PPG last 4: {item.PpgLast4}</span>
       <span className="pointSpan">Total PPG{item.TotalPpg}</span>
     </div>
   }

})}

</div>

<div className={"playerbar"}>


{playerArray.map(item => {

if(item.Position == 4 && playerArray.indexOf(item) < 11){
    return <div key={item.Id} className={"starter"}>
       <span className="pointSpan">{item.Name}</span>
       <span className="pointSpan">Past 4 weeks: {item.FourWeekScore}</span>
       <span className="pointSpan">Ownership: {item.Ownership}</span>
       <span className="pointSpan">PPG last 4: {item.PpgLast4}</span>
       <span className="pointSpan">Total PPG{item.TotalPpg}</span>
     </div>
   }

})}

</div>

<div className={"subbar"}>

{playerArray.map(item => {

if(playerArray.indexOf(item) > 11){
    return <div key={item.Id} className={"starter"}>
       <span className="pointSpan">{item.Name}</span>
       <span className="pointSpan">Past 4 weeks: {item.FourWeekScore}</span>
       <span className="pointSpan">Ownership: {item.Ownership}</span>
       <span className="pointSpan">PPG last 4: {item.PpgLast4}</span>
       <span className="pointSpan">Total PPG{item.TotalPpg}</span>
     </div>
   }

})}

</div>

</div>


</div>
);
}
}

}