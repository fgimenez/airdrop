pragma solidity ^0.4.23;

import "zeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract Airdrop {
  ERC20 public token;

  constructor(ERC20 _token) public {
    token = _token;
  }
}
