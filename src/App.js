import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import CreateTodo from "./components/create-todo.component";
import EditTodo from "./components/edit-todo.component";
import WhatIf from "./components/whatif.component";
import PercTable from "./components/percentages.component";
import ChipChecker from "./components/chip-checker.component";
import YouRival from "./components/youvsrival.component";
import Home from "./components/home.component";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <Link to="/" className="navbar-brand"><h1>FPL Tools</h1></Link>
            <div className="collpase navbar-collapse">
              <ul className="navbar-nav mr-auto">
                <li className="navbar-item">
                  <Link to="/" className="nav-link">Home</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/whatIf" className="nav-link">What-if Machine</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/percentages" className="nav-link">Player Percentages</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/chip-checker" className="nav-link">Chip Checker</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/you-vs-rival" className="nav-link">You vs Rival</Link>
                </li>
              </ul>
            </div>
          </nav>
          <br/>
          <Route path="/" exact component={Home} />
          <Route path="/whatIf" component={WhatIf} />
          <Route path="/percentages" component={PercTable} />
          <Route path="/chip-checker" component={ChipChecker} />
          <Route path="/you-vs-rival" component={YouRival} />
        </div>
      </Router>
    );
  }
}

export default App;