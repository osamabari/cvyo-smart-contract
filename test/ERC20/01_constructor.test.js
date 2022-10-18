const CYVO = artifacts.require('./CYVO.sol');
const chalk = require('chalk');
const log = console.log;
const decimals = 1e18

contract('CYVO', (accounts) => {
    let PrivateBalance = 285_000_000 * decimals
    let PublicBalance = 45_000_000 * decimals
    let ExchangeListingBalance = 135_000_000 * decimals
    let StakingBalance = 150_000_000 * decimals
    let AirdropReferalNewAccountBalance = 45_000_000 * decimals
    let BountyBalance = 15_000_000 * decimals
    let TreasuryBalance = 300_000_000 * decimals
    let ResearchAndDevelopmentBalance = 225_000_000 * decimals
    let FoundersAndManagementBalance = 225_000_000 * decimals
    let AdvisoryPanelBalance = 75_000_000 * decimals

    // fetch accounts on different index
    let [OWNER, Private, Public, Exchange_Listing, Staking, Airdrop_Referal_NewAccount, Bounty, Treasury, Research_And_Development, Founders_And_Management, Advisory_Panel] = accounts;
    let CYVOContract;

    beforeEach(async () => {
        log(`        
        Contract deployed by ${chalk.yellow.bold('OWNER')}(${chalk.green(OWNER)})   
        ${chalk.yellow.bold('Private')} Address:-${chalk.green(Private)}           
        ${chalk.yellow.bold('Public')} Address:-${chalk.green(Public)}
        ${chalk.yellow.bold('ExchangeListing')} Address:-${chalk.green(Exchange_Listing)}             
        ${chalk.yellow.bold('Staking')} Address:-${chalk.green(Staking)}
        ${chalk.yellow.bold('AirdropReferalNewAccount')} Address:-${chalk.green(Airdrop_Referal_NewAccount)}
        ${chalk.yellow.bold('Bounty')} Address:-${chalk.green(Bounty)}
        ${chalk.yellow.bold('Bounty')} Address:-${chalk.green(Treasury)}
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
    });

    it('Checking balances for all--', async () => {
     
        let privateBalanceMinted = await checkBalance(Private)
        assert.equal(
            privateBalanceMinted,
            PrivateBalance,
            `Private Balance must be equal to ${setDecimals(PrivateBalance)}`
        );
       
        let publicBalanceMinted = await checkBalance(Public)
        assert.equal(
            publicBalanceMinted,
            PublicBalance,
            `Public Balance must be equal to ${setDecimals(PublicBalance)}`
        );

        let ExchangeListingBalanceMinted = await checkBalance(Exchange_Listing)
        assert.equal(
            ExchangeListingBalanceMinted,
            ExchangeListingBalance,
            `Exchange Listing Balance must be equal to ${setDecimals(ExchangeListingBalance)}`
        );

        let stakingBalanceMinted = await checkBalance(Staking)
        assert.equal(
            stakingBalanceMinted,
            StakingBalance,
            `Staking Balance must be equal to ${setDecimals(StakingBalance)}`
        );
       
        let airdropReferalNewAccountBalanceMinted = await checkBalance(Airdrop_Referal_NewAccount)
        assert.equal(
            airdropReferalNewAccountBalanceMinted,
            AirdropReferalNewAccountBalance,
            `Airdrop Referal & NewAccount Balanc must be equal to ${setDecimals(AirdropReferalNewAccountBalance)}`
        );
       
        let bountyBalanceMinted = await checkBalance(Bounty)
        assert.equal(
            bountyBalanceMinted,
            BountyBalance,
            `Bounty Balance must be equal to ${setDecimals(BountyBalance)}`
        );
       
        let treasuryBalanceMinted = await checkBalance(Treasury)
        assert.equal(
            treasuryBalanceMinted,
            TreasuryBalance,
            `Treasury Balance must be equal to ${setDecimals(TreasuryBalance)}`
        );
               
        let researchAndDevelopmentBalanceMinted = await checkBalance(Research_And_Development)
        assert.equal(
            researchAndDevelopmentBalanceMinted,
            ResearchAndDevelopmentBalance,
            `Research And Development Balance must be equal to ${setDecimals(ResearchAndDevelopmentBalance)}`
        );

        let foundersAndManagementBalanceMinted = await checkBalance(Founders_And_Management)
        assert.equal(
            foundersAndManagementBalanceMinted,
            FoundersAndManagementBalance,
            `Founders And Management Balance must be equal to ${setDecimals(FoundersAndManagementBalance)}`
        );

        let advisoryPanelBalanceMinted = await checkBalance(Advisory_Panel)
        assert.equal(
            advisoryPanelBalanceMinted,
            AdvisoryPanelBalance,
            `Advisory Panel Balance must be equal to ${setDecimals(AdvisoryPanelBalance)}`
        );

    });

    it('Checking maximum supply', async () => {
        let maxSupply = await CYVOContract.MAX_SUPPLY()
        let totalSupply = await CYVOContract.totalSupply()
        assert.equal(
            convertToNum(maxSupply),
            convertToNum(totalSupply),
            `Treasury Balance must be equal to ${setDecimals(maxSupply)}`
        );

    });
    function convertToNum(balance){
        return Number(BigInt(balance)) / 1e18
    }

    function setDecimals(balance){
          return balance/decimals
    }
    
    async function checkBalance(_address) {
        return await CYVOContract.balanceOf(_address)

    }
});