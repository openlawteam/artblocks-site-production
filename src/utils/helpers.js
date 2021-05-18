export const formatEthereumAddress = (addr, maxLength) => {
  if (addr === null) return '---';

  if (typeof addr !== 'undefined' && addr.length > 9) {
    const firstSegment = addr.substring(0, maxLength || 5);
    const secondPart = addr.substring(addr.length - 3);
    return firstSegment + '...' + secondPart;
  } else {
    return '---';
  }
};
