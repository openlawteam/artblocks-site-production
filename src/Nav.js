//https://oneclickdapp.com/beast-powder/

import React, {Component} from 'react';
import {Navbar, Nav, NavDropdown} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import './Nav.css';

import {MetaMaskSVG, WalletSVG} from './assets/svg';

import {formatEthereumAddress} from './utils';
import {getFlamingoDAOUrl} from './config';

class Navigation extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  async componentDidMount() {
    try {
      const artBlocks = this.props.artBlocks;
      const activeProjects = this.props.activeProjects;

      let activeProjectsDetails = [];
      for (let project in activeProjects) {
        const projectDetails = await artBlocks.methods
          .projectDetails(activeProjects[project])
          .call();

        activeProjectsDetails.push([
          activeProjects[project],
          projectDetails[0],
          projectDetails[1],
        ]);
      }

      const allProjects = this.props.allProjects;

      let allProjectsDetails = [];
      for (let i = 0; i < allProjects.length; i++) {
        const projectDetails = await artBlocks.methods.projectDetails(i).call();

        allProjectsDetails.push([i, projectDetails[0], projectDetails[1]]);
      }

      this.setState({
        artBlocks,
        activeProjects,
        activeProjectsDetails,
        allProjectsDetails,
      });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return (
      <div>
        <Navbar className="navBar" expand="lg">
          <Navbar.Brand
            as={Link}
            onClick={() => {
              this.props.handleToggleView('off');
            }}
            to="/">
            <div className="flamingo-container">
              <span className="flamingo-logo">Flamingo Flutter</span>
            </div>
            <div className="artblocks-container">
              <span className="artblocks-logo">
                an <span>ArtBlocks</span> collaboration
              </span>
            </div>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto flamingo-navbar-nav">
              <NavDropdown title="Curated Projects" id="basic-nav-dropdown">
                <NavDropdown.ItemText>
                  <b>Open</b>
                </NavDropdown.ItemText>

                {this.state.activeProjectsDetails &&
                  this.state.activeProjectsDetails
                    .filter(
                      (projectInfo) =>
                        !this.props.complete.includes(projectInfo[0]) &&
                        this.props.curated.includes(projectInfo[0])
                    )
                    .map((projectInfo, index) => {
                      return (
                        <NavDropdown.Item
                          key={index}
                          as={Link}
                          onClick={() => {
                            this.props.handleToggleView('off');
                          }}
                          to={'/project/' + projectInfo[0]}>
                          {projectInfo[1]}
                          {projectInfo[2] && (
                            <small> by {projectInfo[2]}</small>
                          )}
                        </NavDropdown.Item>
                      );
                    })}
                {this.state.activeProjectsDetails &&
                  this.state.activeProjectsDetails.filter(
                    (projectInfo) =>
                      !this.props.complete.includes(projectInfo[0]) &&
                      this.props.curated.includes(projectInfo[0])
                  ).length < 1 && (
                    <NavDropdown.ItemText>
                      <i>None</i>
                    </NavDropdown.ItemText>
                  )}
                <div className="dropdown-divider"></div>
                <NavDropdown.ItemText>
                  <b>Complete</b>
                </NavDropdown.ItemText>
                {this.state.activeProjectsDetails &&
                  this.state.activeProjectsDetails
                    .filter(
                      (projectInfo) =>
                        this.props.complete.includes(projectInfo[0]) &&
                        this.props.curated.includes(projectInfo[0])
                    )
                    .map((projectInfo, index) => {
                      return (
                        <NavDropdown.Item
                          key={index}
                          as={Link}
                          onClick={() => {
                            this.props.handleToggleView('off');
                          }}
                          to={'/project/' + projectInfo[0]}>
                          {projectInfo[1]}
                          {projectInfo[2] && (
                            <small> by {projectInfo[2]}</small>
                          )}
                        </NavDropdown.Item>
                      );
                    })}
                {this.state.activeProjectsDetails &&
                  this.state.activeProjectsDetails.filter(
                    (projectInfo) =>
                      this.props.complete.includes(projectInfo[0]) &&
                      this.props.curated.includes(projectInfo[0])
                  ).length < 1 && (
                    <NavDropdown.ItemText>
                      <i>None</i>
                    </NavDropdown.ItemText>
                  )}
              </NavDropdown>
              {/* <NavDropdown title="Artist Playground" id="basic-nav-dropdown">
                <NavDropdown.Item>
                  <b>Open</b>
                </NavDropdown.Item>
                {this.state.activeProjectsDetails &&
                  this.state.activeProjectsDetails
                    .filter(
                      (projectInfo) =>
                        !this.props.complete.includes(projectInfo[0]) &&
                        !this.props.curated.includes(projectInfo[0]) &&
                        this.props.playground.includes(projectInfo[0])
                    )
                    .map((projectInfo, index) => {
                      return (
                        <NavDropdown.Item
                          key={index}
                          as={Link}
                          onClick={() => {
                            this.props.handleToggleView('off');
                          }}
                          to={'/project/' + projectInfo[0]}>
                          {projectInfo[1]} by {projectInfo[2]}
                        </NavDropdown.Item>
                      );
                    })}
                {this.state.activeProjectsDetails &&
                  this.state.activeProjectsDetails.filter(
                    (projectInfo) =>
                      !this.props.complete.includes(projectInfo[0]) &&
                      !this.props.curated.includes(projectInfo[0]) &&
                      this.props.playground.includes(projectInfo[0])
                  ).length < 1 && (
                    <NavDropdown.Item>
                      <i>None</i>
                    </NavDropdown.Item>
                  )}
                <div className="dropdown-divider"></div>
                <NavDropdown.Item>
                  <b>Complete</b>
                </NavDropdown.Item>
                {this.state.activeProjectsDetails &&
                  this.state.activeProjectsDetails
                    .filter(
                      (projectInfo) =>
                        this.props.complete.includes(projectInfo[0]) &&
                        !this.props.curated.includes(projectInfo[0]) &&
                        this.props.playground.includes(projectInfo[0])
                    )
                    .map((projectInfo, index) => {
                      return (
                        <NavDropdown.Item
                          key={index}
                          as={Link}
                          onClick={() => {
                            this.props.handleToggleView('off');
                          }}
                          to={'/project/' + projectInfo[0]}>
                          {projectInfo[1]} by {projectInfo[2]}
                        </NavDropdown.Item>
                      );
                    })}
                {this.state.activeProjectsDetails &&
                  this.state.activeProjectsDetails.filter(
                    (projectInfo) =>
                      this.props.complete.includes(projectInfo[0]) &&
                      !this.props.curated.includes(projectInfo[0]) &&
                      this.props.playground.includes(projectInfo[0])
                  ).length < 1 && (
                    <NavDropdown.Item>
                      <i>None</i>
                    </NavDropdown.Item>
                  )}
              </NavDropdown> */}
              {/* <NavDropdown title="Factory" id="basic-nav-dropdown">
                <NavDropdown.Item>
                  <b>Open</b>
                </NavDropdown.Item>
                {this.state.activeProjectsDetails &&
                  this.state.activeProjectsDetails
                    .filter(
                      (projectInfo) =>
                        !this.props.complete.includes(projectInfo[0]) &&
                        !this.props.curated.includes(projectInfo[0]) &&
                        !this.props.playground.includes(projectInfo[0])
                    )
                    .map((projectInfo, index) => {
                      return (
                        <NavDropdown.Item
                          key={index}
                          as={Link}
                          onClick={() => {
                            this.props.handleToggleView('off');
                          }}
                          to={'/project/' + projectInfo[0]}>
                          {projectInfo[1]} by {projectInfo[2]}
                        </NavDropdown.Item>
                      );
                    })}
                {this.state.activeProjectsDetails &&
                  this.state.activeProjectsDetails.filter(
                    (projectInfo) =>
                      !this.props.complete.includes(projectInfo[0]) &&
                      !this.props.curated.includes(projectInfo[0]) &&
                      !this.props.playground.includes(projectInfo[0])
                  ).length < 1 && (
                    <NavDropdown.Item>
                      <i>None</i>
                    </NavDropdown.Item>
                  )}
                <div className="dropdown-divider"></div>
                <NavDropdown.Item>
                  <b>Complete</b>
                </NavDropdown.Item>
                {this.state.activeProjectsDetails &&
                  this.state.activeProjectsDetails
                    .filter(
                      (projectInfo) =>
                        this.props.complete.includes(projectInfo[0]) &&
                        !this.props.curated.includes(projectInfo[0]) &&
                        !this.props.playground.includes(projectInfo[0])
                    )
                    .map((projectInfo, index) => {
                      return (
                        <NavDropdown.Item
                          key={index}
                          as={Link}
                          onClick={() => {
                            this.props.handleToggleView('off');
                          }}
                          to={'/project/' + projectInfo[0]}>
                          {projectInfo[1]} by {projectInfo[2]}
                        </NavDropdown.Item>
                      );
                    })}
                {this.state.activeProjectsDetails &&
                  this.state.activeProjectsDetails.filter(
                    (projectInfo) =>
                      this.props.complete.includes(projectInfo[0]) &&
                      !this.props.curated.includes(projectInfo[0]) &&
                      !this.props.playground.includes(projectInfo[0])
                  ).length < 1 && (
                    <NavDropdown.Item>
                      <i>None</i>
                    </NavDropdown.Item>
                  )}
              </NavDropdown> */}
              {/* <NavDropdown title="All Projects" id="basic-nav-dropdown">
                <NavDropdown.Item>
                  <b>Open</b>
                </NavDropdown.Item>
                {this.state.activeProjectsDetails &&
                  this.state.activeProjectsDetails
                    .filter(
                      (projectInfo) =>
                        !this.props.complete.includes(projectInfo[0])
                    )
                    .map((projectInfo, index) => {
                      return (
                        <NavDropdown.Item
                          key={index}
                          as={Link}
                          onClick={() => {
                            this.props.handleToggleView('off');
                          }}
                          to={'/project/' + projectInfo[0]}>
                          {projectInfo[1]} by {projectInfo[2]}
                        </NavDropdown.Item>
                      );
                    })}
                {this.state.activeProjectsDetails &&
                  this.state.activeProjectsDetails.filter(
                    (projectInfo) =>
                      !this.props.complete.includes(projectInfo[0])
                  ).length < 1 && (
                    <NavDropdown.Item>
                      <i>None</i>
                    </NavDropdown.Item>
                  )}
                <div className="dropdown-divider"></div>
                <NavDropdown.Item>
                  <b>Complete</b>
                </NavDropdown.Item>
                {this.state.activeProjectsDetails &&
                  this.state.activeProjectsDetails
                    .filter((projectInfo) =>
                      this.props.complete.includes(projectInfo[0])
                    )
                    .map((projectInfo, index) => {
                      return (
                        <NavDropdown.Item
                          key={index}
                          as={Link}
                          onClick={() => {
                            this.props.handleToggleView('off');
                          }}
                          to={'/project/' + projectInfo[0]}>
                          {projectInfo[1]} by {projectInfo[2]}
                        </NavDropdown.Item>
                      );
                    })}
                {this.state.activeProjectsDetails &&
                  this.state.activeProjectsDetails.filter((projectInfo) =>
                    this.props.complete.includes(projectInfo[0])
                  ).length < 1 && (
                    <NavDropdown.Item>
                      <i>None</i>
                    </NavDropdown.Item>
                  )}
              </NavDropdown> */}
              {/* <Nav.Link
                as={Link}
                onClick={() => {
                  this.props.handleToggleView('off');
                }}
                to="/gallery">
                Gallery View
              </Nav.Link> */}

              {/* <Nav.Link
                as={Link}
                onClick={() => {
                  this.props.handleToggleView('off');
                }}
                to={'/learn'}>
                Learn
              </Nav.Link> */}

              {/* <Nav.Link
                as={Link}
                onClick={() => {
                  this.props.handleToggleView('off');
                }}
                to={'/sustainability'}>
                Sustainability
              </Nav.Link> */}

              {/* {this.props.isWhitelisted && (
                <Nav.Link
                  href="#"
                  onClick={() => {
                    this.props.handleToggleView('controlPanel', 0);
                  }}>
                  Control Panel
                </Nav.Link>
              )} */}

              {this.props.tokensOfOwner && (
                <Nav.Link
                  as={Link}
                  onClick={() => {
                    this.props.handleToggleView('off');
                  }}
                  to={'/user/' + this.props.account}>
                  Your Items
                </Nav.Link>
              )}

              <Nav.Link href={getFlamingoDAOUrl(this.props.network)}>
                Flamingo DAO
              </Nav.Link>
            </Nav>

            {/* {this.props.projectsOfArtist &&
              this.props.projectsOfArtist.length > 0 && (
                <NavDropdown title="Your Projects" id="basic-nav-dropdown">
                  {this.props.projectsOfArtist.map((project, index) => {
                    return (
                      <NavDropdown.Item
                        as={Link}
                        onClick={() => {
                          this.props.handleToggleView('off');
                        }}
                        to={'/project/' + project}
                        className="text-center"
                        key={index}>
                        {this.state.allProjectsDetails &&
                        this.state.allProjectsDetails[project]
                          ? this.state.allProjectsDetails[project][1]
                          : 'New Project'}
                      </NavDropdown.Item>
                    );
                  })}
                </NavDropdown>
              )} */}

            {this.props.connected === false && (
              <Nav.Link
                onClick={this.props.handleConnectToMetamask}
                href="#"
                className="org-get-connected-btn">
                Connect <WalletSVG />
              </Nav.Link>
            )}
            {this.props.account && (
              <Nav.Link href="#" className="org-get-connected-btn">
                {formatEthereumAddress(this.props.account)}

                <span
                  style={{
                    display: 'inline-block',
                    marginLeft: '.5rem',
                    width: '16px',
                    verticalAlign: 'middle',
                    top: '-3px',
                    position: 'relative',
                  }}>
                  <MetaMaskSVG />
                </span>
              </Nav.Link>
            )}
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

export default Navigation;
