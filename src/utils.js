import {
  NETWORK,
  NONINTERACTIVE,
  BASE_URL,
  VALIDATOR_CONTRACT_ABI,
} from './config';
import namehash from 'eth-ens-namehash';
import Web3 from 'web3';

function tokenGenerator(token) {
  return BASE_URL + '/generator/' + token;
}

function shouldShowNonInteractive(project) {
  return NONINTERACTIVE.indexOf(project) > -1;
}

function tokenHighlightImage(tokenId) {
  const baseImageUrl =
    NETWORK === 'rinkeby'
      ? process.env.REACT_APP_MEDIA_URL_RINKEBY
      : process.env.REACT_APP_MEDIA_URL_MAINNET;

  return baseImageUrl + tokenId + '.png';
}

function tokenThumbImage(tokenId) {
  let baseImageUrl =
    NETWORK === 'rinkeby'
      ? process.env.REACT_APP_MEDIA_URL_RINKEBY_THUMB
      : process.env.REACT_APP_MEDIA_URL_MAINNET_THUMB;

  return baseImageUrl + tokenId + '.png';
}

function tokenDetailsUrl(token) {
  return `${BASE_URL}/token/${token}`;
}

// https://github.com/ChainSafe/web3.js/issues/2683#issuecomment-547348416
async function reverseResolveEns(address, web3) {
  var lookup = address.toLowerCase().substr(2) + '.addr.reverse';
  var ResolverContract = await web3.eth.ens.getResolver(lookup);
  var nh = namehash.hash(lookup);
  var name = await ResolverContract.methods.name(nh).call();
  return name;
}

async function checkWhitelist(ethereumAddress, projectId, mainMinter) {
  try {
    const API_KEY = process.env.REACT_APP_INFURA_KEY;
    const web3 = new Web3(
      new Web3.providers.HttpProvider(
        `https://${NETWORK}.infura.io/v3/${API_KEY}`
      )
    );

    console.log('mainMinter', mainMinter);

    const validatorContractAddress = await mainMinter.methods
      .validatorContracts(Number(projectId))
      .call();

    console.log('validatorContractAddress', validatorContractAddress);

    const validatorContract = new web3.eth.Contract(
      VALIDATOR_CONTRACT_ABI,
      validatorContractAddress
    );

    console.log('validatorContract', validatorContract);

    const isWhitelisted = await validatorContract.methods
      .whitelist(ethereumAddress)
      .call();

    console.log('::::::::::::::: isWhitelisted', isWhitelisted);

    // v2 ROPSTEN
    // let validationErrorMessage = '';

    // const projectId = await artBlocks.methods
    //   .tokenIdToProjectId(this.props.token)
    //   .call();

    // const isWhitelisted = await artBlocks.methods
    //   .addressCanMint(ethereumAddress, projectId)
    //   .call();

    // if (!isWhitelisted) {
    //   validationErrorMessage = await artBlocks.methods
    //     .getValidationErrorMessage(projectId)
    //     .call();
    // }

    // this.setState({
    //   connected: ethereumAddress !== undefined,
    //   account: ethereumAddress,
    // });
    return {
      isWhitelisted,
      // validationErrorMessage,
    };
  } catch (error) {
    console.error(error);
  }
}

export {
  tokenGenerator,
  shouldShowNonInteractive,
  tokenHighlightImage,
  tokenThumbImage,
  tokenDetailsUrl,
  reverseResolveEns,
  checkWhitelist,
};
