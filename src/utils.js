import { NETWORK, NONINTERACTIVE, BASE_URL } from "./config";
import namehash from "eth-ens-namehash";

function tokenGenerator(token) {
  return BASE_URL + "/generator/" + token;
}

function shouldShowNonInteractive(project) {
  return NONINTERACTIVE.indexOf(project) > -1;
}

function tokenHighlightImage(tokenId) {
  const baseImageUrl =
    NETWORK === "rinkeby"
      ? "https://rinkeby.oss.nodechef.com/"
      : "https://artblocks-mainnet.s3.amazonaws.com/";

  return baseImageUrl + tokenId + ".png";
}

function tokenThumbImage(tokenId) {
  let baseImageUrl =
    NETWORK === "rinkeby"
      ? "https://rinkthumb.oss.nodechef.com/"
      : "https://artblocks-mainthumb.s3.amazonaws.com/";

  return baseImageUrl + tokenId + ".png";
}

function tokenDetailsUrl(token) {
  return `${BASE_URL}/token/${token}`;
}

// https://github.com/ChainSafe/web3.js/issues/2683#issuecomment-547348416
async function reverseResolveEns(address, web3) {
  var lookup = address.toLowerCase().substr(2) + ".addr.reverse";
  var ResolverContract = await web3.eth.ens.getResolver(lookup);
  var nh = namehash.hash(lookup);
  var name = await ResolverContract.methods.name(nh).call();
  return name;
}

export {
  tokenGenerator,
  shouldShowNonInteractive,
  tokenHighlightImage,
  tokenThumbImage,
  tokenDetailsUrl,
  reverseResolveEns,
};
