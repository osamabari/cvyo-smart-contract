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

    it('only owner can transfer ownership', async () => {
        await expectRevert(
            CYVOVestingContract.transferOwnership(Private,{from:Private}),
            "Ownable: caller is not the owner"
        )
        
    })

    it('new owner cannot be zero address', async () => {
        await expectRevert(
            CYVOVestingContract.transferOwnership('0x0000000000000000000000000000000000000000',{from:OWNER}),
            "Ownable: new owner is the zero address"
        )
        
    })

    it('transfer ownership success', async () => {
            let result = await CYVOVestingContract.transferOwnership(Private,{from:OWNER})
            expectEvent(result, 'OwnershipTransferred');
        
    })
    
})