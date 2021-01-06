import React, { Component} from 'react'
import {Button, Col, Row, Image} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import UserGalleryCard from './UserGalleryCard';


class UserGallery extends Component {
  constructor(props) {
    super(props)
    this.state = {};

  }

  async componentDidMount() {
    const artBlocks = this.props.artBlocks;
    const artBlocks2 = this.props.artBlocks2;

    //console.log("lua"+this.props.lookupAcct);
    const tokensOfAccountA = await artBlocks.methods.tokensOfOwner(this.props.lookupAcct).call();
    const tokensOfAccountAFiltered = tokensOfAccountA.filter(token => token < 3000000);
    //console.log(tokensOfAccountAFiltered);
    //console.log("TA"+tokensOfAccountA);
    const tokensOfAccountB = await artBlocks2.methods.tokensOfOwner(this.props.lookupAcct).call();
    //console.log("TB"+tokensOfAccountB);
    const tokensOfAccount = tokensOfAccountAFiltered.concat(tokensOfAccountB);
    //console.log("TOA"+tokensOfAccount);


    const tokenData = await Promise.all(tokensOfAccount.map(async (token)=>{
      const projectId = token<3000000?await artBlocks.methods.tokenIdToProjectId(token).call():await artBlocks2.methods.tokenIdToProjectId(token).call();
      return [token, projectId];
    }));
    let projectsOfAccount = new Set(await Promise.all(tokensOfAccount.map(async (token)=>{
      let projectId = token<3000000?await artBlocks.methods.tokenIdToProjectId(token).call():await artBlocks2.methods.tokenIdToProjectId(token).call();
      return projectId;
    })));

    this.setState({artBlocks, artBlocks2, tokenData, projectsOfAccount, tokensOfAccount});
    this.buildUserTokenArray();
  }

  async componentDidUpdate(oldProps){
    if (oldProps.lookupAcct !== this.props.lookupAcct){
      console.log('acctchange');
    const artBlocks = this.props.artBlocks;
    const artBlocks2 = this.props.artBlocks2;

    const tokensOfAccount = await artBlocks.methods.tokensOfOwner(this.props.lookupAcct).call();
    const tokenData = await Promise.all(tokensOfAccount.map(async (token)=>{
      const projectId = token<3000000?await artBlocks.methods.tokenIdToProjectId(token).call():await artBlocks2.methods.tokenIdToProjectId(token).call();
      return [token, projectId];
    }));
    let projectsOfAccount = new Set(await Promise.all(tokensOfAccount.map(async (token)=>{
      let projectId = token<3000000?await artBlocks.methods.tokenIdToProjectId(token).call():await artBlocks2.methods.tokenIdToProjectId(token).call();
      return projectId;
    })));
    this.setState({artBlocks, tokenData, projectsOfAccount, tokensOfAccount});
    this.buildUserTokenArray();
    }
  }

  async buildUserTokenArray() {
    let projects ={};

    for (let project of this.state.projectsOfAccount) {
      const contract = project<3?this.state.artBlocks:this.state.artBlocks2;
      const projectDescription = await contract.methods.projectDetails(project).call();
      const projectTokenDetails = await contract.methods.projectTokenInfo(project).call();
      const projectScriptDetails = await contract.methods.projectScriptInfo(project).call();
      const projectURIInfo = await contract.methods.projectURIInfo(project).call();
      let currency;
      if (project>=3){
        currency = await contract.methods.projectIdToCurrencySymbol(project).call();
      } else {
        currency="ETH";
      }

      console.log(currency);

      let tokens = [];
      for (let i=0;i<this.state.tokenData.length;i++){
        if (this.state.tokenData[i][1]===project){
          tokens.push(this.state.tokenData[i][0]);
        }
      }
      projects[project]={tokens,projectDescription,projectTokenDetails,projectScriptDetails,projectURIInfo,currency}
      };
    this.setState({projects});
  }

  render() {


    //console.log(this.props);
    /*
    let baseURL = this.props.baseURL;

    function tokenImage(token){
      //return "https://mainnet.oss.nodechef.com/"+token+".png";
      return baseURL+'/image/'+token;
    }

    function tokenThumb(token){
      return "https://rinkthumb.oss.nodechef.com/"+token+".png";
      //return baseURL+'/thumb/'+token;
    }

    function tokenGenerator(token){
      return baseURL+'/generator/'+token;
    }
    */

    return (
      <div className="mt-4">
      <h5>User <a href={"https://www.etherscan.io/address/"+this.props.lookupAcct} target="_blank" rel="noopener noreferrer">{this.props.lookupAcct.slice(0,10)}'s</a> Collection <a href={"https://opensea.io/accounts/"+this.props.lookupAcct} target="_blank" rel="noopener noreferrer"><Image width="50" src="/os_logo.png"/></a></h5>
      <p>Total works purchased or minted: {this.state.tokensOfAccount && this.state.tokensOfAccount.length}</p>

      <br/>
      {this.state.projects &&

            Object.keys(this.state.projects).map((project,index) => {
              return(
              <div key={index}>
              <Row >
                <Col xs={12} sm={6} md={3}>
                  <div className="sticky-top">
                  <div className="text-align-center">
                  <br />
                  <br />
                  <br />

                  <h1>{this.state.projects[project].projectDescription[0]}</h1>
                  <h3>by {this.state.projects[project].projectDescription[1]}</h3>
                  <a href={this.state.projects[project].projectDescription[3]} target="_blank" rel="noopener noreferrer">{this.state.projects[project].projectDescription[3]}</a>
                  <p>Total Minted: {this.state.projects[project].projectTokenDetails[2]} / {this.state.projects[project].projectTokenDetails[3]} max</p>
                  <br />
                  <p>{this.state.projects[project].projectDescription[2]}</p>
                  <br/>
                  <p>Price per token: {this.props.web3.utils.fromWei(this.state.projects[project].projectTokenDetails[1] ,'ether')}{this.state.projects[project].currency==="ETH"?"Ξ":" "+this.state.projects[project].currency}</p>
                  <br />
                  <Button variant="dark btn-sm" as={Link} to={'/project/'+project} >Visit Project</Button>
                  </div>
                  </div>
                </Col>

                <Col xs={12} sm={6} md={9}>
                <UserGalleryCard
                project={project}
                projects={this.state.projects}
                baseURL={this.props.baseURL}
                handleToggleView={this.props.handleToggleView}
                />


                {/*
                  <CardDeck>
                    {this.state.projects[project].tokens.map((token,index)=>{
                      return (
                        <div key={index}>
                        <Col>
                          <Card border="light" className='mx-auto' style={{ width: '16rem' }} >
                          <Card.Body>

                            {<Card.Img src={tokenThumb(token)} />}

                            <div className="text-center">
                            <ButtonGroup size="sm">
                              <Button variant="light" disabled>#{Number(token)-Number(project)*1000000}</Button>
                              <Button as={Link} to={"/token/"+token} variant="light" onClick={() => this.props.handleToggleView("viewToken",token)}>Details</Button>
                              <Button variant="light" onClick={()=> window.open(tokenImage(token), "_blank")}>Image</Button>
                              <Button variant="light" onClick={()=> window.open(tokenGenerator(token), "_blank")}>Live</Button>
                            </ButtonGroup>
                            </div>
                          </Card.Body>
                          </Card>
                        </Col>
                        </div>
                      )})}

                  </CardDeck>
                  */}
                </Col>
              </Row>
              <hr />
              </div>

            )
          })
    }
</div>
    );
  }
}

export default UserGallery;
