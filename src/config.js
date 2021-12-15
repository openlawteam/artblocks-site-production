//Minter https://oneclickdapp.com/scoop-major

export const NETWORK = process.env.REACT_APP_NETWORK;

function getNonInteractiveList() {
  switch (NETWORK) {
    case 'mainnet':
      return [];
    case 'rinkeby':
      return [];
    case 'ropsten':
      return [];
    default:
      return [];
  }
}
export const NONINTERACTIVE = getNonInteractiveList();

// Add projectId, so it's included in the curated list
function getCuratedList() {
  switch (NETWORK) {
    case 'mainnet':
      return [0];
    case 'rinkeby':
      return [];
    case 'ropsten':
      return [0, 1];
    default:
      return [];
  }
}
export const CURATED = getCuratedList();

function getCompleteList() {
  switch (NETWORK) {
    case 'mainnet':
      return [];
    case 'rinkeby':
      return [];
    case 'ropsten':
      return [];
    default:
      return [];
  }
}
export const COMPLETE = getCompleteList();

export function getChainIdName(chainId) {
  let chainIdName = 'mainnet'; // chain id 1

  switch (Number(chainId)) {
    case 3:
      chainIdName = 'ropsten';
      break;
    case 4:
      chainIdName = 'rinkeby';
      break;
    case 42:
      chainIdName = 'koven';
      break;
    default:
  }

  return chainIdName;
}

function getEtherscanURL() {
  let etherscanUrl = 'https://www.etherscan.io';

  switch (NETWORK) {
    case 'rinkeby':
      etherscanUrl = 'https://rinkeby.etherscan.io';
      break;
    case 'ropsten':
      etherscanUrl = 'https://ropsten.etherscan.io';
      break;
    default:
  }
  return etherscanUrl;
}

export const ETHERSCAN_URL = getEtherscanURL();

function getOpenseaURL() {
  let openseaURL = 'https://www.opensea.io';

  switch (NETWORK) {
    case 'rinkeby':
    case 'ropsten':
      openseaURL = 'https://testnets.opensea.io';
      break;
    default:
  }
  return openseaURL;
}

export const OPENSEA_URL = getOpenseaURL();

export function getFlamingoDAOUrl() {
  let flamingoDAOUrl = 'https://www.flamingodao.xyz';

  switch (NETWORK) {
    case 'rinkeby':
    case 'ropsten':
      flamingoDAOUrl = 'https://develop.flamingodao.xyz';
      break;
    default:
  }
  return flamingoDAOUrl;
}

export function getGeneratorUrl() {
  let generatorUrl = process.env.REACT_APP_GENERATOR_URL_MAINNET;

  switch (NETWORK) {
    case 'rinkeby':
    case 'ropsten':
      generatorUrl = process.env.REACT_APP_GENERATOR_URL_TESTNET;
      break;
    default:
  }

  return generatorUrl;
}

export function getArtblocksContractAddresses(NETWORK) {
  // Default to mainnet contract addresses
  let contractAddresses = {
    coreContractAddress: '0x13aAe6f9599880edbB7d144BB13F1212CeE99533',
    minterContractAddress: '0x8e80CEb80b1eEa8334Bf59668C07f5F52AC7251c',
  };

  switch (NETWORK) {
    case 'rinkeby':
      contractAddresses = {
        coreContractAddress: '0xECE0b4d21DB0AbD81Cd48f1cA6B9CB0238D753e1',
        minterContractAddress: '0xd0aCd5d631eD90f8C165DeA19c105Fe030E97827',
      };
      break;
    case 'ropsten':
      contractAddresses = {
        coreContractAddress: '0x06710498339b30834653459Ac90F52Cbd2F1D085',
        minterContractAddress: '0xa6b90f9e1464873710e90659dc0976a21c2d4800', // 0x337c60aDF28F81f899046B5C5Ee4Db696e0462C4
      };
      break;
    default:
      break;
  }
  return contractAddresses;
}

export const ARTBLOCKS_CONTRACT_ABI = [
  {
    inputs: [
      {internalType: 'string', name: '_tokenName', type: 'string'},
      {internalType: 'string', name: '_tokenSymbol', type: 'string'},
      {internalType: 'address', name: '_randomizerContract', type: 'address'},
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, internalType: 'address', name: 'owner', type: 'address'},
      {
        indexed: true,
        internalType: 'address',
        name: 'approved',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, internalType: 'address', name: 'owner', type: 'address'},
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {indexed: false, internalType: 'bool', name: 'approved', type: 'bool'},
    ],
    name: 'ApprovalForAll',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, internalType: 'address', name: '_to', type: 'address'},
      {
        indexed: true,
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: '_projectId',
        type: 'uint256',
      },
    ],
    name: 'Mint',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, internalType: 'address', name: 'from', type: 'address'},
      {indexed: true, internalType: 'address', name: 'to', type: 'address'},
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    constant: false,
    inputs: [{internalType: 'address', name: '_address', type: 'address'}],
    name: 'addMintWhitelisted',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {internalType: 'string', name: '_projectName', type: 'string'},
      {internalType: 'address', name: '_artistAddress', type: 'address'},
      {internalType: 'uint256', name: '_pricePerTokenInWei', type: 'uint256'},
    ],
    name: 'addProject',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {internalType: 'uint256', name: '_projectId', type: 'uint256'},
      {internalType: 'string', name: '_script', type: 'string'},
    ],
    name: 'addProjectScript',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{internalType: 'address', name: '_address', type: 'address'}],
    name: 'addWhitelisted',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'admin',
    outputs: [{internalType: 'address', name: '', type: 'address'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {internalType: 'address', name: 'to', type: 'address'},
      {internalType: 'uint256', name: 'tokenId', type: 'uint256'},
    ],
    name: 'approve',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{internalType: 'address', name: 'owner', type: 'address'}],
    name: 'balanceOf',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{internalType: 'uint256', name: 'tokenId', type: 'uint256'}],
    name: 'getApproved',
    outputs: [{internalType: 'address', name: '', type: 'address'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{internalType: 'uint256', name: '_tokenId', type: 'uint256'}],
    name: 'getRoyaltyData',
    outputs: [
      {internalType: 'address', name: 'artistAddress', type: 'address'},
      {internalType: 'address', name: 'additionalPayee', type: 'address'},
      {
        internalType: 'uint256',
        name: 'additionalPayeePercentage',
        type: 'uint256',
      },
      {internalType: 'uint256', name: 'royaltyFeeByID', type: 'uint256'},
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{internalType: 'bytes32', name: '', type: 'bytes32'}],
    name: 'hashToTokenId',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {internalType: 'address', name: 'owner', type: 'address'},
      {internalType: 'address', name: 'operator', type: 'address'},
    ],
    name: 'isApprovedForAll',
    outputs: [{internalType: 'bool', name: '', type: 'bool'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{internalType: 'address', name: '', type: 'address'}],
    name: 'isMintWhitelisted',
    outputs: [{internalType: 'bool', name: '', type: 'bool'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{internalType: 'address', name: '', type: 'address'}],
    name: 'isWhitelisted',
    outputs: [{internalType: 'bool', name: '', type: 'bool'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {internalType: 'address', name: '_to', type: 'address'},
      {internalType: 'uint256', name: '_projectId', type: 'uint256'},
      {internalType: 'address', name: '_by', type: 'address'},
    ],
    name: 'mint',
    outputs: [{internalType: 'uint256', name: '_tokenId', type: 'uint256'}],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{internalType: 'string', name: '', type: 'string'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'nextProjectId',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{internalType: 'uint256', name: 'tokenId', type: 'uint256'}],
    name: 'ownerOf',
    outputs: [{internalType: 'address', name: '', type: 'address'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{internalType: 'uint256', name: '_projectId', type: 'uint256'}],
    name: 'projectDetails',
    outputs: [
      {internalType: 'string', name: 'projectName', type: 'string'},
      {internalType: 'string', name: 'artist', type: 'string'},
      {internalType: 'string', name: 'description', type: 'string'},
      {internalType: 'string', name: 'website', type: 'string'},
      {internalType: 'string', name: 'license', type: 'string'},
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    name: 'projectIdToAdditionalPayee',
    outputs: [{internalType: 'address', name: '', type: 'address'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    name: 'projectIdToAdditionalPayeePercentage',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    name: 'projectIdToArtistAddress',
    outputs: [{internalType: 'address', name: '', type: 'address'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    name: 'projectIdToCurrencyAddress',
    outputs: [{internalType: 'address', name: '', type: 'address'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    name: 'projectIdToCurrencySymbol',
    outputs: [{internalType: 'string', name: '', type: 'string'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    name: 'projectIdToPricePerTokenInWei',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    name: 'projectIdToSecondaryMarketRoyaltyPercentage',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {internalType: 'uint256', name: '_projectId', type: 'uint256'},
      {internalType: 'uint256', name: '_index', type: 'uint256'},
    ],
    name: 'projectScriptByIndex',
    outputs: [{internalType: 'string', name: '', type: 'string'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{internalType: 'uint256', name: '_projectId', type: 'uint256'}],
    name: 'projectScriptInfo',
    outputs: [
      {internalType: 'string', name: 'scriptJSON', type: 'string'},
      {internalType: 'uint256', name: 'scriptCount', type: 'uint256'},
      {internalType: 'string', name: 'ipfsHash', type: 'string'},
      {internalType: 'bool', name: 'locked', type: 'bool'},
      {internalType: 'bool', name: 'paused', type: 'bool'},
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{internalType: 'uint256', name: '_projectId', type: 'uint256'}],
    name: 'projectTokenInfo',
    outputs: [
      {internalType: 'address', name: 'artistAddress', type: 'address'},
      {internalType: 'uint256', name: 'pricePerTokenInWei', type: 'uint256'},
      {internalType: 'uint256', name: 'invocations', type: 'uint256'},
      {internalType: 'uint256', name: 'maxInvocations', type: 'uint256'},
      {internalType: 'bool', name: 'active', type: 'bool'},
      {internalType: 'address', name: 'additionalPayee', type: 'address'},
      {
        internalType: 'uint256',
        name: 'additionalPayeePercentage',
        type: 'uint256',
      },
      {internalType: 'string', name: 'currency', type: 'string'},
      {internalType: 'address', name: 'currencyAddress', type: 'address'},
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{internalType: 'uint256', name: '_projectId', type: 'uint256'}],
    name: 'projectURIInfo',
    outputs: [{internalType: 'string', name: 'projectBaseURI', type: 'string'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'randomizerContract',
    outputs: [
      {internalType: 'contract IRandomizer', name: '', type: 'address'},
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{internalType: 'address', name: '_address', type: 'address'}],
    name: 'removeMintWhitelisted',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{internalType: 'uint256', name: '_projectId', type: 'uint256'}],
    name: 'removeProjectLastScript',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{internalType: 'address', name: '_address', type: 'address'}],
    name: 'removeWhitelisted',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'renderProviderAddress',
    outputs: [{internalType: 'address', name: '', type: 'address'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'renderProviderPercentage',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {internalType: 'address', name: 'from', type: 'address'},
      {internalType: 'address', name: 'to', type: 'address'},
      {internalType: 'uint256', name: 'tokenId', type: 'uint256'},
    ],
    name: 'safeTransferFrom',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {internalType: 'address', name: 'from', type: 'address'},
      {internalType: 'address', name: 'to', type: 'address'},
      {internalType: 'uint256', name: 'tokenId', type: 'uint256'},
      {internalType: 'bytes', name: '_data', type: 'bytes'},
    ],
    name: 'safeTransferFrom',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {internalType: 'address', name: 'to', type: 'address'},
      {internalType: 'bool', name: 'approved', type: 'bool'},
    ],
    name: 'setApprovalForAll',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{internalType: 'bytes4', name: 'interfaceId', type: 'bytes4'}],
    name: 'supportsInterface',
    outputs: [{internalType: 'bool', name: '', type: 'bool'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{internalType: 'string', name: '', type: 'string'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{internalType: 'uint256', name: '_projectId', type: 'uint256'}],
    name: 'toggleProjectIsActive',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{internalType: 'uint256', name: '_projectId', type: 'uint256'}],
    name: 'toggleProjectIsLocked',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{internalType: 'uint256', name: '_projectId', type: 'uint256'}],
    name: 'toggleProjectIsPaused',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{internalType: 'uint256', name: 'index', type: 'uint256'}],
    name: 'tokenByIndex',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    name: 'tokenIdToHash',
    outputs: [{internalType: 'bytes32', name: '', type: 'bytes32'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    name: 'tokenIdToProjectId',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {internalType: 'address', name: 'owner', type: 'address'},
      {internalType: 'uint256', name: 'index', type: 'uint256'},
    ],
    name: 'tokenOfOwnerByIndex',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{internalType: 'uint256', name: '_tokenId', type: 'uint256'}],
    name: 'tokenURI',
    outputs: [{internalType: 'string', name: '', type: 'string'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{internalType: 'address', name: 'owner', type: 'address'}],
    name: 'tokensOfOwner',
    outputs: [{internalType: 'uint256[]', name: '', type: 'uint256[]'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {internalType: 'address', name: 'from', type: 'address'},
      {internalType: 'address', name: 'to', type: 'address'},
      {internalType: 'uint256', name: 'tokenId', type: 'uint256'},
    ],
    name: 'transferFrom',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{internalType: 'address', name: '_adminAddress', type: 'address'}],
    name: 'updateAdmin',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {internalType: 'uint256', name: '_projectId', type: 'uint256'},
      {internalType: 'address', name: '_additionalPayee', type: 'address'},
      {
        internalType: 'uint256',
        name: '_additionalPayeePercentage',
        type: 'uint256',
      },
    ],
    name: 'updateProjectAdditionalPayeeInfo',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {internalType: 'uint256', name: '_projectId', type: 'uint256'},
      {internalType: 'address', name: '_artistAddress', type: 'address'},
    ],
    name: 'updateProjectArtistAddress',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {internalType: 'uint256', name: '_projectId', type: 'uint256'},
      {internalType: 'string', name: '_projectArtistName', type: 'string'},
    ],
    name: 'updateProjectArtistName',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {internalType: 'uint256', name: '_projectId', type: 'uint256'},
      {internalType: 'string', name: '_newBaseURI', type: 'string'},
    ],
    name: 'updateProjectBaseURI',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {internalType: 'uint256', name: '_projectId', type: 'uint256'},
      {internalType: 'string', name: '_currencySymbol', type: 'string'},
      {internalType: 'address', name: '_currencyAddress', type: 'address'},
    ],
    name: 'updateProjectCurrencyInfo',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {internalType: 'uint256', name: '_projectId', type: 'uint256'},
      {internalType: 'string', name: '_projectDescription', type: 'string'},
    ],
    name: 'updateProjectDescription',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {internalType: 'uint256', name: '_projectId', type: 'uint256'},
      {internalType: 'string', name: '_ipfsHash', type: 'string'},
    ],
    name: 'updateProjectIpfsHash',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {internalType: 'uint256', name: '_projectId', type: 'uint256'},
      {internalType: 'string', name: '_projectLicense', type: 'string'},
    ],
    name: 'updateProjectLicense',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {internalType: 'uint256', name: '_projectId', type: 'uint256'},
      {internalType: 'uint256', name: '_maxInvocations', type: 'uint256'},
    ],
    name: 'updateProjectMaxInvocations',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {internalType: 'uint256', name: '_projectId', type: 'uint256'},
      {internalType: 'string', name: '_projectName', type: 'string'},
    ],
    name: 'updateProjectName',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {internalType: 'uint256', name: '_projectId', type: 'uint256'},
      {internalType: 'uint256', name: '_pricePerTokenInWei', type: 'uint256'},
    ],
    name: 'updateProjectPricePerTokenInWei',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {internalType: 'uint256', name: '_projectId', type: 'uint256'},
      {internalType: 'uint256', name: '_scriptId', type: 'uint256'},
      {internalType: 'string', name: '_script', type: 'string'},
    ],
    name: 'updateProjectScript',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {internalType: 'uint256', name: '_projectId', type: 'uint256'},
      {internalType: 'string', name: '_projectScriptJSON', type: 'string'},
    ],
    name: 'updateProjectScriptJSON',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {internalType: 'uint256', name: '_projectId', type: 'uint256'},
      {internalType: 'uint256', name: '_secondMarketRoyalty', type: 'uint256'},
    ],
    name: 'updateProjectSecondaryMarketRoyaltyPercentage',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {internalType: 'uint256', name: '_projectId', type: 'uint256'},
      {internalType: 'string', name: '_projectWebsite', type: 'string'},
    ],
    name: 'updateProjectWebsite',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {internalType: 'address', name: '_randomizerAddress', type: 'address'},
    ],
    name: 'updateRandomizerAddress',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: '_renderProviderAddress',
        type: 'address',
      },
    ],
    name: 'updateRenderProviderAddress',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_renderProviderPercentage',
        type: 'uint256',
      },
    ],
    name: 'updateRenderProviderPercentage',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export const ARTBLOCKS_CONTRACT_MINTER_ABI = [
  {
    inputs: [
      {internalType: 'address', name: '_genArt721Address', type: 'address'},
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    constant: true,
    inputs: [
      {internalType: 'address', name: '_to', type: 'address'},
      {internalType: 'uint256', name: '_projectId', type: 'uint256'},
    ],
    name: 'addressCanMint',
    outputs: [{internalType: 'bool', name: '', type: 'bool'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {internalType: 'uint256', name: '_projectId', type: 'uint256'},
      {internalType: 'address', name: '_bonusContractAddress', type: 'address'},
    ],
    name: 'artistSetBonusContractAddress',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{internalType: 'uint256', name: '_projectId', type: 'uint256'}],
    name: 'artistToggleBonus',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{internalType: 'uint256', name: '_projectId', type: 'uint256'}],
    name: 'checkYourAllowanceOfProjectERC20',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    name: 'contractFilterProject',
    outputs: [{internalType: 'bool', name: '', type: 'bool'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'genArtCoreContract',
    outputs: [
      {internalType: 'contract GenArt721CoreV2', name: '', type: 'address'},
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{internalType: 'uint256', name: '_projectId', type: 'uint256'}],
    name: 'getValidationErrorMessage',
    outputs: [{internalType: 'string', name: '', type: 'string'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{internalType: 'uint256', name: '_projectId', type: 'uint256'}],
    name: 'getYourBalanceOfProjectERC20',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'ownerAddress',
    outputs: [{internalType: 'address payable', name: '', type: 'address'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'ownerPercentage',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    name: 'projectIdToBonus',
    outputs: [{internalType: 'bool', name: '', type: 'bool'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    name: 'projectIdToBonusContractAddress',
    outputs: [{internalType: 'address', name: '', type: 'address'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    name: 'projectMaxHasBeenInvoked',
    outputs: [{internalType: 'bool', name: '', type: 'bool'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    name: 'projectMaxInvocations',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {internalType: 'address', name: '', type: 'address'},
      {internalType: 'uint256', name: '', type: 'uint256'},
    ],
    name: 'projectMintCounter',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    name: 'projectMintLimit',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{internalType: 'uint256', name: '_projectId', type: 'uint256'}],
    name: 'purchase',
    outputs: [{internalType: 'uint256', name: '_tokenId', type: 'uint256'}],
    payable: true,
    stateMutability: 'payable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {internalType: 'address', name: '_to', type: 'address'},
      {internalType: 'uint256', name: '_projectId', type: 'uint256'},
    ],
    name: 'purchaseTo',
    outputs: [{internalType: 'uint256', name: '_tokenId', type: 'uint256'}],
    payable: true,
    stateMutability: 'payable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {internalType: 'address payable', name: '_ownerAddress', type: 'address'},
    ],
    name: 'setOwnerAddress',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {internalType: 'uint256', name: '_ownerPercentage', type: 'uint256'},
    ],
    name: 'setOwnerPercentage',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{internalType: 'uint256', name: '_projectId', type: 'uint256'}],
    name: 'setProjectMaxInvocations',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {internalType: 'uint256', name: '_projectId', type: 'uint256'},
      {internalType: 'uint8', name: '_limit', type: 'uint8'},
    ],
    name: 'setProjectMintLimit',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {internalType: 'uint256', name: '_projectId', type: 'uint256'},
      {internalType: 'address', name: '_validatorContract', type: 'address'},
    ],
    name: 'setValidator',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{internalType: 'uint256', name: '_projectId', type: 'uint256'}],
    name: 'toggleContractFilter',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    name: 'validatorContracts',
    outputs: [{internalType: 'address', name: '', type: 'address'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];

export const ERC20_ABI = [
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
      {
        name: '_spender',
        type: 'address',
      },
    ],
    name: 'allowance',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_spender',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: 'balance',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];

export const VALIDATOR_CONTRACT_ABI = [
  {
    inputs: [
      {internalType: 'address', name: '_genArt721Address', type: 'address'},
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    constant: false,
    inputs: [{internalType: 'address', name: '_address', type: 'address'}],
    name: 'addToWhitelist',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'artblocksContract',
    outputs: [
      {
        internalType: 'contract GenArt721CoreContract',
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{internalType: 'address', name: '_address', type: 'address'}],
    name: 'removeFromWhitelist',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{internalType: 'address', name: '_address', type: 'address'}],
    name: 'validateMint',
    outputs: [],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{internalType: 'address', name: '', type: 'address'}],
    name: 'whitelist',
    outputs: [{internalType: 'bool', name: '', type: 'bool'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];
