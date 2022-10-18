const CYVO = artifacts.require('./CYVO');
const CYVOVesting = artifacts.require('./CYVOVesting');
require('dotenv').config();

module.exports = async function (deployer) {
  await deployer.deploy(
    CYVO,
    process.env.Private,
    process.env.Public,
    process.env.Exchange_Listing,
    process.env.Staking,
    process.env.Airdrop_Referal_NewAccount,
    process.env.Bounty,
    process.env.Treasury,
    process.env.Research_And_Development,
    process.env.Founders_And_Management,
    process.env.Advisory_Panel,
    );

  let CYVODeployed = await CYVO.deployed();
  await deployer.deploy(
    CYVOVesting,
    CYVODeployed.address
    );
  await CYVOVesting.deployed();

};

