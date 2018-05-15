
import assertRevert from './helpers/assertRevert';
import { signHex } from './helpers/sign';

const BigNumber = web3.BigNumber;

export const getSigner = (contract, signer, data = '') => (addr) => {
  // via: https://github.com/OpenZeppelin/zeppelin-solidity/pull/812/files
  const message = contract.address.substr(2) + addr.substr(2) + data;
  // ^ substr to remove `0x` because in solidity the address is a set of byes, not a string `0xabcd`
  return signHex(signer, message);
};

const Airdrop = artifacts.require('Airdrop');
const SimpleToken = artifacts.require('SimpleToken');

contract('Airdrop', ([_, owner, authorizedUser, bouncerAddress, notAuthorizedUser]) => {
  const tokenSupply = new BigNumber('1e22');
  const dropAmount = 1000;

  before(async function () {
    this.token = await SimpleToken.new();
    this.airdrop = await Airdrop.new(this.token.address, dropAmount, { from: owner });

    await this.token.transfer(this.airdrop.address, tokenSupply);

    this.genSig = getSigner(this.airdrop, bouncerAddress);
    await this.airdrop.addBouncer(bouncerAddress, { from: owner });
  });

  describe('when token address is 0x0', () => {
    it('creation reverts', async function () {
      const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
      await assertRevert(Airdrop.new(ZERO_ADDRESS, dropAmount));
    });
  });

  describe('when drop amount 0', () => {
    it('creation reverts', async function () {
      await assertRevert(Airdrop.new(this.token.address, 0));
    });
  });

  describe('basic token requests', () => {
    describe('with valid signature', () => {
      before(async function () {
        this.validSignature = this.genSig(authorizedUser);
      });

      describe('with valid sender', () => {
        before(async function () {
          this.logs = (await this.airdrop.requestTokens(this.validSignature, { from: authorizedUser })).logs;
        });

        it('should assign tokens', async function () {
          const balance = await this.token.balanceOf(authorizedUser);
          assert.equal(balance, dropAmount);
        });

        it('should emit an airdrop event', async function () {
          assert.equal(this.logs.length, 1);
          assert.equal(this.logs[0].event, 'AirdropSent');
          assert.equal(this.logs[0].args.to, authorizedUser);
          assert.equal(this.logs[0].args.value, dropAmount);
        });

        it('should not allow more than one request from the same account', async function () {
          await assertRevert(this.airdrop.requestTokens(this.validSignature, { from: authorizedUser }));
        });
      });

      it('should revert with invalid sender', async function () {
        await assertRevert(this.airdrop.requestTokens(this.validSignature, { from: notAuthorizedUser }));
      });
    });

    it('should revert with invalid signature', async function () {
      await assertRevert(this.airdrop.requestTokens('blablabla', { from: authorizedUser }));
    });
  });
});
