//https://oneclickdapp.com/beast-powder/

import React, { Component } from "react";
import { Navbar, Nav, NavDropdown /*, Image*/ } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Nav.css";
import { request, gql } from "graphql-request";

// Duplicating this + other logic here instead of including
// project details in prop so that we can minimize the amount
// of logic changed for now
const allProjectsQuery = gql`
  {
    projects(first: 300, orderBy: index) {
      id
      name
      artistAddress
      artistName
      active
    }
  }
`;

class Navigation extends Component {
  async componentDidMount() {
    const artBlocks = this.props.artBlocks;
    const artBlocks2 = this.props.artBlocks2;
    const activeProjects = this.props.activeProjects;
    //console.log(activeProjects);
    //console.log(activeProjects);
    let activeProjectsDetails = [];
    let allProjectsDetails = [];
    try {
      const data = await request(
        process.env.REACT_APP_GRAPHQL_API_ENDPOINT,
        allProjectsQuery
      );

      allProjectsDetails = data.projects.map((project) => [
        parseInt(project.id),
        project.name,
        project.artistName,
      ]);

      activeProjectsDetails = data.projects
        .filter((project) => project.active)
        .map((project) => [
          parseInt(project.id),
          project.name,
          project.artistName,
        ]);
    } catch (err) {
      console.error(err);
      console.warn(
        "graphql api request failed, attempting to fetch data from infura"
      );
      //for (let i=0;i<activeProjects.length;i++){
      for (let project in activeProjects) {
        if (activeProjects[project] < 3) {
          //console.log(Number(project));
          let nameArtist = [];
          const projectDetails = await artBlocks.methods
            .projectDetails(activeProjects[project])
            .call();
          nameArtist.push(activeProjects[project]);
          nameArtist.push(projectDetails[0]);
          nameArtist.push(projectDetails[1]);
          console.log(nameArtist);
          activeProjectsDetails.push(nameArtist);
        } else {
          let nameArtist = [];
          const projectDetails = await artBlocks2.methods
            .projectDetails(activeProjects[project])
            .call();
          nameArtist.push(activeProjects[project]);
          nameArtist.push(projectDetails[0]);
          nameArtist.push(projectDetails[1]);
          activeProjectsDetails.push(nameArtist);
        }
      }

      const allProjects = this.props.allProjects;
      for (let i = 0; i < allProjects.length; i++) {
        if (i < 3) {
          let nameArtist = [];
          //console.log("project"+i);
          const projectDetails = await artBlocks.methods
            .projectDetails(i)
            .call();
          nameArtist.push(i);
          nameArtist.push(projectDetails[0]);
          nameArtist.push(projectDetails[1]);
          allProjectsDetails.push(nameArtist);
        } else {
          let nameArtist = [];
          //console.log("project"+i);
          const projectDetails = await artBlocks2.methods
            .projectDetails(i)
            .call();
          nameArtist.push(i);
          nameArtist.push(projectDetails[0]);
          nameArtist.push(projectDetails[1]);
          allProjectsDetails.push(nameArtist);
        }
      }
    }
    //console.log(activeProjectsDetails);

    console.log({
      activeProjects,
      activeProjectsDetails,
      allProjectsDetails,
    });

    this.setState({
      artBlocks,
      artBlocks2,
      activeProjects,
      activeProjectsDetails,
      allProjectsDetails,
    });
  }

  constructor(props) {
    super(props);
    this.state = {};
    //this.handleConnectToMetaMask = this.handleConnectToMetaMask.bind(this);
  }

  render() {
    //console.log(this.state.allProjectsDetails);
    //console.log('active: '+this.props.activeProjects);
    //console.log("whitlisted?:" + this.props.isWhitelisted);
    //console.log(this.props.projectsOfArtist);
    //console.log(this.props.web3);
    //console.log(this.state.network);
    //console.log(this.props.projectsOfArtist);
    //let baseURL = this.props.baseURL;
    /*
    function tokenGenerator(token){
      return baseURL+'/generator/'+token;
    }
    */

    /*
    function tokenImage(token){
      //return 'https://api.artblocks.io/image/'+token;
      return baseURL+'/image/'+token;
    }
    */

    //console.log("Theater?:"+this.state.theater)
    //console.log(this.state.web3 && this.state.network);
    //let etherscanAddy = `https://etherscan.io/address/${this.props.account}`;
    return (
      <div>
        <Navbar className="navBar" fixed="top" bg="light" expand="lg">
          <Navbar.Brand
            as={Link}
            onClick={() => {
              this.props.handleToggleView("off");
            }}
            to="/"
          >
            Art Blocks
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <NavDropdown title="Curated Projects" id="basic-nav-dropdown">
                <NavDropdown.Item>
                  <b>Open</b>
                </NavDropdown.Item>

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
                            this.props.handleToggleView("off");
                          }}
                          to={"/project/" + projectInfo[0]}
                        >
                          {projectInfo[1]} by {projectInfo[2]}
                        </NavDropdown.Item>
                      );
                    })}
                {this.state.activeProjectsDetails &&
                  this.state.activeProjectsDetails.filter(
                    (projectInfo) =>
                      !this.props.complete.includes(projectInfo[0]) &&
                      this.props.curated.includes(projectInfo[0])
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
                        this.props.curated.includes(projectInfo[0])
                    )
                    .map((projectInfo, index) => {
                      return (
                        <NavDropdown.Item
                          key={index}
                          as={Link}
                          onClick={() => {
                            this.props.handleToggleView("off");
                          }}
                          to={"/project/" + projectInfo[0]}
                        >
                          {projectInfo[1]} by {projectInfo[2]}
                        </NavDropdown.Item>
                      );
                    })}
              </NavDropdown>
              <NavDropdown title="Artist Playground" id="basic-nav-dropdown">
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
                            this.props.handleToggleView("off");
                          }}
                          to={"/project/" + projectInfo[0]}
                        >
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
                            this.props.handleToggleView("off");
                          }}
                          to={"/project/" + projectInfo[0]}
                        >
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
              </NavDropdown>
              <NavDropdown title="Factory" id="basic-nav-dropdown">
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
                            this.props.handleToggleView("off");
                          }}
                          to={"/project/" + projectInfo[0]}
                        >
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
                            this.props.handleToggleView("off");
                          }}
                          to={"/project/" + projectInfo[0]}
                        >
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
              </NavDropdown>
              <NavDropdown title="All Projects" id="basic-nav-dropdown">
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
                            this.props.handleToggleView("off");
                          }}
                          to={"/project/" + projectInfo[0]}
                        >
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
                            this.props.handleToggleView("off");
                          }}
                          to={"/project/" + projectInfo[0]}
                        >
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
              </NavDropdown>
              <Nav.Link
                as={Link}
                onClick={() => {
                  this.props.handleToggleView("off");
                }}
                to="/gallery"
              >
                Gallery View
              </Nav.Link>

              <Nav.Link
                as={Link}
                onClick={() => {
                  this.props.handleToggleView("off");
                }}
                to={"/learn"}
              >
                Learn
              </Nav.Link>
              <Nav.Link
                as={Link}
                onClick={() => {
                  this.props.handleToggleView("off");
                }}
                to={"/sustainability"}
              >
                Sustainability
              </Nav.Link>
            </Nav>
            <Nav className="ml-auto">
              {this.props.isWhitelisted && (
                <Nav.Link
                  href="#"
                  onClick={() => {
                    this.props.handleToggleView("controlPanel", 0);
                  }}
                >
                  Control Panel
                </Nav.Link>
              )}
              {this.props.tokensOfOwner && (
                <Nav.Link
                  as={Link}
                  onClick={() => {
                    this.props.handleToggleView("off");
                  }}
                  to={"/user/" + this.props.account}
                >
                  Your Items
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>

          {this.props.projectsOfArtist &&
            this.props.projectsOfArtist.length > 0 && (
              <NavDropdown title="Your Projects" id="basic-nav-dropdown">
                {this.props.projectsOfArtist.map((project, index) => {
                  return (
                    <NavDropdown.Item
                      as={Link}
                      onClick={() => {
                        this.props.handleToggleView("off");
                      }}
                      to={"/project/" + project}
                      className="text-center"
                      key={index}
                    >
                      {this.state.allProjectsDetails &&
                      this.state.allProjectsDetails[project]
                        ? this.state.allProjectsDetails[project][1]
                        : "New Project"}
                    </NavDropdown.Item>
                  );
                })}
              </NavDropdown>
            )}

          {this.props.connected === false && (
            <Nav.Link onClick={this.props.handleConnectToMetamask} href="#">
              Connect to Metamask
            </Nav.Link>
          )}
          {this.props.account && (
            <NavDropdown
              title={this.props.account.slice(0, 9)}
              id="basic-nav-dropdown"
            >
              {/*this.props.tokensOfOwner &&

              this.props.tokensOfOwner.map((token, index)=>{
                return(
                      <NavDropdown.Item   onClick={()=>{this.props.handleToggleView("off")}} as={Link} to={"/token/"+token} className="text-center" key={index}>
                        <Image  className="d-block mx-auto img-fluid" alt="token" src={tokenImage(token)} fluid/>
                        </NavDropdown.Item>
                )
              })

            */}
            </NavDropdown>
          )}
        </Navbar>
      </div>
    );
  }
}

export default Navigation;
