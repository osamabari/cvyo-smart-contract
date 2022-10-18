const CYVO = artifacts.require('./CYVO.sol');
const CYVOVesting = artifacts.require('./CYVOVesting.sol');
const {
    expectRevert, expectEvent
} = require("@openzeppelin/test-helpers");

contract('CYVOVesting', (accounts) => {

    // fetch accounts on different index
    let [OWNER, Private, Public, Exchange_Listing, Staking, Airdrop_Referal_NewAccount, Bounty, Treasury, Research_And_Development, Founders_And_Management, Advisory_Panel] = accounts;
    let CYVOContract;
    let CYVOVestingContract;

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

        CYVOVestingContract = await CYVOVesting.new(
            CYVOContract.address
        );

    })

    it('only owner can renounce ownership', async () => {
        await expectRevert(
            CYVOVestingContract.renounceOwnership({from:Private}),
            "Ownable: caller is not the owner"
        )
        
    })

    it('renounce ownership success', async () => {
            let result = await CYVOVestingContract.renounceOwnership({from:OWNER})
            expectEvent(result, 'OwnershipTransferred');
            let newOwner = await CYVOVestingContract.owner()
            assert.equal(
                newOwner,
                '0x0000000000000000000000000000000000000000',
                "renounce ownership failed"
            )

        
    })
    
})