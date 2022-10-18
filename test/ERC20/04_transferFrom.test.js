const CYVO = artifacts.require('./CYVO.sol');
const {
    expectRevert, expectEvent
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

    it('transferFrom should throw if balance is insufficient', async () => {
        await CYVOContract.approve(Public, 1000, { from: OWNER });

        await expectRevert(
            CYVOContract.transferFrom(OWNER, Public, 1000, { from: Public }),
            'ERC20: transfer amount exceeds balance'
        );
    });

    it('transferFrom should throw if sender is not approved', async () => {
        await expectRevert(
            CYVOContract.transferFrom(Public, Private, 1000, { from: Public }),
            'ERC20: insufficient allowance'
        );
    });

    it('transferFrom success', async () => {
        await CYVOContract.approve(OWNER, 1000, { from: Public });
        const result = await CYVOContract.transferFrom(Public, Private, 1000, { from: OWNER });
        
        expectEvent(result, 'Transfer');
    });
});