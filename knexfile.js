// Update with your config settings.

module.exports = {
  development: {
    client: "postgresql",
    connection: {
      database: "stoutful",
      user: "postgres",
      host: process.env.POSTGRES_PORT_5432_TCP_ADDR
    }
  },
  production: {
    client: "postgresql",
    connection: {
      database: "stoutful",
      user: "postgres",
      host: process.env.POSTGRES_PORT_5432_TCP_ADDR
    }
  }
};
