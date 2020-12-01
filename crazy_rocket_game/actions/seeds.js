const crypto = require('crypto');
const ServerSeed = require('../../app/models/ServerSeed');


exports.getServerSeed = async (sha256) => {
  const serverSeed = await ServerSeed.query()
    .first()
    .where('sha256', '=', sha256);
  return serverSeed;
};


exports.createServerSeed = async () => {
  const hash = crypto.randomBytes(20).toString('hex');
  const sha256 = crypto.createHash('sha256').update(hash).digest('hex');

  const serverSeed = await ServerSeed.query().insert({
    sha256,
    hash,
  });

  return serverSeed;
};
