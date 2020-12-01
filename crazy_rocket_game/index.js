const { partners } = require('../config/universe');
const Station = require('./libs/station');

const stations = new Map();

const stationsList = new Set(partners.map(partner => partner.station));

stationsList
  .forEach((name) => {
    const station = new Station({ name });

    stations.set(station.name, station);
  });

module.exports = stations;
