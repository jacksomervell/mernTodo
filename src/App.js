import "bootstrap/dist/css/bootstrap.min.css";
import './index.css';
import './index.scss';
import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import WhatIf from "./components/whatif.component";
import PercTable from "./components/percentages.component";
import ChipChecker from "./components/chip-checker.component";
import YouRival from "./components/youvsrival.component";
import Home from "./components/home.component";
import WhatIfLeague from "./components/whatifleague.component";

import {Container, Navbar, Nav, NavDropdown} from 'react-bootstrap';

class App extends Component {
  render() {
    return (
      <Router>
        <Container>
          <Navbar expand="sm" variant="dark" className="fplNav">
            <Link to="/" className="navbar-brand"><h1>FPL Tools</h1></Link>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse>
              <Nav className="mr-auto">
                <NavDropdown title="Tools" id="basic-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/whatIf">What-If Machine</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/percentages">Player Ownership Percentages</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/chip-checker">Chip Checker</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/you-vs-rival">You vs a Rival</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/whatifleague">What-If League</NavDropdown.Item>
                </NavDropdown>
                  <Nav.Link as={Link} to="/blog" >Blog</Nav.Link>
                  <Nav.Link as={Link} to="/podcasts" >Podcasts</Nav.Link>

              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <br/>
          <Route path="/" exact component={Home} />
          <Route path="/whatIf" component={WhatIf} />
          <Route path="/percentages" component={PercTable} />
          <Route path="/chip-checker" component={ChipChecker} />
          <Route path="/you-vs-rival" component={YouRival} />
          <Route path="/whatifleague" component={WhatIfLeague} />
        </Container>
      </Router>
    );
  }
}

export default App;