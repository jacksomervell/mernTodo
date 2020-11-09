import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


export default class SeasonHistory extends Component {

  constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);

        this.state = {
         coreData: '',
      isLoaded: false,
      items: '',
      teamId: '',
      player: 'hi',
      scores:[],
      ranks:[],
      populations:[
        {"season_name":'2006/07', "population":1270000},
        {"season_name":'2007/08', "population":1700000},
        {"season_name":'2008/09', "population":1950000},
        {"season_name":'2009/10', "population":2100000},
        {"season_name":'2010/11', "population":2350000},
        {"season_name":'2011/12', "population":2510000},
        {"season_name":'2012/13', "population":2608634},
        {"season_name":'2013/14', "population":3218998},
        {"season_name":'2014/15', "population":3502998},
        {"season_name":'2015/16', "population":3734001},
        {"season_name":'2016/17', "population":4503345},
        {"season_name":'2017/18', "population":5190135},
        {"season_name":'2018/19', "population":7383187},
        {"season_name":'2019/20', "population":7628968}
      ],
      finalData:{},
      averageAverage: 0,
      averageRank:0,
      averageScore:0
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

  onSort(event, sortKey) {
    const data = this.state.finalData;
    data.sort((a, b) => b[sortKey] - a[sortKey])
    this.setState({ data })
  }


  onButtonClick() {



    const url = 'https://ffwhatif.herokuapp.com/proxy.php';

    fetch(url+"?csurl=https://fantasy.premierleague.com/api/entry/" + this.state.teamId + "/history/")
      .then(res => res.json())
      .then(
      (result) => {
        const { past, current } = result;

         const pastPops = this.state.populations;

         pastPops.forEach(function(pop){
           past.forEach(function(playerPast){
              if (pop.season_name === playerPast.season_name){
                playerPast.population = pop.population;
                playerPast.percentage = Math.round(((playerPast.rank / playerPast.population) * 100) * 10) / 10;
              }
             })
          })

          let totalAverages = 0;
          let totalScores = 0;
          let totalRanks = 0

          past.forEach(function(season){
            totalAverages = totalAverages + season.percentage;
            totalScores = totalScores + season.total_points;
            totalRanks = totalRanks + season.rank;
          })

          const averageAverage = Math.round((totalAverages / past.length)*10)/10;
          const averageScore = Math.round((totalScores / past.length)*10)/10;
          const averageRank = Math.round((totalRanks / past.length)*10)/10;

          this.setState({
            finalData: past,
            averageAverage,
            averageRank,
            averageScore
          });

       }
      )
      .then(
        (result) => {
            fetch(url + "?csurl=https://fantasy.premierleague.com/api/entry/" + this.state.teamId + "/")
              .then(res => res.json())
              .then(
                (result) => {
                  console.log(this.state);
                  var teamName = result.player_first_name;
                  this.setState({
                    teamName: teamName,
                  });
                },
              )
        }
      )
  }

  render() {
    const { error, isLoaded, teamName, teamId, finalData, averageAverage, averageRank, averageScore } = this.state;
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


          {finalData.length > 0 &&
            <div>
              <h2> {teamName}</h2>
            <table className="table">
              <thead>
                <tr>
                <th onClick={e => this.onSort(e, 'season_name')} style={{ cursor: 'pointer', 'box-shadow': 'inset 0 -3px 0 0 green' }}>Season</th>
                <th onClick={e => this.onSort(e, 'total_points')} style={{ cursor: 'pointer', 'box-shadow': 'inset 0 -3px 0 0 green' }}>Points</th>
                <th onClick={e => this.onSort(e, 'population')} style={{ cursor: 'pointer', 'box-shadow': 'inset 0 -3px 0 0 green' }}>Population</th>
                <th onClick={e => this.onSort(e, 'rank')} style={{ cursor: 'pointer', 'box-shadow': 'inset 0 -3px 0 0 green' }}>Rank</th>
                <th onClick={e => this.onSort(e, 'percentage')} style={{ cursor: 'pointer', 'box-shadow': 'inset 0 -3px 0 0 green' }}>Percentile</th>
                </tr>
              </thead>
              <tbody>
                {finalData.map(function (account, index) {
                  return (
                    <tr key={index} data-item={account}>
                      <td data-title="Season">{account.season_name}</td>
                      <td data-title="Score">{account.total_points}</td>
                      <td data-title="Population">{account.population}</td>
                      <td data-title="Rank">{account.rank}</td>
                      <td data-title="Percentile">{account.percentage}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div>
              <p>Your average percentile finish over your entire FPL career is <strong>{averageAverage}%</strong></p>
              <p>Your average score is <strong>{averageScore}</strong> </p>
              <p>Your average ranks is <strong>{averageRank}</strong> </p>
              </div>
          </div>
          }
      </div>
      )
  }
}
}