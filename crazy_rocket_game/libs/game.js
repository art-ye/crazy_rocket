const EventEmitter = require('events');
const debug = require('debug');
const Bet = require('../../app/models/Bet');
const Seed = require('./seed');

const log = debug('Game');

class Game extends Seed {
  constructor(round) {
    super();

    this.round = round;
    this.events = new EventEmitter();

    this.setServerSeed(this.round.serverSeed.hash);
  }

  async init() {
    if (this.round.sha512) {
      this.key = this.round.sha512;

      this.calculate();

      this.events.emit('available');

      this.begin();
    } else if (this.round.launch_time) {
      this.recoverSeeds();
    } else {
      this.setLaunchTime(new Date().getTime() + 6000);
    }
  }

  async recoverSeeds() {
    log('Recovering...');

    const bets = await Bet.query()
      .where('round_id', this.round.id);

    bets.forEach((bet) => {
      super.addSeed(bet.id, bet.nickname, bet.seed);
    });

    this.startCountDown(this.round.launch_time);
  }

  get odd() {
    const currentTime = new Date().getTime();
    const startTime = this.round.launch_time;

    return Math.max(1, 2 ** (((currentTime - startTime) / 1000) / 8)).toFixed(2);
  }

  calcOdd(time = new Date().getTime()) {
    const startTime = this.round.launch_time;
    return Math.max(1, 2 ** (((time - startTime) / 1000) / 8)).toFixed(2);
  }

  async setLaunchTime(time) {
    await this.round.$query().update({
      launch_time: time,
    });

    this.startCountDown(time);
  }

  async startCountDown(time) {
    const currentTime = new Date().getTime();

    this.events.emit('available');

    log('Starting Crash Game Countdown ---> %s', time - currentTime);

    setTimeout(this.lock.bind(this), time - currentTime);
  }

  async lock() {
    const isLocked = super.lock();

    log('Game state is locked = %s', isLocked);

    if (isLocked) {
      const insertableSeeds = [{
        seeder: 'server',
        seed: this.serverSeed,
      }];

      log('Accepted seeds are %o', this.acceptedSeeds);

      if (this.acceptedSeeds.size) {
        this.acceptedSeeds.forEach((uniqueId, seed) => {
          log('Accepted seed map %s %s, %o', seed, uniqueId, this.seedsMap);
          const { seeder } = this.seedsMap[uniqueId];
          log('Seeder %s', seeder);

          insertableSeeds.push({
            seeder,
            seed,
          });
        });
      }


      log('Inserts seeds %o', insertableSeeds);

      await this.round.$relatedQuery('seeds')
        .insert(insertableSeeds);

      await this.round.$query().update({
        is_started: true,
        sha512: this.key,
      });

      this.begin();
    }
  }

  begin() {
    const duration = Number(this.round.launch_time) + Number(this.duration)
      - Number(new Date().getTime());

    log('Game is began duration: %s crash_value: %s', duration, Number(this.crashValue).toFixed(2));

    this.events.emit('running');

    setTimeout(async () => {
      await this.round.$query().update({
        is_crashed: true,
        crash_value: Number(this.crashValue).toFixed(2),
      });

      log('Game is crashed: %s', this.crashValue);
      this.events.emit('crashed');
    }, duration);
  }
}

module.exports = Game;
