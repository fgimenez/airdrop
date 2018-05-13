require('babel-register');
require('babel-polyfill');

module.exports = {
  networks: {
    ganache: {
      host: 'localhost',
      port: 7545,
      network_id: '*', // eslint-disable-line camelcase
    },
  },
};
