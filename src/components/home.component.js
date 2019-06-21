import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Tool = props => (
  <div>
    <h2>{props.tool.title}</h2>
    <p>{props.tool.description}</p>
    <Link to={props.tool.url}>Check it out</Link>
  </div>
)


export default class ToolsList extends Component {

  constructor(props) {
    super(props);
    this.state= {tools: []};
  }

  componentDidMount() {
    const setTools = [{
        title: 'What-if Machine',
        description: 'A cruel tool that calculates how many points your team would have if you’d never made a transfer, captaincy change or change of any kind at all since Gameweek 1. Approach with caution!',
        url: '/whatif'
        },
        {
        title: 'Mini-League Player Ownership',
        description: 'See which players are most and least-owned in your mini-league.',
        url: '/percentages'
        },
        {
        title: 'Chip Checker',
        description: 'See who has used which chips in your mini-league, and how you compare.',
        url: '/chip-checker'
        },
        ]

    this.setState({tools : setTools})
  }

  toolsList() {
        return this.state.tools.map(function(currentTool, i){
            return <Tool tool={currentTool} key={i} />;
        })
    }


    render() {
        return (
            <div>
                { this.toolsList() }
            </div>
        )
    }
}