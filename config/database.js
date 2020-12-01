const HomeDir = `${__dirname}/../`;

module.exports = {
  client: 'postgresql',
  connection: {
    database: process.env.POSTGRES_DB || 'crazy_rocket',
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || '1234',
    port: process.env.POSTGRES_PORT || 5432,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: `${HomeDir}/database/migrations`,
  },
  seeds: {
    directory: `${HomeDir}/database/seeds`,
  },
};
