import { chunk } from 'lodash-es';
import { Mono, Oscillator, Volume } from 'tone';

const createChannel = (volume = -Infinity) =>
  new Volume(volume).connect(new Mono().toDestination());

export const createDialChannel = ({ frequencies, volume }) => {
  const channel = createChannel(volume);

  frequencies.map((frequency) =>
    new Oscillator(frequency, 'sine').connect(channel).start()
  );

  return channel;
};

export const createRingChannel = ({ frequencies, cadence, volume }) => {
  if (Math.floor(cadence.length / 2) !== cadence.length / 2) {
    return console.error('Imbalanced cadence!');
  }

  const channel = createChannel(volume);
  const oscillators = frequencies.map((frequency) =>
    new Oscillator(frequency, 'sine').connect(channel)
  );

  return {
    start: (rings = 1) => {
      let startTimeMs = 0;
      const partTimes = [];

      for (let ring = 1; ring <= rings; ring++) {
        partTimes.push(
          ...chunk(cadence, 2).map(([onMs, offMs]) => {
            const result = [startTimeMs, startTimeMs + onMs];

            startTimeMs += onMs + offMs;
            return result;
          })
        );
      }

      for (const [startTime, stopTime] of partTimes) {
        oscillators.forEach((oscillator) =>
          oscillator
            .start(`${(startTime / 1e3).toFixed(2)}`)
            .stop(`${(stopTime / 1e3).toFixed(2)}`)
        );
      }
    }
  };
};
