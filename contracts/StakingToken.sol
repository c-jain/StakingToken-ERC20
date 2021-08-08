// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title Staking Token (STK)
 * @author Chakshu Jain, India
 * @notice Implements a basic ERC20 staking token with reward distribution.
 */
contract StakingToken is ERC20 {

  // The stakes for each stakeholder.
  mapping(address => uint256) internal stakes;
  
  // The starting date of stake.
  mapping(address => uint256) internal startDate;

  // Decimal 
  uint256 constant decimal = 10**18;
  
  // Event to log createStake failure reason
  event createStakeFailed(string reason);

  // Event to log withdrawStake failure reason
  event withdrawStakeFailed(string reason);

  /**
   * @notice The constructor for the Staking Token.
   */
  constructor() ERC20("Stake_Token", "STK") {
    _mint(msg.sender, 10000 * decimal);
  }

  /**
   * @notice A method for the stakeholder to create a stake.
   * @param _stake The amount of the stake to be created.
   */
  function createStake(uint256 _stake) public {
    if (_stake < 0) {
      emit createStakeFailed("Invalid stake amount!");
    } else if (stakes[msg.sender] != 0) {
      emit createStakeFailed("To stake again, please withdraw your old stake!");
    } else if (balanceOf(msg.sender) < _stake) {
      emit createStakeFailed("You don't have enough balance to stake this amount!");
    } else {
      _burn(msg.sender, _stake * decimal);
      stakes[msg.sender] = _stake;
      startDate[msg.sender] = block.timestamp;
    }

  }

  /**
   * @notice A method to allow a stakeholder to withdraw his stake with interest if any.
   */
  function withdrawStake() public {
    if (stakes[msg.sender] == 0) {
      emit withdrawStakeFailed("You don't have any stake to withdraw!");
    } else {
      uint256 totalDays = (block.timestamp - startDate[msg.sender]) / (60 * 60 * 24);
      uint256 noOfCycles = totalDays / 7;
      uint256 interestOfOneCycle = (stakes[msg.sender] * 5) / 100;
      uint256 interestAmount = noOfCycles * interestOfOneCycle;
      uint256 withdrawableAmount = stakes[msg.sender] + interestAmount;
      stakes[msg.sender] = 0;
      startDate[msg.sender] = 0;
      _mint(msg.sender, withdrawableAmount * decimal);
    }
  }
}
