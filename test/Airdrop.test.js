
const BigNumber = web3.BigNumber;

const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const Airdrop = artifacts.require('Airdrop');
const SimpleToken = artifacts.require('SimpleToken');

contract('Airdrop', () => {
  const tokenSupply = new BigNumber('1e22');

  beforeEach(async () => {
    this.token = await SimpleToken.new();
    this.airdrop = await Airdrop.new(this.token.address);
    await this.token.transfer(this.airdrop.address, tokenSupply);
  });

  describe('basic withdrawal', () => {
    it('should assign tokens to allowed bouncer', async function () {
/*
      await this.crowdsale.sendTransaction({ value: value, from: investor });
      let balance = await this.token.balanceOf(investor);
      balance.should.be.bignumber.equal(expectedTokenAmount);
*/
    });

    it('should revert not allowed bouncer', async function () {

    });
  });
});
