const debug = require('debug');

const log = debug('Seed');
const logError = debug('Seed:error');

const crypto = require('crypto');

const maxDecimal = 2 ** 52;
const houseEdge = 4;

class Seed {
  constructor() {
    this.key = null;
    this.serverSeed = null;
    this.seeds = [];
    this.seedsMap = {};
    this.acceptedSeeds = new Map();
    this.crashValue = 1;
    this.duration = 0;
  }

  get isLocked() {
    return Object.isFrozen(this.seeds);
  }

  addSeed(uniqueId, seeder, seed) {
    try {
      log('Adding seed to the list %s %s %s', uniqueId, seeder, seed);
      const length = this.seeds.push([ uniqueId, seed ]);


      this.seedsMap[uniqueId] = {
        seeder,
        seed,
        index: length - 1,
      };

      return true;
    } catch (e) {
      logError('Seed Not added seeder: %s seed: %s', seeder, seed);
    }

    return false;
  }

  removeSeed(uniqueId, seeder, seed) {
    try {
      log('Removing seed to the list %s', seed);
      const item = this.seedsMap[uniqueId];

      if (!item) {
        throw new Error('seed item not found! during removing seed.');
      }

      this.seeds.splice(item.index, 1);
      return true;
    } catch (e) {
      logError('Seed Not removed seeder: %s seed: %s', seeder, seed);
    }

    return false;
  }

  static calcOddDuration(odd) {
    return 8 * Math.floor(Math.log2(odd) * 1000);
  }

  async setServerSeed(seed) {
    this.serverSeed = seed;
  }

  lock() {
    if (!this.serverSeed) {
      logError("Can't lock game --- no server seed");
      return false;
    }
    Object.freeze(this.seeds);

    this.seeds.some((item) => {
      const id = item[0];
      const seed = item[1];

      this.acceptedSeeds.set(seed, id);

      return this.acceptedSeeds.size === 3;
    });

    const seeds = [ this.serverSeed ].concat(Array.from(this.acceptedSeeds.keys()));

    this.key = crypto.createHash('sha512')
      .update(seeds.join(''))
      .digest('hex');

    this.calculate();

    return true;
  }

  calculate() {
    const hex = this.key.slice(0, 13);
    const decimal = parseInt(hex, 16);
    const generatedNumber = (100 - houseEdge) / (1 - decimal / maxDecimal);

    const crashValue = Math.max(1, Math.floor(generatedNumber) / 100).toFixed(2);
    const crashDuration = Seed.calcOddDuration(crashValue);

    this.crashValue = crashValue;
    this.duration = crashDuration;

    log('Game Result is calculated sha512: %s duration: %s crash_value: %s', this.key, this.duration, this.crashValue);
  }
}

module.exports = Seed;
