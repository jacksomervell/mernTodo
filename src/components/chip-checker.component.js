import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


export default class ChipChecker extends Component {

  constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);



    this.state =  { 
      coreData: '',
      isLoaded: false,
      items: '',
      leagueId: '',
      managersArray: [],
      playerArray: [],
      currentWeek: '',
      leagueName: '',
      chips: '',
      chipNames: {
        1: 'Wildcard 1',
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
    fetch(url+"?csurl=https://fantasy.premierleague.com/drf/bootstrap-static")
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




  onButtonClick() {


    let varItems = '';
    let chips = '';
    this.tempArray = [];
    this.playerAndChipArray = [];
    this.leagueName = '';
    let teamId = '';
    let name = '';
    let teamName = '';
const url = 'https://ffwhatif.herokuapp.com/proxy.php';

    fetch(url+"?csurl=https://fantasy.premierleague.com/drf/leagues-classic-standings/" + this.state.leagueId)
      .then(res => res.json())
      .then(
      response => {
        varItems = response.standings.results;
        this.leagueName = response.league.name;
        for (var i=0; i<varItems.length; i++){ this.tempArray.push(varItems[i].entry) } }, ).then( response => {

        for(var i=0; i<this.tempArray.length; i++){ fetch(url+"?csurl=https://fantasy.premierleague.com/drf/entry/" + this.tempArray[i] + "/history") .then(res=>res.json())
            .then(
              response => {
                chips = response.chips;
                teamId = response.entry.id;
                name = response.entry.player_first_name + ' ' + response.entry.player_last_name;
                teamName = response.entry.name;
                this.playerAndChipArray.push({'id':teamId, 'teamName': teamName, 'name':name, 'chips':chips}) 
              }
            ).then(
              response => {
                if(this.tempArray.length == this.playerAndChipArray.length) {

                  for (var i=0; i<this.playerAndChipArray.length; i++){
                      var chips = this.playerAndChipArray[i].chips;
                      var thisGuysChips = [];
                      for (var b=0; b<chips.length; b++) {
                          var chipNumber = chips[b].chip;
                          thisGuysChips.push(chipNumber)
                      }
                      this.playerAndChipArray[i].chipNumbers = thisGuysChips;
                  }

                  console.log(this.playerAndChipArray);

                   this.setState({
                    finalChips: this.playerAndChipArray
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
      isLoaded,
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
                    <input type="text" value={this.state.leagueId} onChange={this.handleChange} />
                    <button onClick={()=>{this.onButtonClick();}}
                        style={{cursor:'pointer', backgroundColor:'darkred', color:'white', border:'0px', margin:'0 auto', height:'38px'}}
                        className='whatifButton'
                      > Calculate</button>
                  </div>
               
            <h2>League: {leagueName} </h2>

            <table>
            <thead>
                      
            <tr>
                        
            <th>Player</th>
          
            <th>Team</th>

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
       
            <td className='chipCheck '>{finalChips[key].teamName}</td>
       
            <td className={(finalChips[key].chipNumbers.indexOf(1) != -1) ? "usedChip" : "notUsed"}>{(finalChips[key].chipNumbers.indexOf(1) != -1) ? 'Used' : 'X'}</td>
           
            <td className={(finalChips[key].chipNumbers.indexOf(2) != -1) ? "usedChip" : "notUsed"}>{(finalChips[key].chipNumbers.indexOf(2) != -1) ? 'Used' : 'X'}</td>
          
            <td className={(finalChips[key].chipNumbers.indexOf(3) != -1) ? "usedChip" : "notUsed"}>{(finalChips[key].chipNumbers.indexOf(3) != -1) ? 'Used' : 'X'}</td>
          
            <td className={(finalChips[key].chipNumbers.indexOf(4) != -1) ? "usedChip" : "notUsed"}>{(finalChips[key].chipNumbers.indexOf(4) != -1) ? 'Used' : 'X'}</td>

            <td className={(finalChips[key].chipNumbers.indexOf(5) != -1) ? "usedChip" : "notUsed"}>{(finalChips[key].chipNumbers.indexOf(5) != -1) ? 'Used' : 'X'}</td>
    
                                  
                                </tr>

                    })}
                    </tbody>
     
                  </table>
         

                  </div>
     
      );
    }
  }

  
  }