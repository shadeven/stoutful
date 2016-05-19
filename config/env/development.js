/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {
  connections: {
    pg: {
      adapter: 'sails-postgresql',
      host: process.env.POSTGRES_PORT_5432_TCP_ADDR || '0.0.0.0',
      user: process.env.POSTGRES_ENV_POSTGRES_USER,
      password: process.env.POSTGRES_ENV_POSTGRES_PASSWORD,
      database: process.env.POSTGRES_ENV_POSTGRES_DB
    },

    redis: {
      adapter: 'sails-redis',
      host: process.env.REDIS_PORT_6379_TCP_ADDR || '0.0.0.0',
    },

    elasticsearch: {
      adapter: 'elasticsearch',
      host: process.env.ELASTICSEARCH_PORT_9200_TCP_ADDR || '0.0.0.0',
      log: 'error'
    }
  },

  skipper: {
    dirname: "/app/dist/public/uploads"
  },

  session: {
    adapter: "connect-redis",
    host: process.env.REDIS_PORT_6379_TCP_ADDR || "0.0.0.0",
    port: 6379,
    db: 0,
    prefix: 'sess:'
  }
};
