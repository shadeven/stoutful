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

module.exports = {
  skipper: {
    adapter: require("skipper-s3"),
    key: "AKIAJNW3FLAVY2C73AHA",
    secret: "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",
    bucket: "stoutful"
  },

  connections: {
    pg: {
      adapter: "sails-postgresql",
      url: process.env.DB_URL
    },

    redis: {
      adapter: "sails-redis",
      host: process.env.REDIS_HOST
    },

    elasticsearch: {
      adapter: "elasticsearch",
      host: process.env.ELASTICSEARCH_HOST
    }
  },

  session: {
    adapter: "connect-redis",
    host: process.env.REDIS_HOST,
    prefix: 'sess:'
  }
};
