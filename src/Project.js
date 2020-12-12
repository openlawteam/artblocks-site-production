import React, { Component} from 'react'
import {Card, Button, CardDeck, Spinner,Col, Row, Form, Tabs, Tab, ButtonGroup, Pagination, Container, InputGroup, FormControl} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {ERC20_ABI} from './config';
//import {TwitterShareButton} from 'react-twitter-embed';


class Project extends Component {
  constructor(props) {
    super(props)
    this.state = {loadQueue:this.props.project*1000000, account:'',tokenURIInfo:'', purchase:false, ineraction:false, project:this.props.project, artistInterface:false, formValue:'', idValue:'', page:1, scriptJSON:{}, purchaseTo:false, purchaseToAddress:'', currency:'', currencyAddress:'', erc20:'', approved:true, erc20Balance:''};
    this.handleNextImage = this.handleNextImage.bind(this);
    this.handleToggleArtistInterface = this.handleToggleArtistInterface.bind(this);
    this.purchase = this.purchase.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleIdChange = this.handleIdChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleJSON = this.handleJSON.bind(this);
    this.handlePurchaseTo = this.handlePurchaseTo.bind(this);
    this.handlePurchaseToAddressChange = this.handlePurchaseToAddressChange.bind(this);
    this.approve = this.approve.bind(this);

  }

  async componentDidMount() {


    const artBlocks = this.props.project<3?this.props.artBlocks:this.props.artBlocks2;
    const projectTokens = await artBlocks.methods.projectShowAllTokens(this.props.project).call();
    const projectDescription = await artBlocks.methods.projectDetails(this.props.project).call();
    const projectTokenDetails = await artBlocks.methods.projectTokenInfo(this.props.project).call();
    const projectScriptDetails = await artBlocks.methods.projectScriptInfo(this.props.project).call();
    const projectURIInfo = await artBlocks.methods.projectURIInfo(this.props.project).call();
    const projectRoyaltyInfo = await artBlocks.methods.getRoyaltyData(this.props.project).call();
    if (this.props.project>=3){
      let currency = await artBlocks.methods.projectIdToCurrencySymbol(this.props.project).call();
      let currencyAddress = await artBlocks.methods.projectIdToCurrencyAddress(this.props.project).call();
      if (currency !== "ETH"){
        let erc20 = new this.props.web3.eth.Contract(ERC20_ABI, currencyAddress);
        if (this.props.connected){
          let erc20Balance = await erc20.methods.balanceOf(this.props.account).call();
          this.setState({erc20Balance});
        }
        this.setState({erc20});
      }
      this.setState({currency, currencyAddress});
      if (this.props.connected && this.state.currency !== "ETH"){
        setTimeout(x=>{
          this.checkAllowance();
        },500);
      }
    } else {
      this.setState({currency:"ETH"});
    }
    let scriptJSON = projectScriptDetails[0] && JSON.parse(projectScriptDetails[0]);
    console.log("still setting state");
    this.setState({artBlocks, projectTokens, projectDescription, projectTokenDetails, projectScriptDetails, scriptJSON, projectURIInfo, projectRoyaltyInfo/*, network*/});
  }


  async checkAllowance(){
      let allowance = await this.state.erc20.methods.allowance(this.props.account, this.props.minterAddress).call();
      console.log(allowance);

      if (allowance >= this.state.projectTokenDetails[1]){
        this.setState({approved:true});
        console.log("setting approved to true");
      } else {
        this.setState({approved:false});
        console.log("setting approved to false");
      }
  }

  async checkBalance(){
    let balanceRaw = await this.state.erc20.methods.balanceOf(this.props.account).call();
    let balance = this.props.web3.utils.fromWei(balanceRaw,'ether')
    console.log(balance);
    this.setState({erc20Balance:balance});
  }


  async componentDidUpdate(oldProps){
    if (oldProps.project !== this.props.project){
      console.log('change');


      const artBlocks = this.props.project<3?this.props.artBlocks:this.props.artBlocks2;
      const projectTokens = await artBlocks.methods.projectShowAllTokens(this.props.project).call();
      const projectDescription = await artBlocks.methods.projectDetails(this.props.project).call();
      const projectTokenDetails = await artBlocks.methods.projectTokenInfo(this.props.project).call();
      const projectScriptDetails = await artBlocks.methods.projectScriptInfo(this.props.project).call();
      const projectURIInfo = await artBlocks.methods.projectURIInfo(this.props.project).call();
      const projectRoyaltyInfo = await artBlocks.methods.getRoyaltyData(this.props.project).call();
      if (this.props.project>=3){
        let currency = await artBlocks.methods.projectIdToCurrencySymbol(this.props.project).call();
        let currencyAddress = await artBlocks.methods.projectIdToCurrencyAddress(this.props.project).call();
        if (currency !== "ETH"){
          let erc20 = new this.props.web3.eth.Contract(ERC20_ABI, currencyAddress);
          if (this.props.connected){
            if (this.props.connected){
              setTimeout(x=>{
              this.checkBalance();
              },500);
            }
          }
          this.setState({erc20});
        }
        this.setState({currency, currencyAddress});
        if (this.state.currency !== "ETH"){
          setTimeout(x=>{
            this.checkAllowance();
          },500);
        }
      } else {
        this.setState({currency:"ETH"});
      }


      let scriptJSON = projectScriptDetails[0] && JSON.parse(projectScriptDetails[0]);
      this.setState({page:1,loadQueue:this.props.project*1000000+((this.props.page-1)*20),projectTokens, projectDescription, projectTokenDetails, projectScriptDetails, scriptJSON, projectURIInfo, projectRoyaltyInfo, project:this.props.project, approved:true});

    } else if (oldProps.artBlocks !== this.props.artBlocks){
      console.log("change artBlocks?");
      const artBlocks = this.props.project<3?this.props.artBlocks:this.props.artBlocks2;
      if (this.props.project>=3){
        let currency = await artBlocks.methods.projectIdToCurrencySymbol(this.props.project).call();
        let currencyAddress = await artBlocks.methods.projectIdToCurrencyAddress(this.props.project).call();
        if (currency !== "ETH"){
          let erc20 = new this.props.web3.eth.Contract(ERC20_ABI, currencyAddress);
          if (this.props.connected){
            setTimeout(x=>{
            this.checkBalance();
            },500);
          }
          this.setState({erc20});
        }
        this.setState({currency, currencyAddress});
        if (this.state.currency !== "ETH"){
          setTimeout(x=>{
            this.checkAllowance();
          },500);
        }
      } else {
        this.setState({currency:"ETH"});
      }
      this.setState({artBlocks});
    }


    if (oldProps.connected !== this.props.connected){
      console.log("change connected");
      const artBlocks = this.props.project<3?this.props.artBlocks:this.props.artBlocks2;
      if (this.props.project>=3){
        let currency = await this.state.artBlocks.methods.projectIdToCurrencySymbol(this.props.project).call();
        let currencyAddress = await this.state.artBlocks.methods.projectIdToCurrencyAddress(this.props.project).call();
        if (currency !== "ETH"){
          let erc20 = new this.props.web3.eth.Contract(ERC20_ABI, currencyAddress);
          if (this.props.connected){
            if (this.props.connected){
              setTimeout(x=>{
              this.checkBalance();
              },500);
            }
          }
          this.setState({erc20});
        }
        this.setState({currency, currencyAddress});
      } else {
        this.setState({currency:"ETH"});
      }

      if (this.props.project>=3){
        if (this.state.currency !== "ETH"){
          setTimeout(x=>{
            this.checkAllowance();
          },500);
        }
      }
      this.setState({artBlocks});
    }
  }

  async updateValues(){
    const artBlocks = this.props.project<3?this.props.artBlocks:this.props.artBlocks2;
    const projectTokens = await artBlocks.methods.projectShowAllTokens(this.props.project).call();
    const projectDescription = await artBlocks.methods.projectDetails(this.props.project).call();
    const projectTokenDetails = await artBlocks.methods.projectTokenInfo(this.props.project).call();
    const projectScriptDetails = await artBlocks.methods.projectScriptInfo(this.props.project).call();
    const projectURIInfo = await artBlocks.methods.projectURIInfo(this.props.project).call();
    const projectRoyaltyInfo = await artBlocks.methods.getRoyaltyData(this.props.project).call();
    if (this.props.project>=3 && this.state.currency !=="ETH"){
      if (this.props.connected){
        let erc20Balance = await this.state.erc20.methods.balanceOf(this.props.account).call();
        this.setState({erc20Balance});
      }
      console.log("updated values");
      this.checkAllowance();
    } else {
      this.setState({currency:"ETH"});
    }
    this.setState({projectDescription, projectTokenDetails, projectScriptDetails, projectURIInfo, projectRoyaltyInfo, projectTokens, project:this.props.project, approved:true});
  }

  getOSLink(){
    if (this.props.project && this.props.project==="1"){
      console.log("osp1");
      return "https://opensea.io/assets/art-blocks?search=%7B%22collections%22%3A%5B%22art-blocks%22%5D%2C%22includeHiddenCollections%22%3Afalse%2C%22stringTraits%22%3A%5B%7B%22name%22%3A%22Project%22%2C%22values%22%3A%5B%22Genesis%20by%20DCA%22%5D%7D%5D%7D";
    } else if (this.props.project && this.props.project==="2"){
      console.log("osp2");
      return "https://opensea.io/assets/art-blocks?search=%7B%22collections%22%3A%5B%22art-blocks%22%5D%2C%22includeHiddenCollections%22%3Afalse%2C%22stringTraits%22%3A%5B%7B%22name%22%3A%22Project%22%2C%22values%22%3A%5B%22Construction%20Token%20by%20Jeff%20Davis%22%5D%7D%5D%7D";
    } else {
      return "";
    }

  }

  handleToggleArtistInterface(){
    this.setState({artistInterface:!this.state.artistInterface});
  }

  handleValueChange(event) {
    this.setState({ formValue:event.target.value });
  }

  handlePurchaseToAddressChange(event) {
    this.setState({ purchaseToAddress:event.target.value });
  }

  handleIdChange(event) {
    this.setState({ idValue:event.target.value });
  }

  handlePurchaseTo(){
    let purchaseToState=this.state.purchaseTo;
    this.setState({purchaseTo:!purchaseToState});
  }

  handleJSON(event,field){
    if (event.target.value){
    let json = this.state.scriptJSON?this.state.scriptJSON:{};
    json[field]=event.target.value;
    this.setState({scriptJSON:json});
  } else {
    let json = this.state.scriptJSON;
    delete json[field];
    this.setState({scriptJSON:json});
  }
  }

  async handleChange(e,type){
    e.preventDefault();
    this.setState({interaction:true});

    if (type === "price"){
    await this.state.artBlocks.methods.updateProjectPricePerTokenInWei(this.props.project, this.props.web3.utils.toWei(this.state.formValue,'ether')).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "projectName"){
    await this.state.artBlocks.methods.updateProjectName(this.props.project, this.state.formValue).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "artistName"){
    await this.state.artBlocks.methods.updateProjectArtistName(this.props.project, this.state.formValue).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  }
  else if (type === "website"){
    await this.state.artBlocks.methods.updateProjectWebsite(this.props.project, this.state.formValue).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "description"){
    await this.state.artBlocks.methods.updateProjectDescription(this.props.project, this.state.formValue).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "license"){
    await this.state.artBlocks.methods.updateProjectLicense(this.props.project, this.state.formValue).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "maxInvocations"){
    await this.state.artBlocks.methods.updateProjectMaxInvocations(this.props.project, this.state.formValue).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "addScript"){
    await this.state.artBlocks.methods.addProjectScript(this.props.project, this.state.formValue).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "removeLastScript"){
    await this.state.artBlocks.methods.removeProjectLastScript(this.props.project).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "updateScript"){
    //alert(this.props.project, this.state.idValue, this.state.formValue);
    await this.state.artBlocks.methods.updateProjectScript(this.props.project, this.state.idValue, this.state.formValue).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "updateArtistAddress"){
    //alert(this.props.project, this.state.idValue, this.state.formValue);
    await this.state.artBlocks.methods.updateProjectArtistAddress(this.props.project, this.state.formValue).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
      //this.setState({loadQueue:this.props.project*1000000});
      this.setState({artistInterface:false})
    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "hashesPerToken"){
    //alert(this.props.project, this.state.idValue, this.state.formValue);
    await this.state.artBlocks.methods.toggleProjectUseHashString(this.props.project).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
      //this.setState({loadQueue:this.props.project*1000000});

    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "updateAdditionalPayee"){
    //alert(this.props.project, this.state.idValue, this.state.formValue);
    await this.state.artBlocks.methods.updateProjectAdditionalPayee(this.props.project, this.state.formValue).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
      //this.setState({loadQueue:this.props.project*1000000});

    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "updateAdditionalPayeePercentage"){
    //alert(this.props.project, this.state.idValue, this.state.formValue);
    await this.state.artBlocks.methods.updateProjectAdditionalPayeePercentage(this.props.project, this.state.formValue).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
      //this.setState({loadQueue:this.props.project*1000000});

    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "updateSecondaryMarketRoyaltyPercentage"){
    //alert(this.props.project, this.state.idValue, this.state.formValue);
    await this.state.artBlocks.methods.updateProjectSecondaryMarketRoyaltyPercentage(this.props.project, this.state.formValue).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
      //this.setState({loadQueue:this.props.project*1000000});

    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "scriptJSON"){
    //alert(this.props.project, this.state.idValue, this.state.formValue);
    await this.state.artBlocks.methods.updateProjectScriptJSON(this.props.project, JSON.stringify(this.state.scriptJSON)).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
      //this.setState({loadQueue:this.props.project*1000000});

    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "updateProjectIpfsHash"){
    //alert(this.props.project, this.state.idValue, this.state.formValue);
    await this.state.artBlocks.methods.updateProjectIpfsHash(this.props.project, this.state.formValue).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
      //this.setState({loadQueue:this.props.project*1000000});

    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "updateProjectBaseURI"){
    //alert(this.props.project, this.state.idValue, this.state.formValue);
    await this.state.artBlocks.methods.updateProjectBaseURI(this.props.project, this.state.formValue).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
      //this.setState({loadQueue:this.props.project*1000000});

    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "updateProjectBaseIpfsURI"){
    //alert(this.props.project, this.state.idValue, this.state.formValue);
    await this.state.artBlocks.methods.updateProjectBaseIpfsURI(this.props.project, this.state.formValue).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
      //this.setState({loadQueue:this.props.project*1000000});

    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "updateProjectCurrencyInfo"){
    //alert(this.props.project, this.state.idValue, this.state.formValue);
    let address=this.state.formValue===""?"0x0000000000000000000000000000000000000000":this.state.formValue;
    console.log("formValue:" +address);
    await this.state.artBlocks.methods.updateProjectCurrencyInfo(this.props.project, this.state.idValue, address).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
      //this.setState({loadQueue:this.props.project*1000000});

    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "overrideTokenDynamicImageWithIpfsLink"){
    //alert(this.props.project, this.state.idValue, this.state.formValue);
    await this.state.artBlocks.methods.overrideTokenDynamicImageWithIpfsLink(this.state.idValue, this.state.formValue).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
      //this.setState({loadQueue:this.props.project*1000000});

    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  }

  else if (type === "clearTokenIpfsImageUri"){
    //alert(this.props.project, this.state.idValue, this.state.formValue);
    await this.state.artBlocks.methods.clearTokenIpfsImageUri(this.state.idValue).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
      //this.setState({loadQueue:this.props.project*1000000});

    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "useIpfsForStatic"){
    await this.state.artBlocks.methods.toggleProjectUseIpfsForStatic(this.props.project).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "isDynamic"){
    await this.state.artBlocks.methods.toggleProjectIsDynamic(this.props.project).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "toggleActive"){
    alert(this.props.project);
    await this.state.artBlocks.methods.toggleProjectIsActive(this.props.project).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  }
  else if (type === "togglePaused"){
    await this.state.artBlocks.methods.toggleProjectIsPaused(this.props.project).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  }  else if (type === "toggleLocked"){
    await this.state.artBlocks.methods.toggleProjectIsLocked(this.props.project).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "updatePayeeInfo"){
    //alert(this.props.project, this.state.idValue, this.state.formValue);
    await this.state.artBlocks.methods.updateProjectAdditionalPayeeInfo(this.props.project, this.state.formValue, this.state.idValue).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  }
}

  async approve(){
    this.setState({purchase:true});
    await this.state.erc20.methods.approve(this.props.minterAddress, this.state.projectTokenDetails[1]).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.setState({approved:true});
      this.updateValues();
      this.setState({purchase:false});
    })
    .catch(err => {
      //alert(err);
      this.updateValues();
      this.setState({purchase:false});

    });

  }

  async purchase() {

    this.setState({purchase:true});

    if (this.state.purchaseTo){
      if (this.props.web3.utils.isAddress(this.state.purchaseToAddress)){
        alert("You are purchasing a token for another user directly. The NFT will be deposited directly into the Ethereum account that you set. Please reject the transaction if this is not your intention.");
        if (this.props.project<3){
          await this.state.artBlocks.methods.purchaseTo(this.state.purchaseToAddress, this.props.project).send({
            from:this.props.account,
            value:this.state.projectTokenDetails[1]
          })
          .once('receipt', (receipt) => {
            const mintedToken = receipt.events.Mint.returnValues[1];
            console.log("mintedtoken:"+mintedToken);
            //this.updateTokens();
            this.props.handleToggleView("newToken",mintedToken);
          })
          .catch(err => {
            //alert(err);
            this.updateValues();
            this.setState({purchase:false});
          });
        } else {
          await this.props.mainMinter.methods.purchaseTo(this.state.purchaseToAddress, this.props.project).send({
            from:this.props.account,
            value:this.state.currency==='ETH'?this.state.projectTokenDetails[1]:0
          })
          .once('receipt', (receipt) => {
            const mintedToken = parseInt(receipt.events[0].raw.topics[3], 16);
            console.log("mintedtoken:"+mintedToken);
            this.props.handleToggleView("newToken",mintedToken);
          })
          .catch(err => {
            //alert(err);
            this.updateValues();
            this.setState({purchase:false});
          });
        }
      } else {
        alert("This is not a valid Ethereum address.");
        this.setState({purchase:false});
      }
    } else {
    if (this.props.project<3){
      await this.props.artBlocks.methods.purchase(this.props.project).send({
        from:this.props.account,
        value:this.state.projectTokenDetails[1]
      })
      .once('receipt', (receipt) => {
        const mintedToken = receipt.events.Mint.returnValues[1];
        console.log("mintedtoken:"+mintedToken);
        console.log(receipt);
        this.props.handleToggleView("newToken",mintedToken);
      })
      .catch(err => {
        alert(err);
        this.updateValues();
        this.setState({purchase:false});
      });
    } else {
      await this.props.mainMinter.methods.purchase(this.props.project).send({
        from:this.props.account,
        value:this.state.currency==='ETH'?this.state.projectTokenDetails[1]:0
      })
      .once('receipt', (receipt) => {
        const mintedToken = parseInt(receipt.events[0].raw.topics[3], 16);
        console.log("mintedtoken:"+mintedToken);
        console.log(receipt);
        this.props.handleToggleView("newToken",mintedToken);

      })
      .catch(err => {
        //alert(err);
        this.updateValues();
        this.setState({purchase:false});
        this.checkAllowance();
      });
    }
  }
}

  handleNextImage(){
    //console.log('clicked');
    let currentCard = this.state.loadQueue;
    let nextCard = currentCard+1;
    this.setState({loadQueue:nextCard});
  }

  handlePageChange(number){
    this.setState({page:number, loadQueue:this.props.project*1000000+((number-1)*20)});
  }

  render() {
    //console.log(this.props.project);
    //console.log(this.state.projectTokenDetails && this.state.projectTokenDetails);
    //console.log("addr:"+this.state.purchaseToAddress);
    //console.log(JSON.stringify(this.state.scriptJSON));
    //console.log(this.props.project);
    //console.log(this.props.mainMinter);
    //console.log(this.state.currency, this.state.currencyAddress);
    //console.log(this.state.erc20);
    //console.log(this.state.currencyAddress);
    //console.log(this.state.approved);
    //console.log(this.state.erc20);
    //console.log(this.props.account);
    console.log(this.state.idValue);
    console.log(this.state.formValue);



    let active = this.state.page;
    let items = [];
    if (this.state.projectTokens){
      let projectTokens=this.state.projectTokens;
      for (let number = 1; number <= Math.ceil(projectTokens.length/20); number++) {
        items.push(
          <Pagination.Item style={{"minWidth": "3em"}} key={number} onClick={(number!==active)?()=>{this.handlePageChange(number)}:undefined} active={number === active}>
          {number}
          </Pagination.Item>,
        );
      }
    }


const paginationBasic = (
  <Container className="mx-1">
  <div className="text-xs-center">
  <br/>
    <Pagination className="flex-wrap text-left">{items}</Pagination>
    <br />
  </div>
  </Container>
);

    //console.log(this.props.project);

    let scriptCount = this.state.projectScriptDetails && this.state.projectScriptDetails[1];
    //console.log("scriptCount"+scriptCount);
    function returnScriptIds(){
      let scripts=[];
      for (let i=0;i<scriptCount;i++){
      scripts.push(<option key={i}>{i}</option>)
    }
    return(scripts);

    }


    if (this.state.projectTokenDetails && this.state.projectTokenDetails[0]===this.props.account){
      //console.log("Artist Logged In");
    }
    //console.log("interface? "+this.state.artistInterface);
    let baseURL = this.props.baseURL;

    function tokenImage(token){
      return baseURL+'/image/'+token;
    }

    function tokenGenerator(token){
      return baseURL+'/generator/'+token;
    }

    //console.log(this.state.projectScriptDetails && this.state.projectScriptDetails);




    //console.log(queue);
    return (


    <Row className={this.state.projectTokens && this.state.projectTokens.length<10 && !this.state.artistInterface?"align-items-center":""}>
      <Col xs={12} sm={6} md={3}>
        <div >
        <div className="text-align-center">
        <br />
        <br />
        <br />
        {this.state.projectDescription &&
          <div>
          <h1>{this.state.projectDescription[0]}</h1>
          <h3>by {this.state.projectDescription[1]}</h3>
          <a href={this.state.projectDescription[3] && this.state.projectDescription[3]} target="_blank" rel="noopener noreferrer">{this.state.projectDescription[3] && this.state.projectDescription[3]}</a>
          <br/>
          <br/>
          <p>{this.state.projectDescription[2]}</p>
          <br/>
          <p>Total Minted: {this.state.projectTokens && this.state.projectTokens.length} / {this.state.projectTokenDetails && this.state.projectTokenDetails[3]} max</p>

          <p>License: {this.state.projectDescription && this.state.projectDescription[4]}</p>
          <p>Script: {this.state.scriptJSON && this.state.scriptJSON.type}</p>
          </div>
        }

        {this.state.projectTokens && this.state.projectTokenDetails && this.state.projectTokens.length<this.state.projectTokenDetails[3] &&
          <div>
          <p>Price per token: {this.state.projectTokenDetails && this.props.web3.utils.fromWei(this.state.projectTokenDetails[1],'ether')}{this.state.currency && this.state.currency==="ETH"?"Ξ":" "+this.state.currency}</p>


        {!this.props.connected &&
          <div>
          <br />
          <p>Please connect to MetaMask to enable purchases.</p>
          </div>
        }

        {this.props.connected && this.state.projectScriptDetails && this.state.approved &&
          <div>
          {this.state.currency!=="ETH" &&
          <p>{this.state.currency} Balance: {this.state.erc20Balance}</p>
          }
          <Button className='btn-primary btn-block' disabled={this.state.purchase?true:(this.state.projectScriptDetails[5] && this.state.projectTokenDetails[0]!==this.props.account)?true:false} onClick={this.purchase}>{this.state.purchase?<div><Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            />
            <span className="sr-only">Pending...</span> Pending...</div>:this.state.projectScriptDetails[5]?"Purchases Paused":"Purchase"}</Button>
            {this.state.purchaseTo &&
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon3">
                Address:
              </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl onChange={this.handlePurchaseToAddressChange} id="text" aria-describedby="basic-addon3" />
            </InputGroup>
          }
            <div className="text-center">
            <Button variant="link" onClick={this.handlePurchaseTo}>Purchase To Another User</Button>
            </div>

          </div>
          }

          {this.props.connected && this.state.projectScriptDetails && !this.state.approved &&
            <div>
            <Button className='btn-primary btn-block' /*disabled={this.state.purchase?true:(this.state.projectScriptDetails[5] && this.state.projectTokenDetails[0]!==this.props.account)?true:false} */ onClick={this.approve}>{this.state.purchase?<div><Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              />
              <span className="sr-only">Pending...</span> Pending...</div>:"Approve "+this.state.currency+" for Purchasing"}</Button>

            </div>
            }


          </div>
        }


        <br />
        {this.state.projectTokenDetails &&
          <div>
          {(this.props.isWhitelisted || this.state.projectTokenDetails[0]===this.props.account) &&

          <Button onClick={this.handleToggleArtistInterface} className='btn-primary btn-block'>Toggle Artist Interface</Button>
        }
        </div>
        }

        {this.state.projectTokens && this.props.project && this.state.projectTokenDetails && this.state.projectTokens.length===Number(this.state.projectTokenDetails[3]) &&
          <p><b>The max number of iterations/editions for this project have been minted. Please visit the project on <a href={this.getOSLink()} rel="noopener noreferrer" target="_blank">OpenSea</a> to see what is available on the secondary market!</b></p>
        }



        </div>
        </div>
      </Col>

      <Col xs={12} sm={6} md={9}>

      {!this.state.artistInterface &&
        <div>

        <CardDeck>
          {this.state.projectTokens && this.state.projectTokens.map((token,index)=>{
            if (this.state.projectTokens.slice((this.state.page-1)*20,this.state.page*20).includes(token)){
            return (
              <div key={index}>
              <Col>
                <Card border="light" className='mx-auto' style={{ width: '16rem' }} >

                <Card.Body>
                  {this.state.loadQueue<token?<div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                  </div>:<Card.Img variant="top" src={tokenImage(token)} onLoad={this.handleNextImage}/>}
                  <div className="text-center">

                  <ButtonGroup size="sm">
                    <Button variant="light" disabled>#{Number(token)-Number(this.state.project)*1000000}</Button>
                    <Button as={Link} to={'/token/'+token} variant="light" onClick={() => this.props.handleToggleView("viewToken",token)}>Details</Button>
                    <Button variant="light" onClick={()=> window.open(tokenImage(token), "_blank")}>Image</Button>
                    <Button variant="light" onClick={()=> window.open(tokenGenerator(token), "_blank")}>Live</Button>
                  </ButtonGroup>


                  </div>
                </Card.Body>
                </Card>
              </Col>
              </div>
            )} else {
              return null;
            }})
          }
        </CardDeck>
        <Row >
        {paginationBasic}
        </Row>

        <div className="text-center">
        <Button className='btn-light btn-sm' onClick={() => this.props.handleToggleView("gallery",this.state.project)}>Back To Project List</Button>
        </div>
        </div>
      }

      {this.state.artistInterface &&
        <Col>

        <h3>Artist Dashboard</h3>
        <h5>Artist Address: {this.state.projectTokenDetails && this.state.projectTokenDetails[0]}</h5>
        <p>Below you can control your project's representation on the blockchain. <b>Only adjust settings that you are comfortable with. </b></p>
        <p>Please be mindful of <i>which</i> fields that are modifable after a project is locked. Some are and some are not. Once a project is locked it is frozen permanently/immutably so choose wisely.</p>

        <Tabs defaultActiveKey="project" id="uncontrolled-tab-example">


          <Tab eventKey="project" title="Project">

          <div>
          <br/>
            <Form onSubmit={e => this.handleChange(e, "projectName")}>
              <Form.Group>
                <Form.Label><b>Update Project Name</b></Form.Label>
                <Form.Control onChange={this.handleValueChange} type="text" placeholder="Enter Name" />
                <Form.Text className="text-muted">
                  This <b>cannot</b> be changed once project is locked.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <br/>
          </div>

          <div>
            <Form onSubmit={e => this.handleChange(e, "artistName")}>
              <Form.Group>
                <Form.Label><b>Update Artist Name</b></Form.Label>
                <Form.Control onChange={this.handleValueChange} type="text" placeholder="Enter Name" />
                <Form.Text className="text-muted">
                  This <b>cannot</b> be changed once project is locked.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <br/>
          </div>

          <div>
            <Form onSubmit={e => this.handleChange(e, "website")}>
              <Form.Group>
                <Form.Label><b>Update Project Website</b></Form.Label>
                <Form.Control onChange={this.handleValueChange} type="url" placeholder="Enter your website here. Can be Instagram or Twitter link too." />
                <Form.Text className="text-muted">
                  This can be modified after a project is locked.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <br/>
          </div>

          <div>
            <Form onSubmit={e => this.handleChange(e, "description")}>
              <Form.Group>
                <Form.Label><b>Update Project Description</b></Form.Label>
                <Form.Control onChange={this.handleValueChange} as="textarea" rows={3} type="text" placeholder="Enter your project description here. Include any details you would like for people to see about the project." />
                <Form.Text className="text-muted">
                  This can be modified after a project is locked.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <br/>
          </div>

          <div>
            <Form onSubmit={e => this.handleChange(e, "license")}>
              <Form.Group>
                <Form.Label><b>Update License</b></Form.Label>
                <Form.Control onChange={this.handleValueChange} type="text" placeholder="Please specify a license for your content. Example: NIFTY License" />
                <Form.Text className="text-muted">
                  This <b>cannot</b> be changed once project is locked.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <br/>
          </div>

          </Tab>
          <Tab eventKey="token" title="Token">
          <div>
          <br/>
            <Form onSubmit={e => this.handleChange(e, "price")}>
              <Form.Group>
                <Form.Label><b>Update Price per Token</b></Form.Label>
                <Form.Control onChange={this.handleValueChange} type="number" min="0" step="any" placeholder={`Price for each purchase in ${this.state.currency}.`} />
                <Form.Text className="text-muted">
                  This can be modified after a project is locked.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <br/>
          </div>

          <div>
          {this.props.project>=3 &&
          <Form onSubmit={e => this.handleChange(e, "updateProjectCurrencyInfo")}>
            <Form.Group>
              <Form.Label><b>Update Currency Information</b></Form.Label>
              <br />

              <Form.Label>Current Currency: {this.state.currency && this.state.currency}</Form.Label>
              <br />
              <Form.Label>Current Currency Address: {this.state.currencyAddress && this.state.currencyAddress}</Form.Label>
              <br />

              <Form.Label>Currency Symbol:</Form.Label>
              <Form.Control onChange={this.handleIdChange} type="text" placeholder="Specify the symbol for the currency you are using. ETH, DAI, etc." >
              </Form.Control>
              <Form.Label>Currency Address:</Form.Label>
              <Form.Control onChange={this.handleValueChange} type="text" placeholder="Specify the ERC20 Contract Address for selected currency. If ETH leave blank." >
              </Form.Control>

              <Form.Text className="text-muted">
                The above values <b>can</b> be changed once project is locked. Both of these fields are updated in the same function call so make sure you fill both in (or just the currency field if you're setting the currency to ETH.)
              </Form.Text>
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        }
          </div>
          <br/>
          <div>
            <Form onSubmit={e => this.handleChange(e, "maxInvocations")}>
              <Form.Group>
                <Form.Label><b>Update Maximum Invocations</b></Form.Label>
                <Form.Control onChange={this.handleValueChange} type="number" placeholder="The maximum number of iterations that can be purchased. Must be less than 1,000,000." />
                <Form.Text className="text-muted">
                  This <b>cannot</b> be changed once project is locked.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <br/>
          </div>




          </Tab>
          <Tab eventKey="scripts" title="Scripts">

          <div>
          <br/>
            <Form onSubmit={e => this.handleChange(e, "scriptJSON")}>
              <Form.Group>
                <Form.Label><b>Update Script JSON</b></Form.Label>
                <br />
                <Form.Label>The Script JSON provides information for the server to parse the script correctly. It is stored in the contract as a single string. This means you cannot update items individaully. The boxes below are pre-populated with the values currently set for the JSON. If you want to make an update, only modify the boxes you want to change and click "sumbit". Anything left blank will stay blank, any data you don't modify will remain "as is" in the updated script.</Form.Label>
                <br />
                <Form.Label>Current JSON: {this.state.projectScriptDetails && this.state.projectScriptDetails[0]}</Form.Label>
                <br />
                <Form.Label>Script Type:</Form.Label>
                <Form.Control onChange={e => this.handleJSON(e, "type")} value={(this.state.scriptJSON.type && this.state.scriptJSON.type) || ''} as="select" >
                <option>--- Select Script Type ---</option>
                  <option>p5js</option>
                  <option>processing</option>
                  <option>a-frame</option>
                  <option>threejs</option>
                  <option>vox</option>
                  <option>megavox</option>
                  <option>custom</option>
                </Form.Control>
                <Form.Label>Version:</Form.Label>
                <Form.Control onChange={e => this.handleJSON(e, "version")} value={this.state.scriptJSON.version || ''} type="text" placeholder="Specify version number of script, if applicable." >
                </Form.Control>
                <Form.Label>Aspect Ratio (width/height):</Form.Label>
                <Form.Control onChange={e => this.handleJSON(e, "aspectRatio")} type="text" value={this.state.scriptJSON.aspectRatio || ''} placeholder="Required. Specify aspect ratio (width divided by height)." >
                </Form.Control>
                <Form.Label>Instructions:</Form.Label>
                <Form.Control onChange={e => this.handleJSON(e, "instructions")} value={this.state.scriptJSON.instructions || ''} as="textarea" rows={3} type="text" placeholder="Use this space to give user interactivity instructions if appropriate. Separate each instruction with a '|' (pipe)" >
                </Form.Control>
                <Form.Label>Animation Length in Seconds:</Form.Label>
                <Form.Control onChange={e => this.handleJSON(e, "animationLengthInSeconds")} value={this.state.scriptJSON.animationLengthInSeconds || ''} type="number" placeholder="Set length of animation for non-static outputs. Leave blank if static." >
                </Form.Control>
                <Form.Label>Interactive?</Form.Label>
                <Form.Control onChange={e => this.handleJSON(e, "interactive")} value={this.state.scriptJSON.interactive || ''} type="text" placeholder="If your project can be interacted with set to true, otherwise leave blank." >
                </Form.Control>
                <Form.Text className="text-muted">
                  The above values <b>cannot</b> be changed once project is locked.
                </Form.Text>
              </Form.Group>

              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <br/>
          </div>


          <div>
            <Form onSubmit={e => this.handleChange(e, "addScript")}>
              <Form.Group>
                <Form.Label><b>Add Project Script</b></Form.Label>
                <Form.Control onChange={this.handleValueChange} as="textarea" rows={3} type="text" placeholder="Enter your script here." />
                <Form.Text className="text-muted">
                  This <b>cannot</b> be changed once project is locked. Visit <a target="_blank" rel="noopener noreferrer" href={this.props.baseURL+"/project/"+this.state.project}>project dashboard </a>to see full script.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <br/>
          </div>

          <div>
            <Form onSubmit={e => this.handleChange(e, "updateScript")}>
              <Form.Group>
                <Form.Label><b>Update Project Script</b></Form.Label>
                <Form.Control onChange={this.handleValueChange} as="textarea" rows={3} type="text" placeholder="Enter your update here and select which scriptId you are updating below." />
                <Form.Text className="text-muted">
                  This <b>cannot</b> be changed once project is locked. Visit <a target="_blank" rel="noopener noreferrer" href={this.props.baseURL+"/project/"+this.state.project}>project dashboard </a>to see full script.
                </Form.Text>
              </Form.Group>
              <Form.Group>
                <Form.Label>Script Id</Form.Label>
                <Form.Control onChange={this.handleIdChange} as="select" >
                <option>--- Select Script Id to Update ---</option>
                  {returnScriptIds()}
                </Form.Control>
              </Form.Group>

              <Button variant="primary" type="submit">
                Submit
              </Button>
              <Button variant="primary mx-1" onClick={e => this.handleChange(e, "removeLastScript")}>
                Remove Last Script
              </Button>
            </Form>
            <br/>
          </div>
          <br/>
          <div>
            <Form>
              <Form.Group>
                <Form.Label><b>Use Hashes?</b></Form.Label>
                <br/>
                <Button variant="primary mx-1" onClick={e => this.handleChange(e, "hashesPerToken")}>
                  {this.state.projectScriptDetails && this.state.projectScriptDetails[2]?"Project is uses/stores a token hash. Click to set it to remove.":"Project does not use a token hash. Click to add."}
                </Button>

                <Button variant="primary mx-1" onClick={e => this.handleChange(e, "isDynamic")}>
                  {this.state.projectDescription && this.state.projectDescription[5]?"Project is dynamic. Click to set it to static.":"Project is static. Click to set it to dynamic."}
                </Button>
                <Form.Text className="text-muted">

                  This <b>cannot</b> be changed once project is locked or once a purchase has been made.
                </Form.Text>
              </Form.Group>


            </Form>
            <br/>
          </div>
          <div>

          </div>
          <br/>

          <div>
            <Form onSubmit={e => this.handleChange(e, "updateProjectIpfsHash")}>
              <Form.Group>
                <Form.Label><b>Update Project IPFS Hash</b></Form.Label>
                <br/>
                <Form.Label>Currently: {this.state.projectScriptDetails && this.state.projectScriptDetails[3]}</Form.Label>
                <Form.Control onChange={this.handleValueChange} type="text" placeholder="Enter asset IPFS hash." />
                <Form.Text className="text-muted">
                  This <b>cannot</b> be modified after a project is locked. Mostly used for static (non script based) projects with assets stored on IPFS.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
              <Button variant="primary mx-1" onClick={e => this.handleChange(e, "useIpfsForStatic")}>
                {this.state.projectURIInfo && this.state.projectURIInfo[2]?"Using IPFS URI for Static Images. Click to use a BaseURI.":"Using custom URI for static images. Click to use IPFS."}
              </Button>
            </Form>
            <br/>
          </div>

          </Tab>
          <Tab eventKey="royalties" title="Royalties/Payees" >
          <div>
          <br />
            <Form onSubmit={e => this.handleChange(e, "updatePayeeInfo")}>
              <Form.Group>
                <Form.Label><b>Update Additional Payee Info</b></Form.Label>
                <br/>
                <Form.Label>Current Payee: {this.state.projectTokenDetails && this.state.projectTokenDetails[5]}</Form.Label>
                <br/>
                <Form.Label>Current Percentage: {this.state.projectTokenDetails && this.state.projectTokenDetails[6]}%</Form.Label>
                <br/>
                <br/>

                <Form.Label><b>Update Additional Payee Address:</b></Form.Label>
                <Form.Control onChange={this.handleValueChange} type="text"  placeholder="Enter payee address." />
                <Form.Text className="text-muted">
                  <b>This address will receive proceeds of each purchase based on the percentage specified below. Can be changed after project is locked.</b>
                </Form.Text>
                <Form.Label><b>Update Additional Payee Percentage:</b></Form.Label>
                <Form.Control onChange={this.handleIdChange} type="number"  placeholder="Enter whole number for percentage of funds to go to additional payee." />
                <Form.Text className="text-muted">
                  This represents the percentage of net funds after subtracting Art Blocks percentage.
                </Form.Text>
                <Form.Text className="text-muted">
                  The above data are combined into a single function therefore both most be populated even if you're only modifying one of them. Make sure both fields are filled in before submitting.
                </Form.Text>

              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <br/>
          </div>

          <div>
            <Form onSubmit={e => this.handleChange(e, "updateSecondaryMarketRoyaltyPercentage")}>
              <Form.Group>
                <Form.Label><b>Update Secondary Market Royalty</b></Form.Label>
                <br/>
                <Form.Label>Currently: {this.state.projectRoyaltyInfo && this.state.projectRoyaltyInfo[3]}%</Form.Label>
                <Form.Control onChange={this.handleValueChange} type="number" placeholder="Enter whole number for percentage for your desired secondary market royalty." />
                <Form.Text className="text-muted">
                  Note this is not guaranteed. A platform must be willing to implement this feature specifically. This can be modified after a project is locked.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <br/>
          </div>
          </Tab>
          <Tab eventKey="uri" title="URI" >

          <div>
          <br />
            <Form onSubmit={e => this.handleChange(e, "updateProjectBaseURI")}>
              <Form.Group>
                <Form.Label><b>Update Project BaseURI</b></Form.Label>
                <br/>
                <Form.Label>Current setting: {this.state.projectURIInfo[0]}</Form.Label>
                <Form.Control onChange={this.handleValueChange} type="url" placeholder="Enter base URI here. The URI serves the token JSON which points to the token image and other metadata." />
                <Form.Text className="text-muted">
                  This can be modified after a project is locked. Modifying this will change where the metadata for each project is retreived.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <br/>
          </div>

          <div>
            <Form onSubmit={e => this.handleChange(e, "updateProjectBaseIpfsURI")}>
              <Form.Group>
                <Form.Label><b>Update Project BaseIPFS URI</b></Form.Label>
                <br />
                <Form.Label>Current setting: {this.state.projectURIInfo[1]}</Form.Label>
                <Form.Control onChange={this.handleValueChange} type="url" placeholder="Enter desired base IPFS URI." />
                <Form.Text className="text-muted">
                  This can be modified after a project is locked. Modifying this will change where the metadata for each project is retreived when stored on IPFS.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <br/>
            </div>

            <div>
              <Form onSubmit={e => this.handleChange(e, "overrideTokenDynamicImageWithIpfsLink")}>
                <Form.Group>
                  <Form.Label><b>Override Token Dynamic Image with IPFS</b></Form.Label>
                  <Form.Control onChange={this.handleValueChange} type="text" placeholder="Enter token IPFS hash." />
                </Form.Group>
                <Form.Group>
                  <Form.Control onChange={this.handleIdChange} type="number" placeholder="Enter tokenId" >
                  </Form.Control>
                </Form.Group>
                <Form.Text className="text-muted">
                  This can be modified after a project is locked.
                </Form.Text>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
                <Button variant="primary mx-1" onClick={e => this.handleChange(e, "clearTokenIpfsImageUri")}>
                  Clear Token IPFS URI
                </Button>
              </Form>
              <br/>
              </div>




            <br/>


          </Tab>
          <Tab eventKey="danger" title="Danger">

          <div>
          <br />
            <Form onSubmit={e => this.handleChange(e, "updateArtistAddress")}>
              <Form.Group>
                <Form.Label><b>Update Artist Address</b></Form.Label>
                <Form.Control onChange={this.handleValueChange} type="text" placeholder="Enter new artist address" />
                <Form.Text className="text-muted">
                  <b>Caution! Once you change the artist address control of the project will immediately be transferred to the new address!</b>
                </Form.Text>
              </Form.Group>
              <Button variant="danger" type="submit">
                Submit
              </Button>
            </Form>
            <br/>
            {this.state.projectTokenDetails && this.state.projectTokenDetails[0]===this.props.account &&
            <Button variant="danger mx-1 btn-block" onClick={e => this.handleChange(e, "togglePaused")}>
              {this.state.projectScriptDetails && this.state.projectScriptDetails[5]?"This project is paused. Click here to unpause.":"Click to pause project."}
            </Button>
            }

            <br/>
          </div>

          {this.props.isWhitelisted &&
            <div>
          <Button variant="danger mx-1 btn-block" onClick={e => this.handleChange(e, "toggleActive")}>
            {this.state.projectTokenDetails && this.state.projectTokenDetails[4]?"This project is active. Click here to deactivate.":"Click to activate project."}
          </Button>
          <Button variant="danger mx-1 btn-block" onClick={e => this.handleChange(e, "toggleLocked")}>
            {this.state.projectScriptDetails && !this.state.projectScriptDetails[4]?"This project is unlocked. Click here to lock it (permanently).":"Project is permanently locked."}
          </Button>
          </div>
        }

          </Tab>

        </Tabs>

        </Col>


      }
      </Col>
    </Row>
    );
  }
}

export default Project;
