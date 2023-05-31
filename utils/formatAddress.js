export const formatMidDotsAddr = (address) => {
  const leftChunk = address.toString().slice(0, 4);
  const rightChunk = address.toString().slice(-4);
  return `${leftChunk}...${rightChunk}`;
};

export const formatEndDotsAddr = (address, characterToSclie = 16) => {
  const initialChuck = address.toString().slice(0, characterToSclie);
  return `${initialChuck}...`;
};
