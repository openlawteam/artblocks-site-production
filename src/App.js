//https://oneclickdapp.com/child-cello/

import React, {Component} from 'react';
import {
  NETWORK,
  NONINTERACTIVE,
  CURATED,
  COMPLETE,
  ARTBLOCKS_CONTRACT_ABI,
  ARTBLOCKS_CONTRACT_MINTER_ABI,
  getArtblocksContractAddresses,
  getChainIdName,
} from './config';
import Web3 from 'web3';
import Project from './Project';
import NewToken from './NewToken';
import Navigation from './Nav';
import ProjectGallery from './ProjectGallery';
import Footer from './Footer';
import UserGallery from './UserGallery';
import ViewToken from './ViewToken';
import {Switch, Route, useParams, Redirect} from 'react-router-dom';

import './App.css';

function UserGal(props) {
  let {address} = useParams();
  return (
    <UserGallery
      handleToggleView={props.handleToggleView}
      web3={props.web3}
      artBlocks={props.artBlocks}
      network={props.network}
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
      currentProject: 0,
      currenttoken: 0,
      lookupAcct: '0x8De4e517A6F0B84654625228D8293b70AB49cF6C',
      network: '',
      isWhitelisted: false,
      validationErrorMessage: '',
      overlay: false,
      nonInter: NONINTERACTIVE,
    };
    this.handleConnectToMetamask = this.handleConnectToMetamask.bind(this);
    this.handleToggleView = this.handleToggleView.bind(this);
    this.handleNextProject = this.handleNextProject.bind(this);
    this.initializeWebInstance = this.initializeWebInstance.bind(this);

    // this.ETHEREUM_HTTP_PROVIDER_URL = new Web3.providers.HttpProvider(
    //   `https://${NETWORK}.infura.io/v3/${API_KEY}`
    // );
    this.ETHEREUM_WS_PROVIDER_URL = new Web3.providers.WebsocketProvider(
      `wss://${NETWORK}.infura.io/ws/v3/${API_KEY}`
    );
  }

  async componentDidMount() {
    try {
      const {artBlocks, mainMinter, minterAddress, web3} =
        await this.initializeWebInstance();

      const nextProjectId = await artBlocks.methods.nextProjectId().call();
      const allProjects = [];

      for (let i = 0; i < nextProjectId; i++) {
        allProjects.push(i);
      }

      let activeProjects = [];

      await Promise.all(
        allProjects.map(async (project) => {
          let details = await artBlocks.methods
            .projectTokenInfo(project)
            .call();

          if (details[4] === true || NETWORK !== 'mainnet') {
            activeProjects.push(project);
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
            activeProjects[Math.floor(Math.random() * activeProjects.length)] ||
            0,
        });
      }

      if (window.ethereum) {
        const accounts = await new Web3(window.ethereum).eth.getAccounts();

        if (accounts && accounts.length > 0) {
          await this.handleConnectToMetamask();
        }

        // Make sure the site reflects if the user has disconnected their wallet
        window.ethereum.on('accountsChanged', async (accounts) => {
          const {artBlocks, mainMinter, minterAddress, web3} =
            await this.initializeWebInstance();

          if (accounts.length === 0) {
            this.setState({
              connected: false,
              account: null,
              tokensOfOwner: null,
              isWhitelisted: null,
              projectsOfArtist: null,
              validationErrorMessage: null,
            });
          } else {
            try {
              if (accounts[0]) {
                this.setState({
                  connected: accounts[0] !== undefined,
                  account: accounts[0],
                  web3,
                  artBlocks,
                  mainMinter,
                  minterAddress,
                });
              }
            } catch (error) {
              console.error(error);
            }
          }
        });

        // https://docs.metamask.io/guide/ethereum-provider.html#chainchanged
        window.ethereum.on('chainChanged', (_chainId) => {
          window.location.reload();
        });

        try {
          if (accounts[0]) {
            this.setState({
              connected: accounts[0] !== undefined,
              account: accounts[0],
            });
          }
        } catch (error) {
          console.error(error);
        }
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
    } catch (error) {
      console.error(error);
    }
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

  async initializeWebInstance() {
    try {
      let web3 = new Web3(
        window.ethereum ? Web3.givenProvider : this.ETHEREUM_WS_PROVIDER_URL
      );
      const networkId = await web3.eth.net.getId();

      // if the wrong network is connected, re-init web3 and alert the user
      if (getChainIdName(networkId) !== NETWORK) {
        web3 = new Web3(this.ETHEREUM_WS_PROVIDER_URL);
      }

      const minterAddress =
        getArtblocksContractAddresses(NETWORK).minterContractAddress;

      const artBlocks = new web3.eth.Contract(
        ARTBLOCKS_CONTRACT_ABI,
        getArtblocksContractAddresses(NETWORK).coreContractAddress
      );

      const mainMinter = new web3.eth.Contract(
        ARTBLOCKS_CONTRACT_MINTER_ABI,
        minterAddress
      );

      return {artBlocks, mainMinter, minterAddress, networkId, web3};
    } catch (error) {
      console.error('initializeWebInstance ::: error', error);
    }
  }

  async loadAccountData() {
    try {
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

        let projectsOfArtist = [];

        this.state.artistAddresses?.map((projectArtistAddress, index) => {
          if (projectArtistAddress === accounts[0]) {
            projectsOfArtist.push(index);
          }
          return null;
        });

        this.setState({
          account: accounts[0],
          tokensOfOwner,
          projectsOfArtist,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  async handleConnectToMetamask() {
    if (typeof window.web3 !== 'undefined') {
      const {artBlocks, mainMinter, networkId, web3} =
        await this.initializeWebInstance();

      if (getChainIdName(networkId) === NETWORK) {
        await window.ethereum
          .request({method: 'eth_requestAccounts'})
          .then((result) => {
            this.setState({
              connected: true,
              web3,
              network: NETWORK,
              artBlocks,
              mainMinter,
            });

            this.loadAccountData();
          });
      } else {
        alert(`Please switch to ${NETWORK} and try to connect again`);
      }
    } else {
      alert(
        'Ethereum wallet not detected. Please install extension and try again.'
      );
    }
  }

  handleNextProject() {
    try {
      // if there is only one project, just show it
      if (this.state.activeProjects.length <= 1) {
        this.setState({currentProject: 0});

        return;
      }

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
    } catch (error) {
      console.error(error);
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
    return (
      <>
        <header>
          <div className="header">
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
                isWhitelisted={this.state.isWhitelisted}
                projectsOfArtist={this.state.projectsOfArtist}
                curated={CURATED}
                complete={COMPLETE}
                network={NETWORK}
              />
            )}
          </div>
        </header>
        <main>
          <div className="container-fluid">
            {this.state.overlay && (
              <div>
                {this.state.show === 'newToken' && (
                  <div>
                    <NewToken
                      artBlocks={this.state.artBlocks}
                      token={this.state.currentToken}
                      handleToggleView={this.handleToggleView}
                      network={NETWORK}
                    />
                  </div>
                )}

                {/* {this.state.allProjects && this.state.show === 'controlPanel' && (
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
                )} */}
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
                      isWhitelisted={this.state.isWhitelisted}
                      nonInter={this.state.nonInter}
                    />
                  )}
                </Route>

                <Route
                  exact
                  path="/"
                  render={() => (
                    <Redirect to={`/project/${this.state.currentProject}`} />
                  )}
                />

                {/* <Route exact path="/">
                  {this.state.allProjects && (
                    <div className="section-wrapper">
                      <div className="container-fluid mt-5 content-wrapper">
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
                                allProjects={this.state.allProjects}
                                web3={this.state.web3}
                                account={this.state.account}
                                tokensOfOwner={this.state.tokensOfOwner}
                                handleToggleView={this.handleToggleView}
                                artBlocks={this.state.artBlocks}
                                network={NETWORK}
                                handleNextProject={this.handleNextProject}
                                nonInter={this.state.nonInter}
                              />
                            </Col>
                          </Row>
                        </div>
                      </div>
                    </div>
                  )}
                </Route> */}

                <Route path="/user/:address">
                  {this.state.allProjects && (
                    <UserGal
                      handleToggleView={this.handleToggleView}
                      web3={this.state.web3}
                      artBlocks={this.state.artBlocks}
                      network={NETWORK}
                    />
                  )}
                </Route>

                {/* <Route exact path="/learn">
                  <Learn baseURL={baseURL} />
                </Route>
                <Route exact path="/sustainability">
                  <Sustainability baseURL={baseURL} />
                </Route> */}
              </Switch>
            )}
            {/*<CookieConsent>This website uses cookies to enhance the user experience.</CookieConsent>*/}
          </div>
        </main>
        <Footer />
      </>
    );
  }
}

export default App;
