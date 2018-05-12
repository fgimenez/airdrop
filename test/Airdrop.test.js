import assertRevert from './helpers/assertRevert';

const BigNumber = web3.BigNumber;

const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const Airdrop = artifacts.require('Airdrop');
const SimpleToken = artifacts.require('SimpleToken');

contract('Airdrop', function() {
  const tokenSupply = new BigNumber('1e22');

  beforeEach(async function() {
    this.token = await SimpleToken.new();
    this.airdrop = await Airdrop.new(this.token.address);
    await this.token.transfer(this.airdrop.address, tokenSupply);
  });

  describe('when token address is 0x0', function() {
    it('creation reverts', async function() {
      const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
      await assertRevert(Airdrop.new(ZERO_ADDRESS));
    });
  });

  describe('basic withdrawal', function() {
    it('should assign tokens to allowed bouncer', async function() {

    });

    it('should revert not allowed bouncer', async function() {

    });
  });
});
