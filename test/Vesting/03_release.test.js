const CYVO = artifacts.require('./CYVO.sol');
const CYVOVesting = artifacts.require('./CYVOVesting.sol');
const {
    time
} = require("@openzeppelin/test-helpers");
const {
    expectRevert, expectEvent
} = require("@openzeppelin/test-helpers");

const oneMonth = 2628000 //1 month
const nineMonth = 23652000 //9 month
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

    it('only beneficiary and owner can release vested tokens', async () => {

       
        let vestingAmount = web3.utils.toWei(PrivateVesting1Amount, 'ether')
        let currentTime = await time.latest()

        await CYVOContract.transfer(CYVOVestingContract.address, vestingAmount, {
            from: Private
        });
        await CYVOVestingContract.createVestingSchedule(
            Private,
            currentTime,
            1,
            nineMonth,
            oneMonth,
            true,
            vestingAmount
        )

        let vestingId = await CYVOVestingContract.getVestingIdAtIndex(0)
        let duration = time.duration.seconds(nineMonth);
        await time.increase(duration);
        await expectRevert(
            CYVOVestingContract.release(vestingId, vestingAmount,{from:Private}),
            "CYVOVesting: only beneficiary and owner can release vested tokens"   
        ) 
        
    })

    it('cannot release tokens, not enough vested tokens', async () => {
       
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
        let releaseAmount = vestingAmount + 1000;
        await expectRevert(
            CYVOVestingContract.release(vestingId, releaseAmount ,{from:Private}),
            "CYVOVesting: cannot release tokens, not enough vested tokens"   
           ) 
        
    })

    it('reverts if the vesting schedule does not exist or has been revoked', async () => {
       
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
        await CYVOVestingContract.revoke(vestingId);
        await expectRevert(
            CYVOVestingContract.release(vestingId, vestingAmount ,{from:Private}),
            "revert"   
        ) 
        
    })

    it('release success', async () => {

        let vestingAmount = web3.utils.toWei(PrivateVesting1Amount, 'ether')
        let currentTime = await time.latest()

        await CYVOContract.transfer(CYVOVestingContract.address, vestingAmount, {
            from: Private
        });
        await CYVOVestingContract.createVestingSchedule(
            Private,
            currentTime,
            1,
            oneMonth,
            oneMonth,
            true,
            vestingAmount
        )

        let vestingId = await CYVOVestingContract.getVestingIdAtIndex(0)
        let duration = time.duration.seconds(oneMonth);
        await time.increase(duration);
       
        let result = await CYVOVestingContract.release(vestingId, vestingAmount ,{from:Private})
        expectEvent(result, 'Released');
        
    })

})