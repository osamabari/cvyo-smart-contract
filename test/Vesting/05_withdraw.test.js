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

    it('only owner can withdraw remaning tokens', async () => {

        let vestingAmount = web3.utils.toWei(PrivateVesting1Amount, 'ether')

        await CYVOContract.transfer(CYVOVestingContract.address, vestingAmount, {
            from: Private
        });
       
        await CYVOVestingContract.getWithdrawableAmount()
      
        await expectRevert(
            CYVOVestingContract.withdraw(vestingAmount,{from:Private}),
            "Ownable: caller is not the owner"   
           ) 
        
    })

    it('cannot withdraw tokens, not enough withdrawable funds', async () => {
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

        await CYVOVestingContract.getVestingIdAtIndex(0)
        let duration = time.duration.seconds(oneMonth);
        await time.increase(duration);
       
        await expectRevert(
            CYVOVestingContract.withdraw(1000 ,{from:OWNER}),
            "CYVOVesting: not enough withdrawable funds"   
           ) 
        
    })

    it('withdraw success', async () => {

        let vestingAmount = web3.utils.toWei(PrivateVesting1Amount, 'ether')

        await CYVOContract.transfer(CYVOVestingContract.address, vestingAmount, {
            from: Private
        });
       
        await CYVOVestingContract.getWithdrawableAmount()
        let result = await CYVOVestingContract.withdraw(vestingAmount,{from:OWNER})
        expectEvent(result, 'Withdraw');
        
           
        
    })

   
})