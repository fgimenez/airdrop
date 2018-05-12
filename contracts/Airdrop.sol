pragma solidity ^0.4.23;

import "zeppelin-solidity/contracts/access/SignatureBouncer.sol";
import "zeppelin-solidity/contracts/token/ERC20/ERC20.sol";

/**
 * @title Airdrop
 * @dev Basic Airdrop contract.
 */
contract Airdrop is SignatureBouncer {
  // The token being dropped.
  ERC20 public token;

  // The amount of tokens to be dropped on each request.
  uint256 public dropAmount;

  constructor(ERC20 _token, uint256 _dropAmount) public {
    require(_dropAmount > 0);
    require(_token != address(0));

    token = _token;
    dropAmount = _dropAmount;
  }

  /**
   * @dev request tokens with signature.
   */
  function requestTokens(bytes _sig) public onlyValidSignature(_sig) {
    token.transfer(msg.sender, dropAmount);
  }
}
