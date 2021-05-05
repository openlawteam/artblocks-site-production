//https://oneclickdapp.com/child-cello/

import React, { Component } from "react";
import { ARTBLOCKS_CONTRACT_ABI, ARTBLOCKS_CONTRACT_ADDRESS } from "./config";
import Web3 from "web3";
import Project from "./Project";
import Highlight from "./Highlight";
import NewToken from "./NewToken";
import Navigation from "./Nav";
import Intro from "./Intro";
import ProjectGallery from "./ProjectGallery";
//import YourTokens from './YourTokens';
import Learn from "./Learn";
import ControlPanel from "./ControlPanel";
import UserGallery from "./UserGallery";
import ViewToken from "./ViewToken";
import { Col, Row } from "react-bootstrap";
import { Switch, Route, useParams } from "react-router-dom";

import "./App.css";

function UserGal(props) {
  let { address } = useParams();
  return (
    <UserGallery
      handleToggleView={props.handleToggleView}
      web3={props.web3}
      artBlocks={props.artBlocks}
      network={props.network}
      baseURL={props.baseURL}
      lookupAcct={address}
    />
  );
}

function Proj(props) {
  let { project } = useParams();
  return (
    <Project
      project={project}
      account={props.account}
      handleToggleView={props.handleToggleView}
      connected={props.connected}
      web3={props.web3}
      artBlocks={props.artBlocks}
      network={props.network}
      baseURL={props.baseURL}
      isWhitelisted={props.isWhitelisted}
    />
  );
}

function ViewTok(props) {
  let { tokenId } = useParams();
  return (
    <ViewToken
      token={tokenId}
      artBlocks={props.artBlocks}
      handleToggleView={props.handleToggleView}
      baseURL={props.baseURL}
    />
  );
}

const API_KEY = process.env.REACT_APP_INFURA_KEY;
const API_URL = process.env.REACT_APP_API_URL;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      connected: false,
      show: "highlight",
      currentProject: "",
      currenttoken: 0,
      lookupAcct: "0x8De4e517A6F0B84654625228D8293b70AB49cF6C",
      network: "",
      isWhitelisted: false,
      overlay: false,
    };
    this.handleConnectToMetamask = this.handleConnectToMetamask.bind(this);
    this.handleToggleView = this.handleToggleView.bind(this);
    this.handleNextProject = this.handleNextProject.bind(this);
  }

  async componentDidMount() {
    const web3 = new Web3(
      new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${API_KEY}`)
    );
    const artBlocks = new web3.eth.Contract(
      ARTBLOCKS_CONTRACT_ABI,
      ARTBLOCKS_CONTRACT_ADDRESS
    );
    const nextProjectId = await artBlocks.methods.nextProjectId().call();
    const allProjects = [];
    for (let i = 0; i < nextProjectId; i++) {
      allProjects.push(i);
    }

    //await artBlocks.methods.showAllProjectIds().call();
    let activeProjects = [];
    await Promise.all(
      allProjects.map(async (project) => {
        let details = await artBlocks.methods.projectTokenInfo(project).call();
        if (details[4] === true) {
          activeProjects.push(project);
        }
        return null;
      })
    );
    let artistAddresses = await Promise.all(
      allProjects.map(async (project) => {
        let details = await artBlocks.methods.projectTokenInfo(project).call();
        return details[0];
      })
    );
    const totalInvocations = await artBlocks.methods.totalSupply().call();
    if (this.props.project) {
      this.setState({ currentProject: this.props.project });
    } else {
      this.setState({
        currentProject:
          activeProjects[Math.floor(Math.random() * activeProjects.length)],
      });
    }
    console.log("active: " + activeProjects);
    this.setState({
      artBlocks,
      web3,
      allProjects,
      totalInvocations,
      artistAddresses,
      activeProjects,
    });
    //}
  }

  async componentDidUpdate(oldProps) {
    if (
      oldProps.show !== this.props.show ||
      oldProps.project !== this.props.project
    ) {
      if (this.props.project) {
        this.setState({ currentProject: this.props.project });
      } else {
        this.setState({
          currentProject: this.state.activeProjects[
            Math.floor(Math.random() * this.state.activeProjects.length)
          ],
        });
      }
      this.setState({ show: this.props.show });
    }
  }

  async loadAccountData() {
    const accounts = await this.state.web3.eth.getAccounts();
    const tokensOfOwner = await this.state.artBlocks.methods
      .tokensOfOwner(accounts[0])
      .call();
    const isWhitelisted = await this.state.artBlocks.methods
      .isWhitelisted(accounts[0])
      .call();
    let projectsOfArtist = [];
    this.state.artistAddresses.map((projectArtistAddress, index) => {
      if (projectArtistAddress === accounts[0] || isWhitelisted) {
        projectsOfArtist.push(index);
      }
      return null;
    });
    this.setState({
      account: accounts[0],
      tokensOfOwner,
      isWhitelisted,
      projectsOfArtist,
    });
  }

  async handleConnectToMetamask() {
    if (typeof web3 !== "undefined") {
      const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
      const network = await web3.eth.net.getNetworkType();
      const artBlocks = new web3.eth.Contract(
        ARTBLOCKS_CONTRACT_ABI,
        ARTBLOCKS_CONTRACT_ADDRESS
      );
      if (network === "main") {
        window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then((result) => {
            console.log(result);
            this.setState({ connected: true, web3, network, artBlocks });
            this.loadAccountData();
          });
      } else {
        alert("please switch to mainnet and try to connect again");
      }
    } else {
      alert("MetaMask not detected. Please install extension and try again.");
    }
  }

  handleNextProject() {
    let newProject = this.state.activeProjects[
      Math.floor(Math.random() * this.state.activeProjects.length)
    ];
    let oldProject = this.state.currentProject;
    if (newProject !== oldProject) {
      this.setState({ currentProject: newProject });
    } else {
      this.handleNextProject();
    }
  }

  handleToggleView(view, input) {
    if (view === "newToken") {
      this.setState({ show: "newToken", currentToken: input, overlay: true });
    } else if (view === "controlPanel") {
      this.setState({ show: "controlPanel", overlay: true });
    } else if (view === "off") {
      this.setState({ overlay: false });
    }
    if (this.state.connected) {
      this.loadAccountData();
    }
  }

  render() {
    //console.log("currentProject"+this.state.currentProject);
    //console.log(this.state.network && this.state.network);
    return (
      <div className="container-fluid">
        <div>
          {this.state.allProjects && (
            <Navigation
              web3={this.state.web3}
              artBlocks={this.state.artBlocks}
              handleToggleView={this.handleToggleView}
              allProjects={this.state.allProjects}
              activeProjects={this.state.activeProjects}
              handleConnectToMetamask={this.handleConnectToMetamask}
              connected={this.state.connected}
              network={this.state.network}
              account={this.state.account}
              tokensOfOwner={this.state.tokensOfOwner}
              baseURL={API_URL}
              isWhitelisted={this.state.isWhitelisted}
              projectsOfArtist={this.state.projectsOfArtist}
            />
          )}
        </div>

        {this.state.overlay && (
          <div>
            {this.state.show === "newToken" && (
              <div>
                <NewToken
                  artBlocks={this.state.artBlocks}
                  token={this.state.currentToken}
                  handleToggleView={this.handleToggleView}
                  baseURL={API_URL}
                />
              </div>
            )}

            {this.state.allProjects && this.state.show === "controlPanel" && (
              <div>
                <ControlPanel
                  account={this.state.account}
                  handleToggleView={this.handleToggleView}
                  connected={this.state.connected}
                  web3={this.state.web3}
                  artBlocks={this.state.artBlocks}
                  network={this.state.network}
                  baseURL={API_URL}
                  isWhitelisted={this.state.isWhitelisted}
                />
              </div>
            )}
          </div>
        )}

        {!this.state.overlay && (
          <Switch>
            <Route path="/gallery">
              {this.state.activeProjects &&
                this.state.activeProjects
                  .sort(function (a, b) {
                    return a - b;
                  })
                  .map((project, index) => {
                    return (
                      <div key={index}>
                        <ProjectGallery
                          key={index}
                          project={project}
                          account={this.state.account}
                          tokensOfOwner={this.state.tokensOfOwner}
                          handleToggleView={this.handleToggleView}
                          web3={this.state.web3}
                          artBlocks={this.state.artBlocks}
                          network={this.state.network}
                          baseURL={API_URL}
                        />
                      </div>
                    );
                  })}
            </Route>

            <Route path="/token/:tokenId">
              {this.state.allProjects && (
                <ViewTok
                  artBlocks={this.state.artBlocks}
                  handleToggleView={this.handleToggleView}
                  baseURL={API_URL}
                />
              )}
            </Route>

            <Route path="/project/:project">
              {this.state.allProjects && (
                <Proj
                  account={this.state.account}
                  handleToggleView={this.handleToggleView}
                  connected={this.state.connected}
                  web3={this.state.web3}
                  artBlocks={this.state.artBlocks}
                  network={this.state.network}
                  baseURL={API_URL}
                  isWhitelisted={this.state.isWhitelisted}
                />
              )}
            </Route>

            <Route exact path="/">
              {this.state.allProjects && (
                <div className="container-fluid mt-5">
                  <Intro
                    allProjects={this.state.allProjects}
                    activeProjects={this.state.activeProjects}
                    totalInvocations={this.state.totalInvocations}
                  />
                  <div className="container mt-5">
                    <Row className="align-items-center">
                      <Col>
                        <Highlight
                          project={this.state.currentProject}
                          web3={this.state.web3}
                          account={this.state.account}
                          tokensOfOwner={this.state.tokensOfOwner}
                          handleToggleView={this.handleToggleView}
                          artBlocks={this.state.artBlocks}
                          network={this.state.network}
                          handleNextProject={this.handleNextProject}
                          baseURL={API_URL}
                        />
                      </Col>
                    </Row>
                  </div>
                </div>
              )}
            </Route>
            <Route path="/user/:address">
              {this.state.allProjects && (
                <UserGal
                  handleToggleView={this.handleToggleView}
                  web3={this.state.web3}
                  artBlocks={this.state.artBlocks}
                  network={this.state.network}
                  baseURL={API_URL}
                />
              )}
            </Route>

            <Route exact path="/learn">
              <Learn baseURL={API_URL} />
            </Route>
          </Switch>
        )}
      </div>
    );
  }
}

export default App;
