import { NETWORK, NONINTERACTIVE, BASE_URL } from "./config";

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
      : "https://mainnet.oss.nodechef.com/";

  return baseImageUrl + tokenId + ".png";
}

function tokenThumbImage(tokenId) {
  let baseImageUrl =
    NETWORK === "rinkeby"
      ? "https://rinkthumb.oss.nodechef.com/"
      : "https://mainthumb.oss.nodechef.com/";

  return baseImageUrl + tokenId + ".png";
}

export {
  tokenGenerator,
  shouldShowNonInteractive,
  tokenHighlightImage,
  tokenThumbImage,
};
