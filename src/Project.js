import React, { Component } from "react";
import {
  Card,
  Button,
  CardDeck,
  Spinner,
  Col,
  Row,
  Form,
  Tabs,
  Tab,
  ButtonGroup,
  Pagination,
  Container,
  InputGroup,
  FormControl,
  Image,
  Alert,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import {
  Link,
  matchPath,
  Redirect,
  Route,
  Switch,
  withRouter,
} from "react-router-dom";
import { ERC20_ABI } from "./config";
import LatestToken from "./LatestToken";
import TokenGallery from "./TokenGallery";
import "./Project.css";
import ArtistInterface from "./ArtistInterface";
//import {TwitterShareButton} from 'react-twitter-embed';

class Project extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      tokenURIInfo: "",
      purchase: false,
      ineraction: false,
      project: this.props.project,
      artistInterface: false,
      scriptJSON: {},
      purchaseTo: false,
      purchaseToAddress: "",
      currency: "",
      currencyAddress: "",
      erc20: "",
      approved: true,
      erc20Balance: "",
      randomTokenNumber: 0,
    };
    this.handleToggleArtistInterface = this.handleToggleArtistInterface.bind(
      this
    );
    this.purchase = this.purchase.bind(this);
    this.handleJSON = this.handleJSON.bind(this);
    this.handlePurchaseTo = this.handlePurchaseTo.bind(this);
    this.handlePurchaseToAddressChange = this.handlePurchaseToAddressChange.bind(
      this
    );
    this.approve = this.approve.bind(this);
    this.updateProjectTokenDetails = this.updateProjectTokenDetails.bind(this);
    this.updateValues = this.updateValues.bind(this);
  }

  async componentDidMount() {
    const artBlocks =
      this.props.project < 3 ? this.props.artBlocks : this.props.artBlocks2;
    const projectTokens = await artBlocks.methods
      .projectShowAllTokens(this.props.project)
      .call();
    const projectDescription = await artBlocks.methods
      .projectDetails(this.props.project)
      .call();
    const projectTokenDetails = await artBlocks.methods
      .projectTokenInfo(this.props.project)
      .call();
    const projectScriptDetails = await artBlocks.methods
      .projectScriptInfo(this.props.project)
      .call();
    const projectURIInfo = await artBlocks.methods
      .projectURIInfo(this.props.project)
      .call();
    const projectRoyaltyInfo = await artBlocks.methods
      .getRoyaltyData(this.props.project)
      .call();
    if (this.props.project >= 3) {
      let currency = await artBlocks.methods
        .projectIdToCurrencySymbol(this.props.project)
        .call();
      let currencyAddress = await artBlocks.methods
        .projectIdToCurrencyAddress(this.props.project)
        .call();
      if (currency !== "ETH") {
        let erc20 = new this.props.web3.eth.Contract(
          ERC20_ABI,
          currencyAddress
        );
        if (this.props.connected) {
          let balance = await erc20.methods
            .balanceOf(this.props.account)
            .call();
          let erc20Balance = this.props.web3.utils.fromWei(balance, "ether");
          //let erc20Balance = await erc20.methods.balanceOf(this.props.account).call();
          this.setState({ erc20Balance });
        }
        this.setState({ erc20 });
      }
      this.setState({ currency, currencyAddress });
      if (this.props.connected && this.state.currency !== "ETH") {
        setTimeout((x) => {
          this.checkAllowance();
        }, 500);
      }
    } else {
      this.setState({ currency: "ETH" });
    }
    let scriptJSON =
      projectScriptDetails[0] && JSON.parse(projectScriptDetails[0]);
    console.log("still setting state");
    this.setState({
      artBlocks,
      projectTokens,
      projectDescription,
      projectTokenDetails,
      projectScriptDetails,
      scriptJSON,
      projectURIInfo,
      projectRoyaltyInfo /*, network*/,
      randomTokenNumber: projectTokens
        ? Math.floor(Math.random() * projectTokens.length)
        : 0,
    });
    //setInterval(this.updateProjectTokenDetails,5000);
  }

  async updateProjectTokenDetails(state) {
    //console.log("update!!!");
    //console.log(this.state);
    const projectTokenDetails = await this.state.artBlocks.methods
      .projectTokenInfo(this.props.project)
      .call();
    this.setState({ projectTokenDetails });
  }

  async checkAllowance() {
    if (this.props.connected && this.state.projectTokenDetails) {
      var BN = this.props.web3.utils.BN;
      //let valToApprove = new BN(this.state.projectTokenDetails[1]).mul(new BN('10')).toString();
      //console.log(valToApprove);
      let allowance = await this.state.erc20.methods
        .allowance(this.props.account, this.props.minterAddress)
        .call();
      let bnAllowance = new BN(allowance);
      let bnPrice = new BN(this.state.projectTokenDetails[1]);
      console.log(allowance);
      console.log("BnA" + bnAllowance, "BnP" + bnPrice);

      //if (allowance >= this.state.projectTokenDetails[1]){
      if (bnAllowance.gte(bnPrice)) {
        this.setState({ approved: true });
        console.log("setting approved to true");
      } else {
        this.setState({ approved: false });
        console.log("setting approved to false");
      }
    }
  }

  async checkBalance() {
    let balanceRaw = await this.state.erc20.methods
      .balanceOf(this.props.account)
      .call();
    let balance = this.props.web3.utils.fromWei(balanceRaw, "ether");
    console.log(balance);
    this.setState({ erc20Balance: balance });
  }

  async componentDidUpdate(oldProps) {
    if (oldProps.project !== this.props.project) {
      console.log("change");

      const artBlocks =
        this.props.project < 3 ? this.props.artBlocks : this.props.artBlocks2;
      const projectTokens = await artBlocks.methods
        .projectShowAllTokens(this.props.project)
        .call();
      const projectDescription = await artBlocks.methods
        .projectDetails(this.props.project)
        .call();
      const projectTokenDetails = await artBlocks.methods
        .projectTokenInfo(this.props.project)
        .call();
      const projectScriptDetails = await artBlocks.methods
        .projectScriptInfo(this.props.project)
        .call();
      const projectURIInfo = await artBlocks.methods
        .projectURIInfo(this.props.project)
        .call();
      const projectRoyaltyInfo = await artBlocks.methods
        .getRoyaltyData(this.props.project)
        .call();
      if (this.props.project >= 3) {
        let currency = await artBlocks.methods
          .projectIdToCurrencySymbol(this.props.project)
          .call();
        let currencyAddress = await artBlocks.methods
          .projectIdToCurrencyAddress(this.props.project)
          .call();
        if (currency !== "ETH") {
          let erc20 = new this.props.web3.eth.Contract(
            ERC20_ABI,
            currencyAddress
          );
          if (this.props.connected) {
            if (this.props.connected) {
              setTimeout((x) => {
                this.checkBalance();
              }, 500);
            }
          }
          this.setState({ erc20 });
        }
        this.setState({ currency, currencyAddress });
        if (this.state.currency !== "ETH") {
          setTimeout((x) => {
            this.checkAllowance();
          }, 500);
        }
      } else {
        this.setState({ currency: "ETH" });
      }

      let scriptJSON =
        projectScriptDetails[0] && JSON.parse(projectScriptDetails[0]);
      this.setState({
        loadQueue: this.props.project * 1000000 + (this.props.page - 1) * 20,
        projectTokens,
        projectDescription,
        projectTokenDetails,
        projectScriptDetails,
        scriptJSON,
        projectURIInfo,
        projectRoyaltyInfo,
        project: this.props.project,
        approved: true,
        randomTokenNumber: projectTokens
          ? Math.floor(Math.random() * projectTokens.length)
          : 0,
      });
    } else if (oldProps.artBlocks !== this.props.artBlocks) {
      console.log("change artBlocks?");
      const artBlocks =
        this.props.project < 3 ? this.props.artBlocks : this.props.artBlocks2;
      if (this.props.project >= 3) {
        let currency = await artBlocks.methods
          .projectIdToCurrencySymbol(this.props.project)
          .call();
        let currencyAddress = await artBlocks.methods
          .projectIdToCurrencyAddress(this.props.project)
          .call();
        if (currency !== "ETH") {
          let erc20 = new this.props.web3.eth.Contract(
            ERC20_ABI,
            currencyAddress
          );
          if (this.props.connected) {
            setTimeout((x) => {
              this.checkBalance();
            }, 500);
          }
          this.setState({ erc20 });
        }
        this.setState({ currency, currencyAddress });
        if (this.state.currency !== "ETH") {
          setTimeout((x) => {
            this.checkAllowance();
          }, 500);
        }
      } else {
        this.setState({ currency: "ETH" });
      }
      this.setState({ artBlocks });
    }

    if (oldProps.connected !== this.props.connected) {
      console.log("change connected");
      const artBlocks =
        this.props.project < 3 ? this.props.artBlocks : this.props.artBlocks2;
      if (this.props.project >= 3) {
        let currency = await this.state.artBlocks.methods
          .projectIdToCurrencySymbol(this.props.project)
          .call();
        let currencyAddress = await this.state.artBlocks.methods
          .projectIdToCurrencyAddress(this.props.project)
          .call();
        if (currency !== "ETH") {
          let erc20 = new this.props.web3.eth.Contract(
            ERC20_ABI,
            currencyAddress
          );
          if (this.props.connected) {
            if (this.props.connected) {
              setTimeout((x) => {
                this.checkBalance();
              }, 500);
            }
          }
          this.setState({ erc20 });
        }
        this.setState({ currency, currencyAddress });
      } else {
        this.setState({ currency: "ETH" });
      }

      if (this.props.project >= 3) {
        if (this.state.currency !== "ETH") {
          setTimeout((x) => {
            this.checkAllowance();
          }, 500);
        }
      }
      this.setState({ artBlocks });
    }
  }

  async updateValues() {
    const artBlocks =
      this.props.project < 3 ? this.props.artBlocks : this.props.artBlocks2;
    const projectTokens = await artBlocks.methods
      .projectShowAllTokens(this.props.project)
      .call();
    const projectDescription = await artBlocks.methods
      .projectDetails(this.props.project)
      .call();
    const projectTokenDetails = await artBlocks.methods
      .projectTokenInfo(this.props.project)
      .call();
    const projectScriptDetails = await artBlocks.methods
      .projectScriptInfo(this.props.project)
      .call();
    const projectURIInfo = await artBlocks.methods
      .projectURIInfo(this.props.project)
      .call();
    const projectRoyaltyInfo = await artBlocks.methods
      .getRoyaltyData(this.props.project)
      .call();
    if (this.props.project >= 3 && this.state.currency !== "ETH") {
      if (this.props.connected) {
        let balance = await this.state.erc20.methods
          .balanceOf(this.props.account)
          .call();
        let erc20Balance = this.props.web3.utils.fromWei(balance, "ether");
        this.setState({ erc20Balance });
      }
      console.log("updated values");
      this.checkAllowance();
    } else {
      this.setState({ currency: "ETH" });
    }
    this.setState({
      projectDescription,
      projectTokenDetails,
      projectScriptDetails,
      projectURIInfo,
      projectRoyaltyInfo,
      projectTokens,
      project: this.props.project,
      approved: true,
    });
  }
  getOSLink() {
    if (this.props.project && this.props.project === "0") {
      return "https://opensea.io/assets/art-blocks?search[sortAscending]=true&search[sortBy]=PRICE&search[stringTraits][0][name]=Project&search[stringTraits][0][values][0]=Chromie%20Squiggle%20by%20Snowfro";
    } else if (this.props.project && this.props.project === "1") {
      //console.log("osp1");
      return "https://opensea.io/assets/art-blocks?search[sortAscending]=true&search[sortBy]=PRICE&search[stringTraits][0][name]=Project&search[stringTraits][0][values][0]=Genesis%20by%20DCA";
    } else if (this.props.project && this.props.project === "2") {
      //console.log("osp2");
      return "https://opensea.io/assets/art-blocks?search[sortAscending]=true&search[sortBy]=PRICE&search[stringTraits][0][name]=Project&search[stringTraits][0][values][0]=Construction%20Token%20by%20Jeff%20Davis";
    } else if (this.props.project && this.props.project === "3") {
      return "https://opensea.io/assets/art-blocks?search[sortAscending]=true&search[sortBy]=PRICE&search[stringTraits][0][name]=Project&search[stringTraits][0][values][0]=Cryptoblots%20by%20Da%C3%AFm%20Aggott-H%C3%B6nsch";
    } else if (this.props.project && this.props.project === "4") {
      return "https://opensea.io/assets/art-blocks?search[sortAscending]=true&search[sortBy]=PRICE&search[stringTraits][0][name]=Project&search[stringTraits][0][values][0]=Dynamic%20Slices%20by%20pxlq";
    } else if (this.props.project && this.props.project === "5") {
      return "https://opensea.io/assets/art-blocks?search[sortAscending]=true&search[sortBy]=PRICE&search[stringTraits][0][name]=Project&search[stringTraits][0][values][0]=Variant%20Plan%20by%20Jeff%20Davis";
    } else if (this.props.project && this.props.project === "7") {
      return "https://opensea.io/assets/art-blocks?search[sortAscending]=true&search[sortBy]=PRICE&search[stringTraits][0][name]=Project&search[stringTraits][0][values][0]=Elevated%20Deconstructions%20by%20luxpris";
    } else if (this.props.project && this.props.project === "8") {
      return "https://opensea.io/assets/art-blocks?search[sortAscending]=true&search[sortBy]=PRICE&search[stringTraits][0][name]=Project&search[stringTraits][0][values][0]=Singularity%20by%20Hideki%20Tsukamoto";
    } else if (this.props.project && this.props.project === "9") {
      return "https://opensea.io/assets/art-blocks?search[sortAscending]=true&search[sortBy]=PRICE&search[stringTraits][0][name]=Project&search[stringTraits][0][values][0]=Ignition%20by%20ge1doot";
    } else if (this.props.project && this.props.project === "10") {
      return "https://opensea.io/assets/art-blocks?search[sortAscending]=false&search[sortBy]=LISTING_DATE&search[stringTraits][0][name]=Project&search[stringTraits][0][values][0]=NimBuds%20by%20Bryan%20Brinkman";
    } else if (this.props.project && this.props.project === "11") {
      return "https://opensea.io/assets/art-blocks?search[sortAscending]=false&search[sortBy]=LISTING_DATE&search[stringTraits][0][name]=Project&search[stringTraits][0][values][0]=HyperHash%20by%20Beervangeer";
    } else {
      return "";
    }
  }

  handleToggleArtistInterface() {
    this.setState({ artistInterface: !this.state.artistInterface });
  }

  handlePurchaseToAddressChange(event) {
    this.setState({ purchaseToAddress: event.target.value });
  }

  handlePurchaseTo() {
    let purchaseToState = this.state.purchaseTo;
    this.setState({ purchaseTo: !purchaseToState });
  }

  handleJSON(event, field) {
    if (event.target.value) {
      let json = this.state.scriptJSON ? this.state.scriptJSON : {};
      json[field] = event.target.value;
      this.setState({ scriptJSON: json });
    } else {
      let json = this.state.scriptJSON;
      delete json[field];
      this.setState({ scriptJSON: json });
    }
  }

  async approve() {
    var BN = this.props.web3.utils.BN;
    this.setState({ purchase: true });
    let valToApprove = new BN(this.state.projectTokenDetails[1])
      .mul(new BN("10"))
      .toString();
    console.log(valToApprove);
    //console.log(BN(this.state.projectTokenDetails[1]).toString());
    await this.state.erc20.methods
      .approve(this.props.minterAddress, valToApprove)
      .send({
        from: this.props.account,
      })
      .once("receipt", (receipt) => {
        console.log(receipt);
        this.setState({ approved: true });
        this.updateValues();
        this.setState({ purchase: false });
      })
      .catch((err) => {
        //alert(err);
        this.updateValues();
        this.setState({ purchase: false });
      });
  }

  async purchase() {
    this.setState({ purchase: true });

    if (this.state.purchaseTo) {
      if (this.props.web3.utils.isAddress(this.state.purchaseToAddress)) {
        alert(
          "You are purchasing a token for another user directly. The NFT will be deposited directly into the Ethereum account that you set. Please reject the transaction if this is not your intention."
        );
        if (this.props.project < 3) {
          await this.state.artBlocks.methods
            .purchaseTo(this.state.purchaseToAddress, this.props.project)
            .send({
              from: this.props.account,
              value: this.state.projectTokenDetails[1],
            })
            .once("receipt", (receipt) => {
              const mintedToken = receipt.events.Mint.returnValues[1];
              console.log("mintedtoken:" + mintedToken);
              //this.updateTokens();
              this.props.handleToggleView("newToken", mintedToken);
            })
            .catch((err) => {
              //alert(err);
              this.updateValues();
              this.setState({ purchase: false });
            });
        } else {
          await this.props.mainMinter.methods
            .purchaseTo(this.state.purchaseToAddress, this.props.project)
            .send({
              from: this.props.account,
              value:
                this.state.currency === "ETH"
                  ? this.state.projectTokenDetails[1]
                  : 0,
            })
            .once("receipt", (receipt) => {
              const mintedToken = parseInt(receipt.events[0].raw.topics[3], 16);
              console.log("mintedtoken:" + mintedToken);
              this.props.handleToggleView("newToken", mintedToken);
            })
            .catch((err) => {
              //alert(err);
              this.updateValues();
              this.setState({ purchase: false });
            });
        }
      } else {
        alert("This is not a valid Ethereum address.");
        this.setState({ purchase: false });
      }
    } else {
      if (this.props.project < 3) {
        await this.props.artBlocks.methods
          .purchase(this.props.project)
          .send({
            from: this.props.account,
            value: this.state.projectTokenDetails[1],
          })
          .once("receipt", (receipt) => {
            const mintedToken = receipt.events.Mint.returnValues[1];
            console.log("mintedtoken:" + mintedToken);
            console.log(receipt);
            this.props.handleToggleView("newToken", mintedToken);
          })
          .catch((err) => {
            //alert(err);
            this.updateValues();
            this.setState({ purchase: false });
          });
      } else {
        await this.props.mainMinter.methods
          .purchase(this.props.project)
          .send({
            from: this.props.account,
            value:
              this.state.currency === "ETH"
                ? this.state.projectTokenDetails[1]
                : 0,
          })
          .once("receipt", (receipt) => {
            const mintedToken = parseInt(receipt.events[0].raw.topics[3], 16);
            console.log("mintedtoken:" + mintedToken);
            console.log(receipt);
            this.props.handleToggleView("newToken", mintedToken);
          })
          .catch((err) => {
            //alert(err);
            this.updateValues();
            this.setState({ purchase: false });
            this.checkAllowance();
          });
      }
    }
  }

  render() {
    let complete =
      this.state.projectTokens &&
      this.props.project &&
      this.state.projectTokenDetails &&
      this.state.projectTokens.length ===
        Number(this.state.projectTokenDetails[3]);

    const latestTokenNumber = this.state.projectTokenDetails
      ? Number(this.state.projectTokenDetails[2]) - 1
      : null;

    const approveDaiToolTip = (props) => (
      <Tooltip id="button-tooltip" {...props}>
        In an effort to conserve gas this button approves enough tokens to
        purchase up to 10 iterations.
      </Tooltip>
    );

    const galleryMatch = matchPath(this.props.location.pathname, {
      path: `${this.props.match.path}/gallery`,
    });

    const artistMatch = matchPath(this.props.location.pathname, {
      path: `${this.props.match.path}/artist`,
    });

    let currentSubroute = "latest";
    if (galleryMatch) {
      currentSubroute = "gallery";
    } else if (artistMatch) {
      currentSubroute = "artist";
    }

    const userIsArtist =
      this.state.projectTokenDetails &&
      this.state.projectTokenDetails[0] === this.props.account;

    return (
      <div>
        {this.props.network === "rinkeby" && (
          <Alert variant="danger">
            You are on the Rinkeby Testnet version of the Art Blocks platform.
            Make sure your Metamask wallet is set to Rinkeby before confirming
            any transactions.
          </Alert>
        )}

        <Row
          className={
            currentSubroute === "latest" ||
            (this.state.projectTokens && this.state.projectTokens.length) < 10
              ? "align-items-center"
              : ""
          }
        >
          <Col xs={12} sm={6} md={3}>
            <div>
              <div className="text-align-center">
                <br />
                <br />
                <br />
                {this.state.projectDescription && (
                  <div>
                    <h1>{this.state.projectDescription[0]}</h1>
                    <h3>by {this.state.projectDescription[1]}</h3>
                    <a
                      href={
                        this.state.projectDescription[3] &&
                        this.state.projectDescription[3]
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {this.state.projectDescription[3] &&
                        this.state.projectDescription[3]}
                    </a>
                    <br />
                    <br />
                    <p>{this.state.projectDescription[2]}</p>
                    <br />
                    <p>
                      Total Minted:{" "}
                      {this.state.projectTokenDetails &&
                        this.state.projectTokenDetails[2]}{" "}
                      /{" "}
                      {this.state.projectTokenDetails &&
                        this.state.projectTokenDetails[3]}{" "}
                      max
                    </p>

                    <p>
                      License:{" "}
                      {this.state.projectDescription &&
                        this.state.projectDescription[4]}
                    </p>
                    <p>
                      Script:{" "}
                      {this.state.scriptJSON && this.state.scriptJSON.type}
                    </p>
                  </div>
                )}

                {this.state.projectTokens &&
                  this.state.projectTokenDetails &&
                  !complete && (
                    <div>
                      <p>
                        Price per token:{" "}
                        {this.state.projectTokenDetails &&
                          this.props.web3.utils.fromWei(
                            this.state.projectTokenDetails[1],
                            "ether"
                          )}
                        {this.state.currency && this.state.currency === "ETH"
                          ? "Ξ"
                          : " " + this.state.currency}
                      </p>

                      {currentSubroute === "latest" ? (
                        <div>
                          <Alert style={{ width: "100%" }} variant="secondary">
                            <p>Showing the latest mint.</p>
                            <Button
                              variant="light"
                              block
                              to={this.props.match.url + "/gallery"}
                              as={Link}
                            >
                              View All
                            </Button>
                          </Alert>
                        </div>
                      ) : null}

                      {!this.props.connected && (
                        <div>
                          <br />
                          <p>Please connect to MetaMask to enable purchases.</p>
                        </div>
                      )}

                      {this.props.connected &&
                        this.state.projectScriptDetails &&
                        this.state.approved && (
                          <div>
                            {this.state.currency !== "ETH" && (
                              <p>
                                {this.state.currency} Balance:{" "}
                                {this.state.erc20Balance}
                              </p>
                            )}
                            <Button
                              className="btn-primary btn-block"
                              disabled={
                                this.state.purchase
                                  ? true
                                  : this.state.projectScriptDetails[5] &&
                                    this.state.projectTokenDetails[0] !==
                                      this.props.account
                                  ? true
                                  : false
                              }
                              onClick={this.purchase}
                            >
                              {this.state.purchase ? (
                                <div>
                                  <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                  />
                                  <span className="sr-only">Pending...</span>{" "}
                                  Pending...
                                </div>
                              ) : this.state.projectScriptDetails[5] ? (
                                "Purchases Paused"
                              ) : (
                                "Purchase"
                              )}
                            </Button>
                            {this.state.purchaseTo && (
                              <InputGroup className="mb-3">
                                <InputGroup.Prepend>
                                  <InputGroup.Text id="basic-addon3">
                                    Address:
                                  </InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                  onChange={this.handlePurchaseToAddressChange}
                                  id="text"
                                  aria-describedby="basic-addon3"
                                />
                              </InputGroup>
                            )}
                            <div className="text-center">
                              <Button
                                variant="link"
                                onClick={this.handlePurchaseTo}
                              >
                                Purchase To Another User
                              </Button>
                            </div>
                          </div>
                        )}

                      {this.props.connected &&
                        this.state.projectScriptDetails &&
                        !this.state.approved && (
                          <div>
                            <OverlayTrigger
                              placement="top"
                              delay={{ show: 250, hide: 400 }}
                              overlay={approveDaiToolTip}
                            >
                              <Button
                                className="btn-primary btn-block"
                                /*disabled={this.state.purchase?true:(this.state.projectScriptDetails[5] && this.state.projectTokenDetails[0]!==this.props.account)?true:false} */ onClick={
                                  this.approve
                                }
                              >
                                {this.state.purchase ? (
                                  <div>
                                    <Spinner
                                      as="span"
                                      animation="border"
                                      size="sm"
                                      role="status"
                                      aria-hidden="true"
                                    />
                                    <span className="sr-only">Pending...</span>{" "}
                                    Pending...
                                  </div>
                                ) : (
                                  "Approve " +
                                  this.state.currency +
                                  " for Purchasing"
                                )}
                              </Button>
                            </OverlayTrigger>
                          </div>
                        )}
                    </div>
                  )}

                <br />
                {this.state.projectTokenDetails && (
                  <div>
                    {this.props.isWhitelisted || userIsArtist ? (
                      <Button
                        onClick={async () => {
                          if (currentSubroute !== "artist") {
                            await this.props.handleConnectToMetamask();
                          }

                          this.props.history.push(
                            currentSubroute === "artist"
                              ? this.props.match.url
                              : this.props.match.url + "/artist"
                          );
                        }}
                        className="btn-primary btn-block"
                      >
                        Toggle Artist Interface
                      </Button>
                    ) : null}
                  </div>
                )}

                {this.state.projectTokens &&
                  this.props.project &&
                  this.state.projectTokenDetails &&
                  this.state.projectTokens.length ===
                    Number(this.state.projectTokenDetails[3]) && (
                    <div>
                      {currentSubroute === "latest" ? (
                        <div>
                          <Alert variant="secondary">
                            <p>
                              Showing random token [#
                              {this.state.randomTokenNumber - 1}].
                            </p>
                            <Button
                              variant="light"
                              block
                              as={Link}
                              to={this.props.match.url + "/gallery"}
                            >
                              View Entire Gallery
                            </Button>
                          </Alert>
                        </div>
                      ) : null}
                      <p>
                        <b>
                          The max number of iterations/editions for this project
                          have been minted. Please visit the project on{" "}
                          <a
                            href={this.getOSLink()}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            OpenSea
                          </a>{" "}
                          to see what is available on the secondary market!
                        </b>
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </Col>
          {/* Right Section */}
          <Col xs={12} sm={6} md={9}>
            <Switch>
              <Route exact path={this.props.match.path + "/"}>
                <LatestToken
                  project={this.state.project}
                  complete={complete}
                  random={this.state.randomTokenNumber}
                  latest={latestTokenNumber}
                />
              </Route>
              <Route path={this.props.match.path + "/gallery"}>
                <TokenGallery
                  project={this.state.project}
                  projectTokens={this.state.projectTokens}
                />
              </Route>
              <Route path={this.props.match.path + "/artist"}>
                {userIsArtist || this.props.isWhitelisted ? (
                  <ArtistInterface
                    project={this.state.project}
                    account={this.props.account}
                    isWhitelisted={this.props.isWhitelisted}
                    artBlocks={this.state.artBlocks}
                    web3={this.props.web3}
                    scriptJSON={this.state.scriptJSON}
                    projectTokenDetails={this.state.projectTokenDetails}
                    projectScriptDetails={this.state.projectScriptDetails}
                    projectURIInfo={this.state.projectURIInfo}
                    projectRoyaltyInfo={this.state.projectRoyaltyInfo}
                    currency={this.state.currency}
                    currencyAddress={this.state.currencyAddress}
                    onJSONChange={this.handleJSON}
                    onValuesUpdated={this.updateValues}
                  />
                ) : (
                  <Redirect to={this.props.match.url} />
                )}
              </Route>
            </Switch>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withRouter(Project);
