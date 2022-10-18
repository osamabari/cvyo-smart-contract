const CYVO = artifacts.require('./CYVO.sol');
const {
    expectEvent
} = require("@openzeppelin/test-helpers");

contract('CYVO', (accounts) => {

    // fetch accounts on different index
    let [OWNER, Private, Public, Exchange_Listing, Staking, Airdrop_Referal_NewAccount, Bounty, Treasury, Research_And_Development, Founders_And_Management, Advisory_Panel] = accounts;
    let CYVOContract;

    beforeEach(async () => {

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

    it('increaseAllowance success', async () => {
        const initialAmount = 1000;
        const expectedAmount = 2000;
        
        await CYVOContract.approve(Private, initialAmount, { from: Public });
        const resultBeforeIncrease = await CYVOContract.allowance(Public, Private, { from: Public });
        const resultIncrease = await CYVOContract.increaseAllowance(Private, initialAmount, { from: Public });
        const resultAfterIncrease = await CYVOContract.allowance(Public, Private, { from: Public });
        
        assert.equal(initialAmount, resultBeforeIncrease.toNumber(), 'wrong result berore increase');
        assert.equal(expectedAmount, resultAfterIncrease.toNumber(), 'wrong result after increase');
        expectEvent(resultIncrease, 'Approval');
    });
});