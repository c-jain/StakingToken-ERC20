var StakingToken = artifacts.require("./StakingToken.sol");

module.exports = function(deployer) {
  deployer.deploy(StakingToken);
};
