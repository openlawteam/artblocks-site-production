import {
  NETWORK,
  NONINTERACTIVE,
  getGeneratorUrl,
  getArtblocksContractAddresses,
} from './config';
import namehash from 'eth-ens-namehash';
import Web3 from 'web3';

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

async function checkIsProjectNotWhitelisted(mainMinter, projectId) {
  try {
    // if validator contract address is zero address, this means the project is not whitleisted
    const validatorContractAddress = await mainMinter.methods
      .validatorContracts(Number(projectId))
      .call();
    // const ZERO_ADDRESS = '0x0000000000000000000000000000000000000123';

    return {
      isProjectNotWhitelisted: Web3.utils
        .toBN(validatorContractAddress)
        .isZero(),
    };
  } catch (error) {
    console.error(error);
  }
}

async function checkIsAccountWhitelisted(
  ethereumAddress,
  projectId,
  mainMinter
) {
  try {
    const isWhitelisted = await mainMinter.methods
      .addressCanMint(ethereumAddress, Number(projectId))
      .call();

    return {
      isWhitelisted,
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
    const mintAddress =
      getArtblocksContractAddresses(NETWORK).coreContractAddress;

    if (!getGeneratorUrl(NETWORK)) {
      throw new Error('unable to get generator url');
    }

    const ENDPOINT = `${getGeneratorUrl(NETWORK)}/${mintAddress}/${mintId}`;

    return fetch(ENDPOINT)
      .then((res) => {
        if (res.status !== 200 && Number(mintId) < 0) {
          return `<span style="color: #497f8f; font-family: monospace; font-size: 1rem;">No mints yet!</span>`;
        }

        if (res.status !== 200 && Number(mintId) >= 0) {
          return `<span style="color: #497f8f; font-family: monospace; font-size: 1rem;">Something went wrong displaying the item</span>`;
        }

        return res.text();
      })
      .then((text) => {
        return text;
      });
  } catch (error) {
    console.error(error);

    return `<span style="color: #497f8f; font-family: monospace; font-size: 1rem;">Something went wrong displaying the item</span>`;
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

function getCanvasStyleAttribute(srcDocument) {
  try {
    const iframeContainer = srcDocument.querySelector('.live-script-container');
    const iframe = iframeContainer.querySelector('iframe');

    if (iframe) {
      const contentDocumentOrWindow =
        iframe.contentWindow || iframe.contentDocument;

      if (contentDocumentOrWindow.document) {
        const canvasDocument =
          contentDocumentOrWindow.document.getElementById('defaultCanvas0');

        const defaultCanvasStyle = canvasDocument.getAttribute('style');

        const canvasStyle = defaultCanvasStyle
          .split(';')
          .reduce(function (ruleMap, ruleString) {
            const rulePair = ruleString.split(':');

            if (rulePair[0] && rulePair[1]) {
              ruleMap[rulePair[0].trim()] = rulePair[1].trim();
            }

            return ruleMap;
          }, {});

        return canvasStyle;
      }
    }
  } catch (error) {}
}

export {
  checkIsAccountWhitelisted,
  checkIsProjectNotWhitelisted,
  formatEthereumAddress,
  getCanvasStyleAttribute,
  getTokenDetails,
  liveRenderUrl,
  renderGenerator,
  reverseResolveEns,
  staticRenderGenerator,
  shouldShowNonInteractive,
};
