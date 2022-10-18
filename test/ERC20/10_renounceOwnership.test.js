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

    it('only owner can renounce ownership', async () => {
        await expectRevert(
            CYVOContract.renounceOwnership({from:Public}),
            "Ownable: caller is not the owner"
        )
        
    })

    it('renounce ownership success', async () => {
            let result = await CYVOContract.renounceOwnership({from:OWNER})
            expectEvent(result, 'OwnershipTransferred');
            let newOwner = await CYVOContract.owner()
            assert.equal(
                newOwner,
                '0x0000000000000000000000000000000000000000',
                "renounce ownership failed"
            )

        
    })
    
});