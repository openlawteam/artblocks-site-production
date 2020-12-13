//https://oneclickdapp.com/child-cello/

import React, { Component } from 'react'
import { NETWORK,
        ARTBLOCKS_CONTRACT_ABI_A,
        ARTBLOCKS_CONTRACT_ADDRESS_MAINNET_A,
        ARTBLOCKS_CONTRACT_ADDRESS_RINKEBY_A,
        ARTBLOCKS_CONTRACT_ABI_B,
        ARTBLOCKS_CONTRACT_ADDRESS_MAINNET_B,
        ARTBLOCKS_CONTRACT_ADDRESS_RINKEBY_B,
        ARTBLOCKS_CONTRACT_MINTER_ABI,
        ARTBLOCKS_CONTRACT_MINTER_ADDRESS_MAINNET,
        ARTBLOCKS_CONTRACT_MINTER_ADDRESS_RINKEBY
      } from './config'
import Web3 from 'web3'
import Project from './Project';
import Highlight from './Highlight';
import NewToken from './NewToken';
import Navigation from './Nav';
import Intro from './Intro';
import ProjectGallery from './ProjectGallery';
//import YourTokens from './YourTokens';
import Learn from './Learn';
import ControlPanel from './ControlPanel';
import UserGallery from './UserGallery';
import ViewToken from './ViewToken';
import {Col,Row} from 'react-bootstrap';
import {Switch, Route, useParams} from 'react-router-dom';



import './App.css'

function UserGal(props){
  let {address}=useParams();
  return(
  <UserGallery
  handleToggleView = {props.handleToggleView}
  web3 = {props.web3}
  artBlocks = {props.artBlocks}
  artBlocks2 = {props.artBlocks2}
  network = {props.network}
  baseURL ={props.baseURL}
  lookupAcct={address}
  />
)
}

function Proj(props){
  let {project}=useParams();
  return(
  <Project
  project ={project}
  account = {props.account}
  handleToggleView = {props.handleToggleView}
  connected = {props.connected}
  web3 = {props.web3}
  artBlocks = {props.artBlocks}
  artBlocks2 = {props.artBlocks2}
  mainMinter = {props.mainMinter}
  network = {props.network}
  baseURL ={props.baseURL}
  isWhitelisted={props.isWhitelisted}
  minterAddress={props.minterAddress}
  />
)

}

function ViewTok(props){
  let {tokenId}=useParams();
  return(
    <ViewToken
    token={tokenId}
    artBlocks={props.artBlocks}
    artBlocks2={props.artBlocks2}
    handleToggleView = {props.handleToggleView}
    baseURL ={props.baseURL}
    />
  )
}



const API_KEY = process.env.REACT_APP_INFURA_KEY;

class App extends Component {

  constructor(props) {
    super(props)
    this.state = { account: '', connected:false, show:"highlight", currentProject:'', currenttoken:0, lookupAcct:'0x8De4e517A6F0B84654625228D8293b70AB49cF6C', network:'', isWhitelisted:false, overlay:false}
    this.handleConnectToMetamask = this.handleConnectToMetamask.bind(this);
    this.handleToggleView = this.handleToggleView.bind(this);
    this.handleNextProject = this.handleNextProject.bind(this);

  }

  async componentDidMount() {

      const web3 = new Web3(new Web3.providers.HttpProvider(`https://${NETWORK==="main"?"mainnet":"rinkeby"}.infura.io/v3/${API_KEY}`));
      const artBlocks = new web3.eth.Contract(ARTBLOCKS_CONTRACT_ABI_A, NETWORK==="rinkeby"?ARTBLOCKS_CONTRACT_ADDRESS_RINKEBY_A:ARTBLOCKS_CONTRACT_ADDRESS_MAINNET_A);
      const artBlocks2 = new web3.eth.Contract(ARTBLOCKS_CONTRACT_ABI_B, NETWORK==="rinkeby"?ARTBLOCKS_CONTRACT_ADDRESS_RINKEBY_B:ARTBLOCKS_CONTRACT_ADDRESS_MAINNET_B);
      const mainMinter = new web3.eth.Contract(ARTBLOCKS_CONTRACT_MINTER_ABI, NETWORK==="rinkeby"?ARTBLOCKS_CONTRACT_MINTER_ADDRESS_RINKEBY:ARTBLOCKS_CONTRACT_MINTER_ADDRESS_MAINNET);
      const minterAddress = NETWORK==="rinkeby"?ARTBLOCKS_CONTRACT_MINTER_ADDRESS_RINKEBY:ARTBLOCKS_CONTRACT_MINTER_ADDRESS_MAINNET;
      const nextProjectId = await artBlocks2.methods.nextProjectId().call();
      const allProjects = [];
      for (let i=0;i<nextProjectId;i++){
        allProjects.push(i);
      }

      //await artBlocks.methods.showAllProjectIds().call();
      let activeProjects=[];
      await Promise.all(allProjects.map(async (project)=>{
        if (project<3){
          let details = await artBlocks.methods.projectTokenInfo(project).call();
          if (details[4]===true){
            activeProjects.push(project);
          }
        } else {
          let details = await artBlocks2.methods.projectTokenInfo(project).call();
          if (details[4]===true){
            activeProjects.push(project);
          }
        }
        return null;
      }));
      let artistAddresses = await Promise.all(allProjects.map(async (project)=>{
        if (project<3){
          let details = await artBlocks.methods.projectTokenInfo(project).call();
          return details[0];
        } else {
          let details = await artBlocks2.methods.projectTokenInfo(project).call();
          return details[0];
        }

      }));
      const totalInvocations = Number(await artBlocks.methods.totalSupply().call())+ Number(await artBlocks2.methods.totalSupply().call());
      if (this.props.project){
        this.setState({currentProject:this.props.project});
      } else {
        this.setState({currentProject:activeProjects[Math.floor(Math.random()*activeProjects.length)]});
      }
      console.log("active: "+activeProjects);
      this.setState({artBlocks, artBlocks2, mainMinter, minterAddress, web3, allProjects, totalInvocations, artistAddresses, activeProjects});
    //}
  }

async componentDidUpdate(oldProps){
    if (oldProps.show !== this.props.show || oldProps.project !==this.props.project){
      if (this.props.project){
        this.setState({currentProject:this.props.project});
      } else {
        this.setState({currentProject:this.state.activeProjects[Math.floor(Math.random()*this.state.activeProjects.length)]});
      }
      this.setState({show:this.props.show});
    }
}

  async loadAccountData() {
    const accounts = await this.state.web3.eth.getAccounts();
    const tokensOfOwnerA = await this.state.artBlocks.methods.tokensOfOwner(accounts[0]).call();
    const tokensOfOwnerAFiltered = tokensOfOwnerA.filter(token => token<3000000);
    const tokensOfOwnerB = await this.state.artBlocks2.methods.tokensOfOwner(accounts[0]).call();
    const tokensOfOwner = tokensOfOwnerAFiltered.concat(tokensOfOwnerB);
    const isWhitelisted = await this.state.artBlocks.methods.isWhitelisted(accounts[0]).call() && await this.state.artBlocks2.methods.isWhitelisted(accounts[0]).call();
    let projectsOfArtist=[];
    this.state.artistAddresses.map((projectArtistAddress, index)=>{
      if (projectArtistAddress === accounts[0] || isWhitelisted){
        projectsOfArtist.push(index);
      }
      return null;
    });
    this.setState({ account: accounts[0], tokensOfOwner, isWhitelisted, projectsOfArtist });
  }

  async handleConnectToMetamask(){
    if (typeof web3 !== "undefined"){
      const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
      const network = await web3.eth.net.getNetworkType();
      const artBlocks = new web3.eth.Contract(ARTBLOCKS_CONTRACT_ABI_A, NETWORK==="rinkeby"?ARTBLOCKS_CONTRACT_ADDRESS_RINKEBY_A:ARTBLOCKS_CONTRACT_ADDRESS_MAINNET_A);
      const artBlocks2 = new web3.eth.Contract(ARTBLOCKS_CONTRACT_ABI_B, NETWORK==="rinkeby"?ARTBLOCKS_CONTRACT_ADDRESS_RINKEBY_B:ARTBLOCKS_CONTRACT_ADDRESS_MAINNET_B);
      const mainMinter = new web3.eth.Contract(ARTBLOCKS_CONTRACT_MINTER_ABI, NETWORK==="rinkeby"?ARTBLOCKS_CONTRACT_MINTER_ADDRESS_RINKEBY:ARTBLOCKS_CONTRACT_MINTER_ADDRESS_MAINNET);

      if (network === NETWORK){
        window.ethereum.request({method:'eth_requestAccounts'}).then(result=>{
          console.log(result);
          this.setState({connected:true, web3, network, artBlocks, artBlocks2, mainMinter});
          this.loadAccountData();
        });
      }  else {
        alert(`please switch to ${NETWORK==="rinkeby"?"Rinkeby":"Main"} and try to connect again`);
      }
    } else {
      alert("MetaMask not detected. Please install extension and try again.");
    }


  }

  handleNextProject(){

    let newProject = this.state.activeProjects[Math.floor(Math.random()*this.state.activeProjects.length)];
    let oldProject = this.state.currentProject;
    if (newProject!==oldProject){
    this.setState({currentProject:newProject});
  } else {
    this.handleNextProject();
  }
  }

  handleToggleView(view,input){

    if (view==="newToken"){
      this.setState({show:"newToken", currentToken:input, overlay:true});
    } else if (view==="controlPanel"){
      this.setState({show:"controlPanel", overlay:true});
    } else if (view==="off"){
      this.setState({overlay:false});
    }
    if (this.state.connected){
      this.loadAccountData();
    }

  }

  render() {

    let baseURL = NETWORK==="main"?"https://api.artblocks.io":"https://rinkebyapi.artblocks.io";



    //let baseURL = "http://localhost:8080"

    //console.log("currentProject"+this.state.currentProject);
    //console.log(this.state.network && this.state.network);
    return (

      <div className="container-fluid">


      <div>
      {this.state.allProjects &&
      <Navigation
      web3 = {this.state.web3}
      artBlocks = {this.state.artBlocks}
      artBlocks2 = {this.state.artBlocks2}
      handleToggleView = {this.handleToggleView}
      allProjects = {this.state.allProjects}
      activeProjects = {this.state.activeProjects}
      handleConnectToMetamask = {this.handleConnectToMetamask}
      connected = {this.state.connected}
      network = {this.state.network}
      account = {this.state.account}
      tokensOfOwner={this.state.tokensOfOwner}
      baseURL ={baseURL}
      isWhitelisted={this.state.isWhitelisted}
      projectsOfArtist={this.state.projectsOfArtist}
      />
      }
      </div>




      {this.state.overlay &&


        <div>
        {this.state.show==="newToken" &&
          <div>
          <NewToken
          artBlocks={this.state.artBlocks}
          artBlocks2={this.state.artBlocks2}
          token ={this.state.currentToken}
          handleToggleView = {this.handleToggleView}
          baseURL ={baseURL}
          />
          </div>
        }


        {this.state.allProjects && this.state.show==="controlPanel" &&
        <div >
          <ControlPanel
          account = {this.state.account}
          handleToggleView = {this.handleToggleView}
          connected = {this.state.connected}
          web3 = {this.state.web3}
          artBlocks = {this.state.artBlocks2}
          network = {this.state.network}
          baseURL ={baseURL}
          isWhitelisted={this.state.isWhitelisted}
          />
          </div>
        }
      </div>
      }


      {!this.state.overlay &&
      <Switch>
      <Route path="/gallery">
      {this.state.activeProjects &&
        this.state.activeProjects.sort(function(a, b){return a - b}).map((project,index)=>{
        return(
          <div key={index}>
        <ProjectGallery
        key={index}
        project ={project}
        account = {this.state.account}
        tokensOfOwner = {this.state.tokensOfOwner}
        handleToggleView = {this.handleToggleView}
        web3 = {this.state.web3}
        artBlocks = {this.state.artBlocks}
        artBlocks2 = {this.state.artBlocks2}
        network = {this.state.network}
        baseURL ={baseURL}
        />
        </div>
      )
      })
    }

    </Route>

      <Route path="/token/:tokenId">
      {this.state.allProjects &&
      <ViewTok
      artBlocks={this.state.artBlocks}
      artBlocks2={this.state.artBlocks2}
      handleToggleView = {this.handleToggleView}
      baseURL ={baseURL}
      />
    }
      </Route>

      <Route path="/project/:project">
      {this.state.allProjects &&

        <Proj

        account = {this.state.account}
        handleToggleView = {this.handleToggleView}
        connected = {this.state.connected}
        web3 = {this.state.web3}
        artBlocks = {this.state.artBlocks}
        artBlocks2 = {this.state.artBlocks2}
        mainMinter = {this.state.mainMinter}
        minterAddress = {this.state.minterAddress}
        network = {this.state.network}
        baseURL ={baseURL}
        isWhitelisted={this.state.isWhitelisted}
        />
      }
      </Route>

      <Route exact path="/">
      {this.state.allProjects &&
        <div className="container-fluid mt-5">
          <Intro
            allProjects={this.state.allProjects}
            activeProjects = {this.state.activeProjects}
            totalInvocations={this.state.totalInvocations}
          />
        <div className="container mt-5">
          <Row className="align-items-center">
          <Col>
            <Highlight
              project ={this.state.currentProject}
              web3 = {this.state.web3}
              account = {this.state.account}
              tokensOfOwner = {this.state.tokensOfOwner}
              handleToggleView = {this.handleToggleView}
              artBlocks = {this.state.artBlocks}
              artBlocks2 = {this.state.artBlocks2}
              network = {this.state.network}
              handleNextProject = {this.handleNextProject}
              baseURL ={baseURL}
            />
          </Col>
          </Row>
        </div>
        </div>
      }

      </Route>
      <Route path="/user/:address">
      {this.state.allProjects &&
        <UserGal
        handleToggleView = {this.handleToggleView}
        web3 = {this.state.web3}
        artBlocks = {this.state.artBlocks}
        artBlocks2 = {this.state.artBlocks2}
        network = {this.state.network}
        baseURL ={baseURL}
        />
      }
        </Route>



      <Route exact path="/learn">
        <Learn
        baseURL ={baseURL}
        />
        </Route>
        </Switch>
        }

      </div>






    );
  }
}

export default App;
