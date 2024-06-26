const path = require('path');

module.exports = function override(config, env) {
  config.resolve.fallback = {
    util: require.resolve('util/'),
  };

  return config;
};