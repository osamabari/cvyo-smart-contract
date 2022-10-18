const CYVO = artifacts.require('./CYVO.sol');
const CYVOVesting = artifacts.require('./CYVOVesting.sol');
const chalk = require('chalk');
const log = console.log;

contract('CYVOVesting', (accounts) => {

    // fetch accounts on different index
    let [OWNER, Private, Public, Exchange_Listing, Staking, Airdrop_Referal_NewAccount, Bounty, Treasury, Research_And_Development, Founders_And_Management, Advisory_Panel] = accounts;
    let CYVOContract;
    let CYVOVestingContract;

    beforeEach(async () => {
        log(`
        Contract deployed by ${chalk.yellow.bold('OWNER')}(${chalk.green(OWNER)})          
        ${chalk.yellow.bold('Private')} Address:-${chalk.green(Private)}           
        ${chalk.yellow.bold('Public')} Address:-${chalk.green(Public)}
        ${chalk.yellow.bold('ExchangeListing')} Address:-${chalk.green(Exchange_Listing)}             
        ${chalk.yellow.bold('Staking')} Address:-${chalk.green(Staking)}
        ${chalk.yellow.bold('AirdropReferalNewAccount')} Address:-${chalk.green(Airdrop_Referal_NewAccount)}
        ${chalk.yellow.bold('Bounty')} Address:-${chalk.green(Bounty)}
        ${chalk.yellow.bold('ResearchAndDevelopment')} Address:-${chalk.green(Research_And_Development)}
        ${chalk.yellow.bold('FoundersAndManagement')} Address:-${chalk.green(Founders_And_Management)}
        ${chalk.yellow.bold('AdvisoryPanel')} Address:-${chalk.green(Advisory_Panel)}
    `)

        CYVOContract = await CYVO.new(
            Private,
            Public,
            Exchange_Listing,
            Staking,
            Airdrop_Referal_NewAccount,
            Bounty,
            Treasury,
            Research_And_Development,
            Founders_And_Management,
            Advisory_Panel
        );

        CYVOVestingContract = await CYVOVesting.new(
            CYVOContract.address
        );

    })

    it('checking token address --', async () => {

        let token = await CYVOVestingContract.getToken()
        assert.equal(
            token,
            CYVOContract.address,
            `Invalid token address`
        );

    })
})