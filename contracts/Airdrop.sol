pragma solidity ^0.4.23;

import "zeppelin-solidity/contracts/access/SignatureBouncer.sol";
import "zeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "zeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";


/**
 * @title Airdrop
 * @dev Basic Airdrop contract.
 */
contract Airdrop is SignatureBouncer {
  using SafeERC20 for ERC20;

  // The token being dropped.
  ERC20 public token;

  // The amount of tokens to be dropped on each request.
  uint256 private dropAmount;

  mapping (address => bool) private airdropped;

  event AirdropSent(address indexed to, uint256 value);

  constructor(ERC20 _token, uint256 _dropAmount) public {
    require(_dropAmount > 0, "Drop amount must be positive.");
    require(_token != address(0), "Token address must not be 0x0");

    token = _token;
    dropAmount = _dropAmount;
  }

  /**
   * @dev request tokens with signature.
   * @param _sig signature that allows the sender to request tokens.
   */
  function requestTokens(bytes _sig) public onlyValidSignature(_sig) {
    require(!airdropped[msg.sender]);

    airdropped[msg.sender] = true;
    token.transfer(msg.sender, dropAmount);
    emit AirdropSent(msg.sender, dropAmount);
  }
}
