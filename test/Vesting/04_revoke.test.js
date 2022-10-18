const CYVO = artifacts.require('./CYVO.sol');
const CYVOVesting = artifacts.require('./CYVOVesting.sol');
const {
    time
} = require("@openzeppelin/test-helpers");
const {
    expectRevert, expectEvent
} = require("@openzeppelin/test-helpers");

const oneMonth = 2628000 //1 month
const PrivateVesting1Amount = '105000000'


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

    it('only owner can revoke', async () => {
        
        let vestingAmount = web3.utils.toWei(PrivateVesting1Amount, 'ether')
        let currentTime = await time.latest()

        await CYVOContract.transfer(CYVOVestingContract.address, vestingAmount, {
            from: Private
        });
        await CYVOVestingContract.createVestingSchedule(
            Private,
            currentTime,
            oneMonth,
            oneMonth,
            oneMonth,
            true,
            vestingAmount
        )

        let vestingId = await CYVOVestingContract.getVestingIdAtIndex(0)
        let duration = time.duration.seconds(oneMonth);
        await time.increase(duration);
        await expectRevert(
            CYVOVestingContract.revoke(vestingId,{from:Private}),
            "Ownable: caller is not the owner"
        );
       
    })

    it('vesting is not revocable', async () => {
        
    let vestingAmount = web3.utils.toWei(PrivateVesting1Amount, 'ether')
    let currentTime = await time.latest()

    await CYVOContract.transfer(CYVOVestingContract.address, vestingAmount, {
        from: Private
    });
    await CYVOVestingContract.createVestingSchedule(
        Private,
        currentTime,
        oneMonth,
        oneMonth,
        oneMonth,
        false,
        vestingAmount
    )

    let vestingId = await CYVOVestingContract.getVestingIdAtIndex(0)
    let duration = time.duration.seconds(oneMonth);
    await time.increase(duration);
    await expectRevert(
        CYVOVestingContract.revoke(vestingId,{from:OWNER}),
        "CYVOVesting: vesting is not revocable"
       );
   
    })

    it('revoke success', async () => {
        
        let vestingAmount = web3.utils.toWei(PrivateVesting1Amount, 'ether')
        let currentTime = await time.latest()
    
        await CYVOContract.transfer(CYVOVestingContract.address, vestingAmount, {
            from: Private
        });
        await CYVOVestingContract.createVestingSchedule(
            Private,
            currentTime,
            oneMonth,
            oneMonth,
            oneMonth,
            true,
            vestingAmount
        )
    
        let vestingId = await CYVOVestingContract.getVestingIdAtIndex(0)
        let duration = time.duration.seconds(oneMonth);
        await time.increase(duration);
        
        let result = await CYVOVestingContract.revoke(vestingId,{from:OWNER})
        expectEvent(result, 'Revoked');
    })
    

})