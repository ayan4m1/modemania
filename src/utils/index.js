export const localities = {
  na: 'North America',
  gb: 'United Kingdom',
  eu: 'Europe',
  jp: 'Japan',
  au: 'Australia',
  nl: 'The Netherlands',
  sg: 'Singapore'
};

export const dialToneVolume = -12;
export const dialTones = {
  na: {
    frequencies: [350, 440],
    volume: -12
  },
  gb: {
    frequencies: [350, 450],
    volume: -12
  },
  eu: {
    frequencies: [425],
    volume: -12
  },
  jp: {
    frequencies: [400],
    volume: -20
  },
  au: {
    frequencies: [425],
    volume: -12
  },
  nl: {
    frequencies: [150, 450],
    volume: -12
  },
  sg: {
    frequencies: [270, 320],
    volume: -12
  }
};

export const ringToneVolume = -20;
export const ringTones = {
  na: {
    frequencies: [440, 480],
    cadence: [2000, 4000],
    volume: -20
  },
  gb: {
    frequencies: [400, 450],
    cadence: [400, 200, 400, 2000],
    volume: -20
  },
  eu: {
    frequencies: [425],
    cadence: [1000, 4000],
    volume: -20
  },
  jp: {
    frequencies: [384, 416],
    cadence: [1000, 2000],
    volume: -5
  },
  au: {
    frequencies: [400, 450],
    cadence: [400, 200, 400, 2000],
    volume: -20
  },
  nl: {
    frequencies: [425],
    cadence: [1000, 4000],
    volume: -20
  },
  sg: {
    frequencies: [400],
    cadence: [400, 400, 200, 2000],
    volume: -20
  }
};

const dtmfMatrix = {
  cols: [1209, 1336, 1477, 1633],
  rows: [697, 770, 852, 941]
};

const validDigitRegex = /[0-9*#]/;

export const getDtmfFrequencies = (digit) => {
  if (!validDigitRegex.test(digit)) {
    return null;
  }

  let row = 0,
    col = 0;

  if (digit === '*' || digit === '#') {
    row = 3;
    col = digit === '*' ? 0 : 2;
  } else {
    col = (digit % 3) - 1;
    row = Math.floor(digit / 3);
  }

  return [dtmfMatrix.cols[col], dtmfMatrix.rows[row]];
};
