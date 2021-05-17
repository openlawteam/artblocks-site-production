//https://oneclickdapp.com/child-cello/

import React, {Component} from 'react';
import {
  NETWORK,
  NONINTERACTIVE,
  CURATED,
  COMPLETE,
  ARTBLOCKS_CONTRACT_ABI,
  ARTBLOCKS_CONTRACT_ADDRESS_MAINNET,
  ARTBLOCKS_CONTRACT_ADDRESS_RINKEBY,
  ARTBLOCKS_CONTRACT_MINTER_ABI,
  ARTBLOCKS_CONTRACT_MINTER_ADDRESS_MAINNET,
  ARTBLOCKS_CONTRACT_MINTER_ADDRESS_RINKEBY,
} from './config';
import Web3 from 'web3';
import Project from './Project';
import Highlight from './Highlight';
import NewToken from './NewToken';
import Navigation from './Nav';
import Intro from './Intro';
import ProjectGallery from './ProjectGallery';
//import CookieConsent from "react-cookie-consent";
//import YourTokens from './YourTokens';
import Learn from './Learn';
import Sustainability from './Sustainability';
import ControlPanel from './ControlPanel';
import UserGallery from './UserGallery';
import ViewToken from './ViewToken';
import {Col, Row} from 'react-bootstrap';
import {Switch, Route, useParams} from 'react-router-dom';

import './App.css';

function UserGal(props) {
  let {address} = useParams();
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
  let {project} = useParams();
  return (
    <Project
      handleConnectToMetamask={props.handleConnectToMetamask}
      project={project}
      account={props.account}
      handleToggleView={props.handleToggleView}
      connected={props.connected}
      web3={props.web3}
      artBlocks={props.artBlocks}
      mainMinter={props.mainMinter}
      network={props.network}
      baseURL={props.baseURL}
      isWhitelisted={props.isWhitelisted}
      minterAddress={props.minterAddress}
      nonInter={props.nonInter}
    />
  );
}

function ViewTok(props) {
  let {tokenId} = useParams();
  return (
    <ViewToken
      token={tokenId}
      artBlocks={props.artBlocks}
      handleToggleView={props.handleToggleView}
      baseURL={props.baseURL}
      network={props.network}
      nonInter={props.nonInter}
      web3={props.web3}
    />
  );
}

const API_KEY = process.env.REACT_APP_INFURA_KEY;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      connected: false,
      show: 'highlight',
      currentProject: '',
      currenttoken: 0,
      lookupAcct: '0x8De4e517A6F0B84654625228D8293b70AB49cF6C',
      network: '',
      isWhitelisted: false,
      overlay: false,
      nonInter: NONINTERACTIVE,
    };
    this.handleConnectToMetamask = this.handleConnectToMetamask.bind(this);
    this.handleToggleView = this.handleToggleView.bind(this);
    this.handleNextProject = this.handleNextProject.bind(this);
  }

  async componentDidMount() {
    const web3 = new Web3(
      new Web3.providers.HttpProvider(
        `https://${
          NETWORK === 'main' ? 'mainnet' : 'rinkeby'
        }.infura.io/v3/${API_KEY}`
      )
    );
    const artBlocks = new web3.eth.Contract(
      ARTBLOCKS_CONTRACT_ABI,
      NETWORK === 'rinkeby'
        ? ARTBLOCKS_CONTRACT_ADDRESS_RINKEBY
        : ARTBLOCKS_CONTRACT_ADDRESS_MAINNET
    );
    const mainMinter = new web3.eth.Contract(
      ARTBLOCKS_CONTRACT_MINTER_ABI,
      NETWORK === 'rinkeby'
        ? ARTBLOCKS_CONTRACT_MINTER_ADDRESS_RINKEBY
        : ARTBLOCKS_CONTRACT_MINTER_ADDRESS_MAINNET
    );
    const minterAddress =
      NETWORK === 'rinkeby'
        ? ARTBLOCKS_CONTRACT_MINTER_ADDRESS_RINKEBY
        : ARTBLOCKS_CONTRACT_MINTER_ADDRESS_MAINNET;
    const nextProjectId = await artBlocks.methods.nextProjectId().call();
    const allProjects = [];
    for (let i = 0; i < nextProjectId; i++) {
      allProjects.push(i);
    }

    //await artBlocks.methods.showAllProjectIds().call();
    let activeProjects = [];
    await Promise.all(
      allProjects.map(async (project) => {
        if (project < 3) {
          let details = await artBlocks.methods
            .projectTokenInfo(project)
            .call();
          if (details[4] === true) {
            activeProjects.push(project);
          }
        } else {
          let details = await artBlocks.methods
            .projectTokenInfo(project)
            .call();
          if (details[4] === true) {
            activeProjects.push(project);
          }
        }
        return null;
      })
    );
    let artistAddresses = await Promise.all(
      allProjects.map(async (project) => {
        if (project < 3) {
          let details = await artBlocks.methods
            .projectTokenInfo(project)
            .call();
          return details[0];
        } else {
          let details = await artBlocks.methods
            .projectTokenInfo(project)
            .call();
          return details[0];
        }
      })
    );
    const totalInvocations = Number(
      await artBlocks.methods.totalSupply().call()
    );
    if (this.props.project) {
      this.setState({currentProject: this.props.project});
    } else {
      this.setState({
        currentProject:
          activeProjects[Math.floor(Math.random() * activeProjects.length)],
      });
    }

    if (window.ethereum) {
      const accounts = await new Web3(window.ethereum).eth.getAccounts();
      if (accounts && accounts.length > 0) {
        this.handleConnectToMetamask();
      }

      // Make sure the site reflects if the user has disconnected their wallet
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          this.setState({
            connected: false,
            account: null,
            tokensOfOwner: null,
            isWhitelisted: null,
            projectsOfArtist: null,
          });
        }
      });
    }

    this.setState({
      artBlocks,
      mainMinter,
      minterAddress,
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
        this.setState({currentProject: this.props.project});
      } else {
        this.setState({
          currentProject:
            this.state.activeProjects[
              Math.floor(Math.random() * this.state.activeProjects.length)
            ],
        });
      }
      this.setState({show: this.props.show});
    }
  }

  async loadAccountData() {
    const accounts = await this.state.web3.eth.getAccounts();
    if (accounts && accounts.length > 0) {
      const tokensOfOwnerA = await this.state.artBlocks.methods
        .tokensOfOwner(accounts[0])
        .call();
      const tokensOfOwnerAFiltered = tokensOfOwnerA.filter(
        (token) => token < 3000000
      );
      const tokensOfOwnerB = await this.state.artBlocks.methods
        .tokensOfOwner(accounts[0])
        .call();
      const tokensOfOwner = tokensOfOwnerAFiltered.concat(tokensOfOwnerB);
      const isWhitelisted =
        (await this.state.artBlocks.methods
          .isWhitelisted(accounts[0])
          .call()) &&
        (await this.state.artBlocks.methods.isWhitelisted(accounts[0]).call());
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
  }

  async handleConnectToMetamask() {
    if (typeof window.web3 !== 'undefined') {
      const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
      const network = await web3.eth.net.getNetworkType();
      const artBlocks = new web3.eth.Contract(
        ARTBLOCKS_CONTRACT_ABI,
        NETWORK === 'rinkeby'
          ? ARTBLOCKS_CONTRACT_ADDRESS_RINKEBY
          : ARTBLOCKS_CONTRACT_ADDRESS_MAINNET
      );
      const mainMinter = new web3.eth.Contract(
        ARTBLOCKS_CONTRACT_MINTER_ABI,
        NETWORK === 'rinkeby'
          ? ARTBLOCKS_CONTRACT_MINTER_ADDRESS_RINKEBY
          : ARTBLOCKS_CONTRACT_MINTER_ADDRESS_MAINNET
      );

      if (network === NETWORK) {
        window.ethereum
          .request({method: 'eth_requestAccounts'})
          .then((result) => {
            this.setState({
              connected: true,
              web3,
              network,
              artBlocks,
              mainMinter,
            });
            this.loadAccountData();
          });
      } else {
        alert(
          `please switch to ${
            NETWORK === 'rinkeby' ? 'Rinkeby' : 'Main'
          } and try to connect again`
        );
      }
    } else {
      alert('MetaMask not detected. Please install extension and try again.');
    }
  }

  handleNextProject() {
    let newProject =
      this.state.activeProjects[
        Math.floor(Math.random() * this.state.activeProjects.length)
      ];
    let oldProject = this.state.currentProject;
    if (newProject !== oldProject) {
      this.setState({currentProject: newProject});
    } else {
      this.handleNextProject();
    }
  }

  handleToggleView(view, input) {
    if (view === 'newToken') {
      this.setState({show: 'newToken', currentToken: input, overlay: true});
    } else if (view === 'controlPanel') {
      this.setState({show: 'controlPanel', overlay: true});
    } else if (view === 'off') {
      this.setState({overlay: false});
    }
    if (this.state.connected) {
      this.loadAccountData();
    }
  }

  render() {
    // console.log('his.state.currentProject', this.state.currentProject);
    let baseURL =
      NETWORK === 'main'
        ? 'https://api.artblocks.io'
        : 'https://rinkebyapi.artblocks.io';

    //let baseURL = "http://localhost:8080"

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
              account={this.state.account}
              tokensOfOwner={this.state.tokensOfOwner}
              baseURL={baseURL}
              isWhitelisted={this.state.isWhitelisted}
              projectsOfArtist={this.state.projectsOfArtist}
              curated={CURATED}
              complete={COMPLETE}
            />
          )}
        </div>

        {this.state.overlay && (
          <div>
            {this.state.show === 'newToken' && (
              <div>
                <NewToken
                  artBlocks={this.state.artBlocks}
                  token={this.state.currentToken}
                  handleToggleView={this.handleToggleView}
                  baseURL={baseURL}
                  network={NETWORK}
                />
              </div>
            )}

            {this.state.allProjects && this.state.show === 'controlPanel' && (
              <div>
                <ControlPanel
                  account={this.state.account}
                  handleToggleView={this.handleToggleView}
                  connected={this.state.connected}
                  web3={this.state.web3}
                  artBlocks={this.state.artBlocks}
                  network={this.state.network}
                  baseURL={baseURL}
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
                          network={NETWORK}
                          baseURL={baseURL}
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
                  baseURL={baseURL}
                  network={NETWORK}
                  nonInter={this.state.nonInter}
                  web3={this.state.web3}
                />
              )}
            </Route>

            <Route path="/project/:project">
              {this.state.allProjects && (
                <Proj
                  handleConnectToMetamask={this.handleConnectToMetamask}
                  account={this.state.account}
                  handleToggleView={this.handleToggleView}
                  connected={this.state.connected}
                  web3={this.state.web3}
                  artBlocks={this.state.artBlocks}
                  mainMinter={this.state.mainMinter}
                  minterAddress={this.state.minterAddress}
                  network={NETWORK}
                  baseURL={baseURL}
                  isWhitelisted={this.state.isWhitelisted}
                  nonInter={this.state.nonInter}
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
                          network={NETWORK}
                          handleNextProject={this.handleNextProject}
                          baseURL={baseURL}
                          nonInter={this.state.nonInter}
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
                  network={NETWORK}
                  baseURL={baseURL}
                />
              )}
            </Route>

            <Route exact path="/learn">
              <Learn baseURL={baseURL} />
            </Route>
            <Route exact path="/sustainability">
              <Sustainability baseURL={baseURL} />
            </Route>
          </Switch>
        )}

        {/*<CookieConsent>This website uses cookies to enhance the user experience.</CookieConsent>*/}
      </div>
    );
  }
}

export default App;
