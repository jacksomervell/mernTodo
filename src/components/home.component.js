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
        title: 'Hi',
        description: 'test desc',
        url: 'www.test'
        }]

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