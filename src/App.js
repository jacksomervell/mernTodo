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
import SeasonHistory from "./components/seasonHistory.component";
import FormChecker from "./components/formchecker.component";
import FplMyTools from "./components/fplmytools.component";
import {Container, Navbar, Nav, NavDropdown} from 'react-bootstrap';

class App extends Component {
  render() {
    return (
      <Router>
        <Container>
          <Navbar expand="sm" variant="light" className="fplNav">
            
            <Link to="/" className="navbar-brand"><img className="toolsLogo"
            src="/FPLTools.png"
            alt="example"
          /></Link>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse>
              <Nav className="mr-auto">
                <NavDropdown title="Tools" id="basic-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/whatIf">What-If Machine</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/percentages">Player Ownership Percentages</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/chip-checker">Chip Checker</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/you-vs-rival">You vs a Rival</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/what-if-league">What-if Minileague Machine</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/season-history-analyser">Season History Analyser</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/form-checker">Form Checker</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/fplmytools">FPLMyTools</NavDropdown.Item>

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
          <Route path="/what-if-league" component={WhatIfLeague} />
          <Route path="/season-history-analyser" component={SeasonHistory} />
          <Route path="/form-checker" component={FormChecker} />
          <Route path="/fplmytools" component={FplMyTools} />

        </Container>
      </Router>
    );
  }
}

export default App;