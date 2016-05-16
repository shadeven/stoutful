/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you"re using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don"t add
 * any private information to this file!
 *
 */
var fs = require("fs");

module.exports = {
  ssl: {
    key: fs.readFileSync("server.key"),
    cert: fs.readFileSync("server.crt")
  },

  skipper: {
    adapter: require("skipper-s3"),
    key: "AKIAJNW3FLAVY2C73AHA",
    secret: "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",
    bucket: "stoutful"
  },

  connections: {
    pg: {
      adapter: "sails-postgresql",
      host: process.env.POSTGRES_PORT_5432_TCP_ADDR,
      user: process.env.POSTGRES_ENV_POSTGRES_USER,
      password: process.env.POSTGRES_ENV_POSTGRES_PASSWORD,
      database: process.env.POSTGRES_ENV_POSTGRES_DB
    },

    redis: {
      adapter: "sails-redis",
      host: process.env.REDIS_PORT_6379_TCP_ADDR
    },

    elasticsearch: {
      adapter: "elasticsearch",
      host: process.env.ELASTICSEARCH_PORT_9200_TCP_ADDR
    }
  },

  session: {
    adapter: "connect-redis",
    host: process.env.REDIS_PORT_6379_TCP_ADDR,
    prefix: 'sess:'
  }
};
