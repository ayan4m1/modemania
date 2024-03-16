import { chunk } from 'lodash-es';
import { Mono, Oscillator, Part, Volume } from 'tone';

import { getDtmfFrequencies } from 'utils';

const createChannelWrapper = (
  volume = -Infinity,
  nodes = [],
  actions = () => ({})
) => {
  const channel = new Volume(volume).connect(new Mono().toDestination());

  nodes.forEach((node) => node.connect(channel));

  return {
    channel,
    nodes,
    dispose: () => nodes.forEach((node) => node.dispose()),
    start: () => nodes.forEach((node) => node.start()),
    stop: () => nodes.forEach((node) => node.stop()),
    ...actions(channel)
  };
};

const createFrequencyOscillators = (frequencies) => {
  if (!Array.isArray(frequencies)) {
    console.error(
      'Invalid frequency array supplied to createFrequencyOscillators'
    );
    return null;
  }

  return frequencies.map((frequency) => new Oscillator(frequency, 'sine'));
};

const calculateRingCadence = (cadence, rings = 1) => {
  if (!Array.isArray(cadence) || isNaN(rings)) {
    console.error('Invalid arguments supplied to caluclateRingCadence!');
    return null;
  }

  let startTimeMs = 0;
  return Array(rings)
    .fill(chunk(cadence, 2))
    .flatMap((cdnc) =>
      cdnc.map(([onMs, offMs]) => {
        const result = [startTimeMs, startTimeMs + onMs];

        startTimeMs += onMs + offMs;
        return result;
      })
    );
};

const digitRegex = /[0-9]/;

export const createDialChannel = ({ pressDurationMs, volume }) =>
  createChannelWrapper(volume, [], (channel) => ({
    start: (number) => {
      const digitFrequencies = number
        .split('')
        .filter((char) => digitRegex.test(char))
        .map((digit, index) => [
          (index * pressDurationMs) / 1e3,
          getDtmfFrequencies(digit)
        ]);

      new Part((time, frequencies) => {
        const oscillators = frequencies.map((frequency) =>
          new Oscillator(frequency, 'sine').connect(channel)
        );

        oscillators.forEach((node) =>
          node.start(time).stop(`+${(pressDurationMs / 1.5 / 1e3).toFixed(2)}`)
        );

        setTimeout(() => {
          oscillators.forEach((node) => node.dispose());
        }, pressDurationMs + 100);
      }, digitFrequencies).start();
    }
  }));

export const createDialToneChannel = ({ frequencies, volume }) =>
  createChannelWrapper(volume, createFrequencyOscillators(frequencies));

export const createRingToneChannel = ({ frequencies, cadence, volume }) => {
  if (!Array.isArray(cadence) || !Array.isArray(frequencies) || isNaN(volume)) {
    console.error('Invalid arguments to createRingChannel');
    return null;
  }

  if (Math.floor(cadence.length / 2) !== cadence.length / 2) {
    console.error('Imbalanced cadence!');
    return null;
  }

  const nodes = createFrequencyOscillators(frequencies);

  return createChannelWrapper(volume, nodes, () => ({
    start: (rings) => {
      const partTimes = calculateRingCadence(cadence, rings);

      for (const [startTime, stopTime] of partTimes) {
        nodes.forEach((node) =>
          node
            .start(`+${(startTime / 1e3).toFixed(2)}`)
            .stop(`+${(stopTime / 1e3).toFixed(2)}`)
        );
      }
    }
  }));
};
