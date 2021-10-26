import React, {Component} from 'react';
import {
  Button,
  Spinner,
  Col,
  Row,
  InputGroup,
  FormControl,
  Alert,
  Tooltip,
  OverlayTrigger,
  Modal,
} from 'react-bootstrap';
import {
  Link,
  matchPath,
  Redirect,
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';
import {ERC20_ABI} from './config';
import LatestToken from './LatestToken';
import TokenGallery from './TokenGallery';
import ArtistInterface from './ArtistInterface';
import './Project.css';
class Project extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      tokenURIInfo: '',
      purchase: false,
      ineraction: false,
      project: this.props.project,
      artistInterface: false,
      scriptJSON: {},
      purchaseTo: false,
      purchaseToAddress: '',
      currency: '',
      currencyAddress: '',
      erc20: '',
      approved: true,
      erc20Balance: '',
      randomTokenNumber: 0,
      showWarningModal: false,
      showWhyModal: false,
      mintTxConfirmed: false,
      mintTxReceipt: '',
    };
    this.handleToggleArtistInterface =
      this.handleToggleArtistInterface.bind(this);
    this.purchase = this.purchase.bind(this);
    this.handleJSON = this.handleJSON.bind(this);
    this.handlePurchaseTo = this.handlePurchaseTo.bind(this);
    this.handlePurchaseToAddressChange =
      this.handlePurchaseToAddressChange.bind(this);
    this.approve = this.approve.bind(this);
    this.updateProjectTokenDetails = this.updateProjectTokenDetails.bind(this);
    this.updateValues = this.updateValues.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  async componentDidMount() {
    try {
      const artBlocks = this.props.artBlocks;
      const projectTokenInfo = await artBlocks.methods
        .projectTokenInfo(this.props.project)
        .call();
      const projectTokens = Array.from(
        Array(Number(projectTokenInfo.invocations)).keys()
      );

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
        if (currency !== 'ETH') {
          let erc20 = new this.props.web3.eth.Contract(
            ERC20_ABI,
            currencyAddress
          );
          if (this.props.connected) {
            let balance = await erc20.methods
              .balanceOf(this.props.account)
              .call();
            let erc20Balance = this.props.web3.utils.fromWei(balance, 'ether');
            //let erc20Balance = await erc20.methods.balanceOf(this.props.account).call();
            this.setState({erc20Balance});
          }
          this.setState({erc20});
        }
        this.setState({currency, currencyAddress});
        if (this.props.connected && this.state.currency !== 'ETH') {
          setTimeout((x) => {
            this.checkAllowance();
          }, 500);
        }
      } else {
        this.setState({currency: 'ETH'});
      }

      let scriptJSON =
        projectScriptDetails[0] && JSON.parse(projectScriptDetails[0]);

      this.setState({
        artBlocks,
        projectTokens,
        projectDescription,
        projectTokenDetails,
        projectScriptDetails,
        scriptJSON,
        projectURIInfo,
        projectRoyaltyInfo,
        randomTokenNumber: projectTokens
          ? Math.floor(Math.random() * projectTokens.length)
          : 0,
      });
      //setInterval(this.updateProjectTokenDetails,5000);
    } catch (error) {
      console.error(error);
    }
  }

  async updateProjectTokenDetails(state) {
    const projectTokenDetails = await this.state.artBlocks.methods
      .projectTokenInfo(this.props.project)
      .call();

    this.setState({projectTokenDetails});
  }

  async checkAllowance() {
    try {
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
        console.log('BnA' + bnAllowance, 'BnP' + bnPrice);

        //if (allowance >= this.state.projectTokenDetails[1]){
        if (bnAllowance.gte(bnPrice)) {
          this.setState({approved: true});
          console.log('setting approved to true');
        } else {
          this.setState({approved: false});
          console.log('setting approved to false');
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async checkBalance() {
    let balanceRaw = await this.state.erc20.methods
      .balanceOf(this.props.account)
      .call();
    let balance = this.props.web3.utils.fromWei(balanceRaw, 'ether');
    console.log(balance);
    this.setState({erc20Balance: balance});
  }

  async componentDidUpdate(oldProps, prevState) {
    if (oldProps.project !== this.props.project) {
      console.log('change');

      const artBlocks = this.props.artBlocks;
      const projectTokenInfo = await artBlocks.methods
        .projectTokenInfo(this.props.project)
        .call();
      const projectTokens = Array.from(
        Array(projectTokenInfo.invocations).keys()
      );
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
        if (currency !== 'ETH') {
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
          this.setState({erc20});
        }
        this.setState({currency, currencyAddress});
        if (this.state.currency !== 'ETH') {
          setTimeout((x) => {
            this.checkAllowance();
          }, 500);
        }
      } else {
        this.setState({currency: 'ETH'});
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
      console.log('change artBlocks?');
      const artBlocks = this.props.artBlocks;
      if (this.props.project >= 3) {
        let currency = await artBlocks.methods
          .projectIdToCurrencySymbol(this.props.project)
          .call();
        let currencyAddress = await artBlocks.methods
          .projectIdToCurrencyAddress(this.props.project)
          .call();
        if (currency !== 'ETH') {
          let erc20 = new this.props.web3.eth.Contract(
            ERC20_ABI,
            currencyAddress
          );
          if (this.props.connected) {
            setTimeout((x) => {
              this.checkBalance();
            }, 500);
          }
          this.setState({erc20});
        }
        this.setState({currency, currencyAddress});
        if (this.state.currency !== 'ETH') {
          setTimeout((x) => {
            this.checkAllowance();
          }, 500);
        }
      } else {
        this.setState({currency: 'ETH'});
      }
      this.setState({artBlocks});
    }

    if (oldProps.connected !== this.props.connected) {
      console.log('change connected');
      const artBlocks = this.props.artBlocks;
      if (this.props.project >= 3) {
        let currency = await this.state.artBlocks.methods
          .projectIdToCurrencySymbol(this.props.project)
          .call();
        let currencyAddress = await this.state.artBlocks.methods
          .projectIdToCurrencyAddress(this.props.project)
          .call();
        if (currency !== 'ETH') {
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
          this.setState({erc20});
        }
        this.setState({currency, currencyAddress});
      } else {
        this.setState({currency: 'ETH'});
      }

      if (this.props.project >= 3) {
        if (this.state.currency !== 'ETH') {
          setTimeout((x) => {
            this.checkAllowance();
          }, 500);
        }
      }
      this.setState({artBlocks});
    }

    if (prevState.mintTxConfirmed !== this.state.mintTxConfirmed) {
      const mintedToken = parseInt(
        this.state.mintTxReceipt, // .events[0].raw.topics[3],
        16
      );
      console.log('mintedtoken:' + mintedToken);
      this.props.handleToggleView('newToken', mintedToken);
    }
  }

  async updateValues() {
    const artBlocks = this.props.artBlocks;
    const projectTokenInfo = await artBlocks.methods
      .projectTokenInfo(this.props.project)
      .call();
    const projectTokens = Array.from(
      Array(projectTokenInfo.invocations).keys()
    );
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
    if (this.props.project >= 3 && this.state.currency !== 'ETH') {
      if (this.props.connected) {
        let balance = await this.state.erc20.methods
          .balanceOf(this.props.account)
          .call();
        let erc20Balance = this.props.web3.utils.fromWei(balance, 'ether');
        this.setState({erc20Balance});
      }
      console.log('updated values');
      this.checkAllowance();
    } else {
      this.setState({currency: 'ETH'});
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
    if (this.props.project === 'rinkeby') {
      return 'https://opensea.io/assets/art-blocks';
    } else {
      if (this.props.project && this.props.project === '0') {
        return 'https://opensea.io/assets/art-blocks?search[stringTraits][0][name]=Chromie%20Squiggle&search[stringTraits][0][values][0]=All%20Chromie%20Squiggles';
      } else if (this.props.project && this.props.project === '1') {
        return 'https://opensea.io/assets/art-blocks?search[stringTraits][0][name]=Genesis&search[stringTraits][0][values][0]=All%20Genesis';
      } else if (this.props.project && this.props.project === '2') {
        return 'https://opensea.io/assets/art-blocks?search[stringTraits][0][name]=Construction%20Token&search[stringTraits][0][values][0]=All%20Construction%20Tokens';
      } else if (this.props.project && this.props.project === '3') {
        return 'https://opensea.io/assets/art-blocks?search[stringTraits][0][name]=Cryptoblots&search[stringTraits][0][values][0]=All%20Cryptoblots';
      } else if (this.props.project && this.props.project === '4') {
        return 'https://opensea.io/assets/art-blocks?search[stringTraits][0][name]=Dynamic%20Slices&search[stringTraits][0][values][0]=All%20Dynamic%20Slices';
      } else if (this.props.project && this.props.project === '5') {
        return 'https://opensea.io/assets/art-blocks-factory?search[stringTraits][0][name]=Variant%20Plan&search[stringTraits][0][values][0]=All%20Variant%20Plans';
      } else if (this.props.project && this.props.project === '6') {
        return 'https://opensea.io/assets/art-blocks-playground?search[stringTraits][0][name]=View%20Card&search[stringTraits][0][values][0]=All%20View%20Cards';
      } else if (this.props.project && this.props.project === '7') {
        return 'https://opensea.io/assets/art-blocks?search[stringTraits][0][name]=Elevated%20Deconstructions&search[stringTraits][0][values][0]=All%20Elevated%20Deconstructions';
      } else if (this.props.project && this.props.project === '8') {
        return 'https://opensea.io/assets/art-blocks?search[stringTraits][0][name]=Singularity&search[stringTraits][0][values][0]=All%20Singularitys';
      } else if (this.props.project && this.props.project === '9') {
        return 'https://opensea.io/assets/art-blocks?search[stringTraits][0][name]=Ignition&search[stringTraits][0][values][0]=All%20Ignitions';
      } else if (this.props.project && this.props.project === '10') {
        return 'https://opensea.io/assets/art-blocks?search[stringTraits][0][name]=NimBuds&search[stringTraits][0][values][0]=All%20NimBuds';
      } else if (this.props.project && this.props.project === '11') {
        return 'https://opensea.io/assets/art-blocks?search[stringTraits][0][name]=HyperHash&search[stringTraits][0][values][0]=All%20HyperHashs';
      } else if (this.props.project && this.props.project === '12') {
        return 'https://opensea.io/assets/art-blocks?search[stringTraits][0][name]=Unigrids&search[stringTraits][0][values][0]=All%20Unigrids';
      } else if (this.props.project && this.props.project === '13') {
        return 'https://opensea.io/assets/art-blocks?search[stringTraits][0][name]=Ringers&search[stringTraits][0][values][0]=All%20Ringers';
      } else if (this.props.project && this.props.project === '14') {
        return 'https://opensea.io/assets/art-blocks-playground?search[stringTraits][0][name]=Cyber%20Cities&search[stringTraits][0][values][0]=All%20Cyber%20Cities';
      } else if (this.props.project && this.props.project === '15') {
        return 'https://opensea.io/assets/art-blocks-playground?search[stringTraits][0][name]=Utopia&search[stringTraits][0][values][0]=All%20Utopias';
      } else if (this.props.project && this.props.project === '16') {
        return 'https://opensea.io/assets/art-blocks-playground?search[stringTraits][0][name]=Color%20Study&search[stringTraits][0][values][0]=All%20Color%20Studys';
      } else if (this.props.project && this.props.project === '17') {
        return 'https://opensea.io/assets/art-blocks?search[stringTraits][0][name]=Spectron&search[stringTraits][0][values][0]=All%20Spectrons';
      } else if (this.props.project && this.props.project === '18') {
        return 'https://opensea.io/assets/art-blocks-playground?search[stringTraits][0][name]=Gen%202&search[stringTraits][0][values][0]=All%20Gen%202s';
      } else if (this.props.project && this.props.project === '19') {
        return 'https://opensea.io/assets/art-blocks-playground?search[stringTraits][0][name]=R3sonance&search[stringTraits][0][values][0]=All%20R3sonances';
      } else if (this.props.project && this.props.project === '20') {
        return 'https://opensea.io/assets/art-blocks-playground?search[stringTraits][0][name]=Sentience&search[stringTraits][0][values][0]=All%20Sentiences';
      } else if (this.props.project && this.props.project === '21') {
        return 'https://opensea.io/assets/art-blocks?search[stringTraits][0][name]=27-Bit%20Digital&search[stringTraits][0][values][0]=All%2027-Bit%20Digitals';
      } else if (this.props.project && this.props.project === '22') {
        return 'https://opensea.io/assets/art-blocks-playground?search[stringTraits][0][name]=The%20Eternal%20Pump&search[stringTraits][0][values][0]=All%20The%20Eternal%20Pumps';
      } else if (this.props.project && this.props.project === '23') {
        return 'https://opensea.io/assets/art-blocks?search[stringTraits][0][name]=Archetype&search[stringTraits][0][values][0]=All%20Archetypes';
      } else if (this.props.project && this.props.project === '24') {
        return 'https://opensea.io/assets/art-blocks-playground?search[stringTraits][0][name]=Pixel%20Glass&search[stringTraits][0][values][0]=All%20Pixel%20Glass';
      } else if (this.props.project && this.props.project === '25') {
        return 'https://opensea.io/assets/art-blocks-playground?search[stringTraits][0][name]=Pathfinders&search[stringTraits][0][values][0]=All%20Pathfinders';
      } else if (this.props.project && this.props.project === '26') {
        return 'https://opensea.io/assets/art-blocks-playground?search[stringTraits][0][name]=EnergySculpture&search[stringTraits][0][values][0]=All%20EnergySculptures';
      } else if (this.props.project && this.props.project === '27') {
        return 'https://opensea.io/assets/art-blocks?search[stringTraits][0][name]=720%20Minutes&search[stringTraits][0][values][0]=All%20720%20Minutes';
      } else if (this.props.project && this.props.project === '28') {
        return 'https://opensea.io/assets/art-blocks?search[stringTraits][0][name]=Apparitions&search[stringTraits][0][values][0]=All%20Apparitions';
      } else if (this.props.project && this.props.project === '29') {
        return 'https://opensea.io/assets/art-blocks?search[stringTraits][0][name]=Inspirals&search[stringTraits][0][values][0]=All%20Inspirals';
      } else if (this.props.project && this.props.project === '30') {
        return 'https://opensea.io/assets/art-blocks-playground?search[stringTraits][0][name]=Hieroglyphs&search[stringTraits][0][values][0]=All%20Hieroglyphs';
      } else if (this.props.project && this.props.project === '31') {
        return 'https://opensea.io/assets/art-blocks-factory?search[stringTraits][0][name]=Galaxiss&search[stringTraits][0][values][0]=All%20Galaxiss';
      } else if (this.props.project && this.props.project === '32') {
        return 'https://opensea.io/assets/art-blocks-factory?search[stringTraits][0][name]=Light%20Beams&search[stringTraits][0][values][0]=All%20Light%20Beams';
      } else if (this.props.project && this.props.project === '33') {
        return 'https://opensea.io/assets/art-blocks-factory?search[stringTraits][0][name]=Empyreans&search[stringTraits][0][values][0]=All%20Empyreans';
      } else if (this.props.project && this.props.project === '34') {
        return 'https://opensea.io/assets/art-blocks-factory?search[stringTraits][0][name]=Ensōs&search[stringTraits][0][values][0]=All%20Ensōs';
      } else if (this.props.project && this.props.project === '35') {
        return 'https://opensea.io/assets/art-blocks?search[stringTraits][0][name]=Aerial%20View&search[stringTraits][0][values][0]=All%20Aerial%20Views';
      } else if (this.props.project && this.props.project === '36') {
        return 'https://opensea.io/assets/art-blocks-factory?search[stringTraits][0][name]=Gazettes&search[stringTraits][0][values][0]=All%20Gazettes';
      } else if (this.props.project && this.props.project === '37') {
        return 'https://opensea.io/assets/art-blocks-playground?search[stringTraits][0][name]=Paper%20Armada&search[stringTraits][0][values][0]=All%20Paper%20Armadas';
      } else if (this.props.project && this.props.project === '38') {
        return 'https://opensea.io/assets/art-blocks-factory?search[stringTraits][0][name]=ByteBeats&search[stringTraits][0][values][0]=All%20ByteBeats';
      } else if (this.props.project && this.props.project === '39') {
        return 'https://opensea.io/assets/art-blocks?search[stringTraits][0][name]=Synapses&search[stringTraits][0][values][0]=All%20Synapses';
      } else if (this.props.project && this.props.project === '40') {
        return 'https://opensea.io/assets/art-blocks?search[stringTraits][0][name]=Algobots&search[stringTraits][0][values][0]=All%20Algobots';
      } else if (this.props.project && this.props.project === '41') {
        return 'https://opensea.io/assets/art-blocks?search[stringTraits][0][name]=Elementals&search[stringTraits][0][values][0]=All%20Elementals';
      } else if (this.props.project && this.props.project === '42') {
        return 'https://opensea.io/assets/art-blocks-playground?search[stringTraits][0][name]=Void&search[stringTraits][0][values][0]=All%20Voids';
      } else if (this.props.project && this.props.project === '46') {
        return 'https://opensea.io/assets/art-blocks-factory?search[resultModel]=ASSETS&search[stringTraits][0][name]=70s%20Pop%20Series%20One&search[stringTraits][0][values][0]=All%2070s%20Pop%20Series%20Ones';
      } else {
        return 'https://opensea.io/assets/art-blocks';
      }
    }
  }

  handleToggleArtistInterface() {
    this.setState({artistInterface: !this.state.artistInterface});
  }

  handlePurchaseToAddressChange(event) {
    this.setState({purchaseToAddress: event.target.value});
  }

  handlePurchaseTo() {
    let purchaseToState = this.state.purchaseTo;
    this.setState({purchaseTo: !purchaseToState});
  }

  handleJSON(event, field) {
    if (event.target.value) {
      let json = this.state.scriptJSON ? this.state.scriptJSON : {};
      json[field] = event.target.value;
      this.setState({scriptJSON: json});
    } else {
      let json = this.state.scriptJSON;
      delete json[field];
      this.setState({scriptJSON: json});
    }
  }

  async approve() {
    var BN = this.props.web3.utils.BN;
    this.setState({purchase: true});
    let valToApprove = new BN(this.state.projectTokenDetails[1])
      .mul(new BN('10'))
      .toString();
    console.log(valToApprove);
    //console.log(BN(this.state.projectTokenDetails[1]).toString());
    await this.state.erc20.methods
      .approve(this.props.minterAddress, valToApprove)
      .send({
        from: this.props.account,
      })
      .once('receipt', (receipt) => {
        console.log(receipt);
        this.setState({approved: true});
        this.updateValues();
        this.setState({purchase: false});
      })
      .catch((err) => {
        this.updateValues();
        this.setState({purchase: false});
      });
  }

  async purchase() {
    this.setState({purchase: true});

    if (this.state.purchaseTo) {
      let purchaseToAddress = this.props.web3.utils.isAddress(
        this.state.purchaseToAddress
      )
        ? this.state.purchaseToAddress
        : undefined;
      if (!purchaseToAddress) {
        try {
          purchaseToAddress = await this.props.web3.eth.ens.getAddress(
            this.state.purchaseToAddress
          );
        } catch (e) {
          purchaseToAddress = undefined;
        }
      }

      if (purchaseToAddress) {
        alert(
          'You are purchasing a token for another user directly. The NFT will be deposited directly into the Ethereum account that you set. Please reject the transaction if this is not your intention.'
        );
        await this.props.mainMinter.methods
          .purchaseTo(purchaseToAddress, this.props.project)
          .send({
            from: this.props.account,
            value:
              this.state.currency === 'ETH'
                ? this.state.projectTokenDetails[1]
                : 0,
          })
          .once('receipt', async (receipt) => {
            console.log(receipt);

            this.setState({
              txReceiptMessage: 'Please wait...',
            });

            // Delay notifcation of minted token till the nth block
            await this.txnBlockDelayer(receipt);
          })
          .catch((err) => {
            alert(err);
            this.updateValues();
            this.setState({purchase: false});
          });
      } else {
        alert('This is not a valid Ethereum address.');
        this.setState({purchase: false});
      }
    } else {
      await this.props.mainMinter.methods
        .purchase(this.props.project)
        .send({
          from: this.props.account,
          value:
            this.state.currency === 'ETH'
              ? this.state.projectTokenDetails[1]
              : 0,
        })
        .once('receipt', async (receipt) => {
          this.setState({
            txReceiptMessage: 'Please wait...',
          });

          // Delay notifcation of minted token till the nth block
          await this.txnBlockDelayer(receipt);
        })
        .catch((err) => {
          alert(err);
          this.updateValues();
          this.setState({purchase: false});
          this.checkAllowance();
        });
    }
  }

  async txnBlockDelayer(receipt) {
    const blockDelayInterval = process.env.REACT_APP_BLOCK_DELAY_INTERVAL || 0;

    if (blockDelayInterval === 0) {
      return;
    }

    try {
      const blockNumberInterval = setInterval(checkBlockNumber, 1000);

      const web3Props = this.props.web3;
      const appContext = this;

      async function checkBlockNumber() {
        const currentBlockNumber = await web3Props.eth.getBlockNumber();
        const {blockNumber, transactionHash} = receipt;

        if (currentBlockNumber > blockNumber + Number(blockDelayInterval)) {
          const tx = await web3Props.eth.getTransactionReceipt(transactionHash);

          appContext.setState({
            mintTxConfirmed: tx && tx.status,
            mintTxReceipt:
              tx.logs[0].topics[3] === receipt.events[0].raw.topics[3]
                ? receipt.events[0].raw.topics[3]
                : tx.logs[0].topics[3],
          });

          clearInterval(blockNumberInterval);

          if (!tx && !tx.status) {
            throw new Error('mint failed');
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  closeModal() {
    this.setState({showWarningModal: false, showWhyModal: false});
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

    let currentSubroute = 'latest';
    if (galleryMatch) {
      currentSubroute = 'gallery';
    } else if (artistMatch) {
      currentSubroute = 'artist';
    }

    const userIsArtist =
      this.state.projectTokenDetails &&
      this.state.projectTokenDetails[0] === this.props.account;

    return (
      <div className="section-wrapper">
        {this.state.projectTokenDetails &&
          (this.props.isWhitelisted ||
            this.state.projectTokenDetails[0] === this.props.account ||
            this.state.projectTokenDetails[4]) && (
            <div>
              {this.props.network === 'rinkeby' && (
                <Alert variant="danger">
                  You are on the Rinkeby Testnet version of the Art Blocks
                  platform. Make sure your Metamask wallet is set to Rinkeby
                  before confirming any transactions.
                </Alert>
              )}
              <Row
                className={
                  currentSubroute === 'latest' ||
                  (this.state.projectTokens &&
                    this.state.projectTokens.length) < 10
                    ? 'align-items-center content-wrapper'
                    : ''
                }
                style={{marginRight: 0, marginLeft: 0}}>
                <Col xs={12} sm={6} md={3}>
                  <div className="">
                    <div className="text-align-center">
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
                            rel="noopener noreferrer">
                            {this.state.projectDescription[3] &&
                              this.state.projectDescription[3]}
                          </a>

                          <p>{this.state.projectDescription[2]}</p>

                          <p>
                            Total Minted:{' '}
                            {this.state.projectTokenDetails &&
                              this.state.projectTokenDetails[2]}{' '}
                            /{' '}
                            {this.state.projectTokenDetails &&
                              this.state.projectTokenDetails[3]}{' '}
                            max
                          </p>

                          <p>
                            License:{' '}
                            {this.state.projectDescription &&
                              this.state.projectDescription[4]}
                          </p>
                          <p>
                            Script:{' '}
                            {this.state.scriptJSON &&
                              this.state.scriptJSON.type}
                          </p>
                        </div>
                      )}

                      {this.state.projectTokens &&
                        this.state.projectTokenDetails &&
                        !complete && (
                          <div>
                            <p>
                              Price per token:{' '}
                              {this.state.projectTokenDetails &&
                                this.props.web3.utils.fromWei(
                                  this.state.projectTokenDetails[1],
                                  'ether'
                                )}
                              {this.state.currency &&
                              this.state.currency === 'ETH'
                                ? 'Ξ'
                                : ' ' + this.state.currency}
                            </p>

                            {currentSubroute === 'latest' ? (
                              <div>
                                <Alert
                                  style={{width: '100%'}}
                                  className="org-secondary-alert"
                                  variant="secondary">
                                  <p>Showing the latest mint.</p>
                                  <Button
                                    className="btn btn-secondary"
                                    to={this.props.match.url + '/gallery'}
                                    as={Link}>
                                    View All
                                  </Button>
                                </Alert>
                              </div>
                            ) : null}

                            {!this.props.connected && (
                              <div>
                                <br />
                                <p>
                                  Please connect to MetaMask to enable
                                  purchases.
                                </p>
                              </div>
                            )}

                            {this.props.connected &&
                              this.state.projectScriptDetails &&
                              this.state.approved && (
                                <div>
                                  {this.state.currency !== 'ETH' && (
                                    <p>
                                      {this.state.currency} Balance:{' '}
                                      {this.state.erc20Balance}
                                    </p>
                                  )}
                                  <Button
                                    className="btn-primary"
                                    style={{width: '100%'}}
                                    disabled={
                                      this.state.purchase ||
                                      !this.props.isWhitelisted
                                        ? true
                                        : this.state.projectScriptDetails[5] &&
                                          this.state.projectTokenDetails[0] !==
                                            this.props.account
                                        ? true
                                        : false
                                    }
                                    onClick={() =>
                                      this.setState({
                                        showWarningModal: true,
                                      })
                                    }>
                                    {this.state.purchase ? (
                                      <div>
                                        <Spinner
                                          as="span"
                                          animation="border"
                                          size="sm"
                                          role="status"
                                          aria-hidden="true"
                                        />
                                        <span className="sr-only">
                                          {this.state?.txReceiptMessage ??
                                            'Pending...'}
                                        </span>{' '}
                                        {this.state?.txReceiptMessage ??
                                          'Pending...'}
                                      </div>
                                    ) : this.state.projectScriptDetails[5] ? (
                                      'Purchases Paused'
                                    ) : (
                                      'Purchase'
                                    )}
                                  </Button>
                                  {this.state.purchaseTo && (
                                    <InputGroup className="mb-3 purchase-addr-container">
                                      <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon3">
                                          Address:
                                        </InputGroup.Text>
                                      </InputGroup.Prepend>
                                      <FormControl
                                        onChange={
                                          this.handlePurchaseToAddressChange
                                        }
                                        id="text"
                                        aria-describedby="basic-addon3"
                                      />
                                    </InputGroup>
                                  )}
                                  {this.props.isWhitelisted && (
                                    <div className="text-center">
                                      <Button
                                        variant="link"
                                        onClick={this.handlePurchaseTo}
                                        disabled={
                                          this.state.purchase ||
                                          !this.props.isWhitelisted
                                        }>
                                        Purchase To Another User
                                      </Button>
                                    </div>
                                  )}
                                  {!this.props.isWhitelisted && (
                                    <div className="why-tooltip">
                                      <Button
                                        variant="link"
                                        onClick={() =>
                                          this.setState({
                                            showWhyModal: true,
                                          })
                                        }>
                                        Why is purchasing disabled?
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              )}

                            {this.props.connected &&
                              this.state.projectScriptDetails &&
                              !this.state.approved && (
                                <div>
                                  <OverlayTrigger
                                    placement="top"
                                    delay={{show: 250, hide: 400}}
                                    overlay={approveDaiToolTip}>
                                    <Button
                                      className="btn-primary"
                                      /*disabled={this.state.purchase?true:(this.state.projectScriptDetails[5] && this.state.projectTokenDetails[0]!==this.props.account)?true:false} */ onClick={
                                        this.approve
                                      }>
                                      {this.state.purchase ? (
                                        <div>
                                          <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                          />
                                          <span className="sr-only">
                                            {this.state?.txReceiptMessage ??
                                              'Pending...'}
                                          </span>{' '}
                                          {this.state?.txReceiptMessage ??
                                            'Pending...'}
                                        </div>
                                      ) : (
                                        'Approve ' +
                                        this.state.currency +
                                        ' for Purchasing'
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
                                if (currentSubroute !== 'artist') {
                                  await this.props.handleConnectToMetamask();
                                }

                                this.props.history.push(
                                  currentSubroute === 'artist'
                                    ? this.props.match.url
                                    : this.props.match.url + '/artist'
                                );
                              }}
                              className="btn-primary">
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
                            {currentSubroute === 'latest' ? (
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
                                    to={this.props.match.url + '/gallery'}>
                                    View Entire Gallery
                                  </Button>
                                </Alert>
                              </div>
                            ) : null}
                            <p>
                              <b>
                                The max number of iterations/editions for this
                                project have been minted. Please visit the
                                project on{' '}
                                <a
                                  href={this.getOSLink()}
                                  rel="noopener noreferrer"
                                  target="_blank">
                                  OpenSea
                                </a>{' '}
                                to see what is available on the secondary
                                market!
                              </b>
                            </p>
                          </div>
                        )}
                    </div>
                  </div>
                </Col>
                {/* Right Section */}
                <Col xs={12} sm={6} md={9} className="">
                  <Switch>
                    <Route exact path={this.props.match.path + '/'}>
                      <LatestToken
                        project={this.state.project}
                        complete={complete}
                        random={this.state.randomTokenNumber}
                        latest={latestTokenNumber}
                      />
                    </Route>
                    <Route path={this.props.match.path + '/gallery'}>
                      <TokenGallery
                        project={this.state.project}
                        projectTokens={this.state.projectTokens}
                      />
                    </Route>
                    <Route path={this.props.match.path + '/artist'}>
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
              {this.state.showWarningModal && (
                <Modal
                  show={this.state.showWarningModal}
                  onHide={this.closeModal}>
                  <Modal.Header closeButton>
                    <Modal.Title>WARNING</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p>
                      Participating in a live Art Blocks drop is for experts
                      only. By submitting a transaction you acknowledge the
                      following:
                    </p>
                    <ol>
                      <li>You are competing with others.</li>
                      <li>
                        You might have to increase your gas price in order to
                        have your transaction processed before others.
                      </li>
                      <li>
                        Even with a high gas price it is possible your
                        transaction will be confirmed AFTER the drop is sold out
                        in which case your transaction will fail and you will
                        lose the transaction fee for the failed transaction.
                      </li>
                    </ol>
                    <p style={{fontWeight: 'bold'}}>PROCEED AT YOUR OWN RISK</p>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={this.closeModal}>
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => {
                        this.closeModal();
                        this.purchase();
                      }}>
                      Agree
                    </Button>
                  </Modal.Footer>
                </Modal>
              )}

              {this.state.showWhyModal && (
                <Modal show={this.state.showWhyModal} onHide={this.closeModal}>
                  <Modal.Header closeButton>
                    <Modal.Title>WHY IS PURCHASING DISABLED?</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p>
                      Minting is currently available for whitelisted addresses
                      only.
                    </p>
                  </Modal.Body>
                </Modal>
              )}
            </div>
          )}
      </div>
    );
  }
}

export default withRouter(Project);
