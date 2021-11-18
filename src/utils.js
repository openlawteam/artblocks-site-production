import {
  NETWORK,
  NONINTERACTIVE,
  BASE_URL,
  getMediaURL,
  getGeneratorUrl,
  getArtblocksContractAddresses,
} from './config';
import namehash from 'eth-ens-namehash';

function shouldShowNonInteractive(project) {
  return NONINTERACTIVE.indexOf(project) > -1;
}

function tokenHighlightImage(tokenId) {
  const baseImageUrl = getMediaURL(NETWORK);

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

function liveRenderUrl(tokenId) {
  const mintAddress =
    getArtblocksContractAddresses(NETWORK).coreContractAddress;

  return `${getGeneratorUrl(NETWORK)}/${mintAddress}/${tokenId}`;
}

function staticRenderGenerator(tokenId) {
  const staticUrl =
    NETWORK === 'mainnet'
      ? process.env.REACT_APP_GENERATOR_STATIC_URL_MAINNET
      : process.env.REACT_APP_GENERATOR_STATIC_URL_TESTNET;

  return `${staticUrl}/${tokenId}.png`;
}

async function renderGenerator(mintId) {
  try {
    if (!mintId) return;

    const mintAddress =
      getArtblocksContractAddresses(NETWORK).coreContractAddress;
    const ENDPOINT = `${getGeneratorUrl(NETWORK)}/${mintAddress}/${mintId}`;

    return fetch(ENDPOINT)
      .then((res) => {
        return res.text();
      })
      .then((text) => {
        return text;
      });
  } catch (error) {
    console.error(error);
  }
}

export {
  // tokenGenerator,
  shouldShowNonInteractive,
  tokenHighlightImage,
  // tokenThumbImage,
  tokenDetailsUrl,
  reverseResolveEns,
  checkWhitelist,
  liveRenderUrl,
  renderGenerator,
  staticRenderGenerator,
};
