import {
  NETWORK,
  NONINTERACTIVE,
  getGeneratorUrl,
  getArtblocksContractAddresses,
} from './config';
import namehash from 'eth-ens-namehash';

function shouldShowNonInteractive(project) {
  return NONINTERACTIVE.indexOf(project) > -1;
}

// https://github.com/ChainSafe/web3.js/issues/2683#issuecomment-547348416
async function reverseResolveEns(address, web3) {
  var lookup = address.toLowerCase().substr(2) + '.addr.reverse';
  var ResolverContract = await web3.eth.ens.getResolver(lookup);
  var nh = namehash.hash(lookup);
  var name = await ResolverContract.methods.name(nh).call();
  return name;
}

const formatEthereumAddress = (addr, maxLength) => {
  if (addr === null) return '---';

  if (typeof addr !== 'undefined' && addr.length > 9) {
    const firstSegment = addr.substring(0, maxLength || 5);
    const secondPart = addr.substring(addr.length - 3);
    return firstSegment + '...' + secondPart;
  } else {
    return '---';
  }
};

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
    if (!mintId) {
      throw new Error('mint id not found');
    }

    const mintAddress =
      getArtblocksContractAddresses(NETWORK).coreContractAddress;

    if (!getGeneratorUrl(NETWORK)) {
      throw new Error('unable to get generator url');
    }

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

    return `<span>Something went wrong displaying the item</span>`;
  }
}

async function getTokenDetails(uri, tokenId) {
  try {
    if (!tokenId) {
      throw new Error('token id not found');
    }

    const ENDPOINT = `${uri}${tokenId}`;

    return fetch(ENDPOINT, {mode: 'no-cors'})
      .then((res) => {
        if (!res.ok) {
          throw new Error('Something went wrong fetching the token features');
        }
        return res.json();
      })
      .then((json) => {
        return json;
      });
  } catch (error) {
    console.error(error);

    return {};
  }
}

export {
  checkWhitelist,
  formatEthereumAddress,
  getTokenDetails,
  liveRenderUrl,
  renderGenerator,
  reverseResolveEns,
  staticRenderGenerator,
  shouldShowNonInteractive,
};
