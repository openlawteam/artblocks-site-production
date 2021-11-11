import {
  NETWORK,
  NONINTERACTIVE,
  BASE_URL,
  // VALIDATOR_CONTRACT_ABI,
  getMediaURL,
  getMediaThumbURL,
} from './config';
import namehash from 'eth-ens-namehash';

function tokenGenerator(token) {
  return BASE_URL + '/generator/' + token;
}

function shouldShowNonInteractive(project) {
  return NONINTERACTIVE.indexOf(project) > -1;
}

function tokenHighlightImage(tokenId) {
  const baseImageUrl = getMediaURL(NETWORK);

  return baseImageUrl + tokenId + '.png';
}

function tokenThumbImage(tokenId) {
  let baseImageUrl = getMediaThumbURL(NETWORK);

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
    // const API_KEY = process.env.REACT_APP_INFURA_KEY;
    // const web3 = new Web3(
    //   new Web3.providers.HttpProvider(
    //     `https://${NETWORK}.infura.io/v3/${API_KEY}`
    //   )
    // );

    // RINKEBY WHITELIST VALIDATION CONTRACT
    // const validatorContractAddress = await mainMinter.methods
    //   .validatorContracts(Number(projectId))
    //   .call();

    // const validatorContract = new web3.eth.Contract(
    //   VALIDATOR_CONTRACT_ABI,
    //   validatorContractAddress
    // );

    // const isWhitelisted = await validatorContract.methods
    //   .whitelist(ethereumAddress)
    //   .call();

    // ROPSTEN WHITELIST VALIDATION CONTRACT
    let validationErrorMessage = '';

    // const projectId = await mainMinter.methods
    //   .tokenIdToProjectId(this.props.token)
    //   .call();

    const isWhitelisted = await mainMinter.methods
      .addressCanMint(ethereumAddress, Number(projectId))
      .call();

    if (!isWhitelisted) {
      validationErrorMessage = await mainMinter.methods
        .getValidationErrorMessage(Number(projectId))
        .call();
    }

    return {
      isWhitelisted,
      validationErrorMessage,
    };
  } catch (error) {
    console.error(error);
  }
}

function getIFrameSrcDoc(token) {
  const body = `<img src="${BASE_URL}/${token}.png" style="width: 100%" />`;
  const css = `html {
    height: 100%;
  }
  body {
    min-height: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  canvas {
    padding: 0;
    margin: auto;
    display: block;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  img {
    width: 100%;
    height: 100%;
  }`;
  const html = `<html><head><style>${css}</style></head><body>${body}</body></html>`;

  return html;
}

export {
  tokenGenerator,
  shouldShowNonInteractive,
  tokenHighlightImage,
  tokenThumbImage,
  tokenDetailsUrl,
  reverseResolveEns,
  checkWhitelist,
  getIFrameSrcDoc,
};
