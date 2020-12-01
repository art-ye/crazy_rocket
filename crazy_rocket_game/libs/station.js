const debug = require('debug');
const broker = require('../../nats_broker');
const registerListeners = require('../helpers/subscription');
const redis = require('../../app/services/redis.service');
const Game = require('./game');
const RoundActions = require('../actions/rounds');

const log = debug('Station');
const logError = debug('Station:error');


class Station {
  constructor(config) {
    this.name = config.name;

    this.store = null;
    this.game = null;
    this.shutdownCallback = false;

    this.storeKey = `STATION_STATE:${String(this.name).toUpperCase()}`;

    setTimeout(() => {
      this.init();
      log('Initialized %s', this.name);
    }, 3000);
  }

  get state() {
    if (!this.game || !this.game.round) {
      return {
        round_id: null,
        is_started: false,
        is_crashed: true,
        launch_time: null,
        server_time: new Date().getTime(),
      };
    }

    return {
      round_id: this.game.round.id,
      is_started: this.game.round.is_started || false,
      is_crashed: this.game.round.is_crashed || false,
      launch_time: this.game.round.launch_time,
      server_time: new Date().getTime(),
    };
  }

  async init() {
    registerListeners(this);

    await this.initStore();

    this.startGame();
  }

  async initStore() {
    try {
      const storeString = await redis.get(this.storeKey);

      if (storeString) {
        log('%s initialized from the store', this.name);
        const store = JSON.parse(storeString);

        this.store = store;
      }
    } catch (error) {
      logError('Invalid state', error);
    }
  }

  async startGame(startNextRound = false) {
    let round;
    if (!startNextRound && this.store && this.store.round_id) {
      logError('Round unexpectedly not finished! round_id: %s', this.store.round_id);
      round = await RoundActions.retrieveStationGame(this.store.round_id);

      if (!round) {
        return this.startGame(true);
      }
    } else {
      round = await RoundActions.retrieveStationNextGame(this.name);

      if (this.shutdownCallback) {
        this.updateStore({});
        this.shutdownCallback(true);
        return false;
      }

      this.updateStore({
        round_id: round.id,
      });
    }

    this.game = new Game(round);

    const gameEvents = this.game.events;

    gameEvents.on('available', this.onGameAvailable.bind(this));
    gameEvents.on('running', this.onGameRunning.bind(this));
    gameEvents.on('crashed', this.onGameCrashed.bind(this));

    this.game.init();
    return true;
  }

  async updateStore(store = null) {
    redis.set(this.storeKey, JSON.stringify(store));

    this.store = store;
  }

  async updateState(state) {
    this.state = state;
  }

  async onGameRunning() {
    log('%s game is running', this.name);

    this.publishStateUpdate({
      is_started: true,
    });

    this.publishOddUpdate();

    this.interval = setInterval(() => {
      this.publishOddUpdate();
    }, 100);
  }

  async onGameAvailable() {
    log('%s game initialized successfully', this.name);
    this.publishNewGame();

    this.publishStateUpdate({
      is_started: false,
    });
  }

  async onGameCrashed() {
    clearInterval(this.interval);

    log('%s game crashed', this.name);
    const { crashValue } = this.game;

    this.publishStateUpdate({
      crash_value: crashValue,
    });

    this.publishGameReport({
      crash_value: crashValue,
    });

    setTimeout(() => {
      this.startGame(true);
    }, 4000);
  }

  async publishOddUpdate() {
    broker.push(`station.${this.name}.oddUpdate`, { current_odd: this.game.odd });
  }

  async publishStateUpdate(additionalValues = {}) {
    broker.push(`station.${this.name}.stateUpdate`, { ...this.state, ...additionalValues });
    broker.push(`station.${this.name}.stateUpdate`, { ...this.state, ...additionalValues });
  }

  async publishNewGame() {
    broker.push(`station.${this.name}.newGame`);
  }

  async publishGameReport(additionalValues = {}) {
    const { round } = this.game;

    const report = {
      round_id: round.id,
      crash_value: this.game.crashValue,
      launch_time: round.launch_time,
    };

    broker.push(`station.${this.name}.gameReport`, { ...report, ...additionalValues });
  }
}

module.exports = Station;
