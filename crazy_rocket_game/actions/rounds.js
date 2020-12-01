const Round = require('../../app/models/Round');
const seedActions = require('./seeds');


exports.retrieveStationGame = id => Round.query()
  .findById(id)
  .withGraphFetched('[seeds, serverSeed]');

exports.retrieveStationNextGame = async (station) => {
  try {
    let round = await Round.query()
      .first()
      .where('station', '=', station)
      .where('is_crashed', '=', false)
      .where('is_started', '=', false)
      .withGraphFetched('[seeds, serverSeed]');

    if (!round) {
      const seed = await seedActions.createServerSeed();

      round = await Round.query()
        .insert({
          station,
          sha256_server_seed: seed.sha256,
        })
        .withGraphFetched('[seeds, serverSeed]');
    }

    return round;
  } catch (error) {
    return {};
  }
};
