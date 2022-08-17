import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col} from 'react-bootstrap';
import axios from 'axios';

const Tool = props => (
  <Row as={Link} to={props.tool.url} className='toolLink' >
   <Col>
    <h2>{props.tool.title}</h2>
    <p>{props.tool.description}</p>
  </Col>
  </Row>
)


export default class ToolsList extends Component {

  constructor(props) {
    super(props);
    this.state= {tools: []};
  }

  componentDidMount() {
    const setTools = [{
        title: 'WHAT-IF MACHINE',
        description: 'A cruel tool that calculates how many points your team would have if you’d never made a transfer, captaincy change or change of any kind at all since Gameweek 1. Approach with caution!',
        url: '/whatif'
        },
        {
        title: 'MINI-LEAGUE PLAYER OWNERSHIP',
        description: 'See which players are most and least-owned in your mini-league.',
        url: '/percentages'
        },
        {
        title: 'CHIP CHECKER',
        description: 'See who has used which chips in your mini-league, and how you compare.',
        url: '/chip-checker'
        },
        {
          title: 'MINI-LEAGUE WHAT-IF MACHINE',
          description: 'How would your mini-league look if no one had made a change since Gameweek 1?',
          url: '/chip-/what-if-league'
        },
        {
            title: 'CAREER HISTORY ANALYSER',
            description: 'Get an in-depth look at your entire FPL career history.',
            url: '/season-history-analyser'
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