const debug = require('debug');
const broker = require('../../nats_broker');

const log = debug('RegisterListeners');
const logError = debug('RegisterListeners:error');

module.exports = (station) => {
  broker.on(`station.${station.name}.getState`, (req, res) => {
    const { state } = station;
    const additionalValues = {};

    if (state.is_crashed) {
      additionalValues.crash_value = station.game.crashValue;
    }

    res.send({ ...state, ...additionalValues });
  });

  broker.on(`station.${station.name}.getOdd`, (req, res) => {
    if (station.game) {
      const { crashValue } = station.game;
      const { time } = req.body;
      const odd = station.game.calcOdd(time);

      if (odd < crashValue) {
        return res.send({ odd });
      }
    }
    return res.send({ odd: 0 });
  });

  broker.on(`station.${station.name}.updateSeed`, ({ body }, res) => {
    let isDone = false;

    log('Received body %o', body);

    try {
      const uniqueId = body.id;
      const seeder = body.nickname;
      const { seed } = body;
      const { isDeleted } = body;

      if (!seeder || !seed) {
        logError('Bad Seed %o', body);
        return res.send(isDone);
      }

      if (isDeleted) {
        log('%s deleting seeder: %s seed: %s', station.name, seeder, seed);
        isDone = station.game.removeSeed(uniqueId, seeder, seed);
      } else {
        log('%s register seeder: %s seed: %s', station.name, seeder, seed);
        isDone = station.game.addSeed(uniqueId, seeder, seed);
      }
    } catch (e) {
      logError('error during updating seed %o', e);
    }

    return res.send(isDone);
  });

  broker.on(`station.${station.name}.oddCashoutTime`, ({ body }, res) => {
    const launchTime = station.state.launch_time;
    const cashoutOdd = body.odd;

    if (!launchTime || !cashoutOdd) {
      logError('oddCashoutTime not registered bad params: %o', body);
      return;
    }

    const cashoutTime = launchTime + 8 * Math.floor(Math.log2(cashoutOdd) * 1000);

    res.send({ cashoutTime });
  });
};
