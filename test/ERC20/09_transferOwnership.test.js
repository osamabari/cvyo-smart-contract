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

    it('only owner can transfer ownership', async () => {
        await expectRevert(
            CYVOContract.transferOwnership(Public,{from:Public}),
            "Ownable: caller is not the owner"
        )
        
    })

    it('new owner cannot be zero address', async () => {
        await expectRevert(
            CYVOContract.transferOwnership('0x0000000000000000000000000000000000000000',{from:OWNER}),
            "Ownable: new owner is the zero address"
        )
        
    })

    it('transfer ownership success', async () => {
            let result = await CYVOContract.transferOwnership(Public,{from:OWNER})
            expectEvent(result, 'OwnershipTransferred');
        
    })
    
});