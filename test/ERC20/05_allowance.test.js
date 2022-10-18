const CYVO = artifacts.require('./CYVO.sol');

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

    it('not allowance', async () => {
        const result = await CYVOContract.allowance(Public, Private, { from: Public });
        
        assert.equal(0, result.toNumber(), 'wrong result');
    });

    it('allowance', async () => {
        const expectedAmount = 1000;
        
        await CYVOContract.approve(Private, expectedAmount, { from: Public });
        const result = await CYVOContract.allowance(Public, Private, { from: Public });
        
        assert.equal(expectedAmount, result.toNumber(), 'wrong result');
    });
});