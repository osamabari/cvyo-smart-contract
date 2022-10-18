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

    it('approve should throw if spender is zero address', async () => {
    
        await expectRevert(
            CYVOContract.approve('0x0000000000000000000000000000000000000000', 1000, { from: Public }),
            'ERC20: approve to the zero address'
        );
    });

    it('approve success', async () => {
        const result = await CYVOContract.approve(Private, 1000, { from: Public });
        
        expectEvent(result, 'Approval');
    });

});