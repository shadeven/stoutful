// Update with your config settings.

module.exports = {
  client: 'postgresql',
  connection: {
    database: 'stoutful',
    user: 'postgres',
    host: process.env.POSTGRES_PORT_5432_TCP_ADDR
  }
};
