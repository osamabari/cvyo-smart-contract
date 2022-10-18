const CYVO = artifacts.require('./CYVO.sol');
const CYVOVesting = artifacts.require('./CYVOVesting.sol');
const {
    time
} = require("@openzeppelin/test-helpers");
const {
    expectRevert
} = require("@openzeppelin/test-helpers");

const oneMonth = 2628000 //1 month
const twoMonths = 5256000 //2months
const threeMonths = 7884000 //3 months
const sixMonths = 15768000 //6 months
const nineMonths = 23652000 //9 months
const twelveMonths = 31536000 //12 months
const fifteenMonths = 39420000 //15 months

const multiplier = 1e18

const PrivateVesting1Amount = '105000000'
const PrivateVesting2Amount = '105000000'
const PrivateVesting3Amount = '75000000'
const PublicVestingAmount = '45000000'
const ExchangeListingVestingAmount = '135000000'
const StakingVestingAmount = '150000000'
const AirdropReferalNewAccountVestingAmount = '45000000'
const BountyVestingAmount = '15000000'
const TreasuryVestingAmount = '300000000'
const ResearchAndDevelopmentVestingAmount = '225000000'
const FoundersAndManagementVestingAmount = '225000000'
const AdvisoryPanelVestingAmount = '75000000'


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

    it('createVestingSchedule should throw if _beneficiary is zero address', async () => {

        let vestingAmount = web3.utils.toWei(TreasuryVestingAmount, 'ether')
        let currentTime = await time.latest()

        await CYVOContract.transfer(CYVOVestingContract.address, vestingAmount, {
            from: Treasury
        });
        await expectRevert(
            CYVOVestingContract.createVestingSchedule(
                '0x0000000000000000000000000000000000000000',
                Number(BigInt(currentTime)),
                1,
                oneMonth * 36,
                threeMonths,
                true,
                vestingAmount
            ),
            "CYVOVesting: beneficiary can't be zero address"
        )

    })

    it('cannot createVestingSchedule because of insufficient tokens', async () => {

        let vestingAmount = web3.utils.toWei(TreasuryVestingAmount, 'ether')
        let currentTime = await time.latest()

        await CYVOContract.transfer(CYVOVestingContract.address, vestingAmount, {
            from: Treasury
        });
        await expectRevert(
            CYVOVestingContract.createVestingSchedule(
                Treasury,
                Number(BigInt(currentTime)),
                1,
                oneMonth * 36,
                threeMonths,
                true,
                vestingAmount + 1000
            ),
            "CYVOVesting: cannot create vesting schedule because not sufficient tokens"
        )

    })

    it('cliff cannot be greater than vesting duration', async () => {

        let vestingAmount = web3.utils.toWei(TreasuryVestingAmount, 'ether')
        let currentTime = await time.latest()

        await CYVOContract.transfer(CYVOVestingContract.address, vestingAmount, {
            from: Treasury
        });
        await expectRevert(
            CYVOVestingContract.createVestingSchedule(
                Treasury,
                Number(BigInt(currentTime)),
                threeMonths,
                oneMonth,
                threeMonths,
                true,
                vestingAmount
            ),
            "CYVOVesting: cliff can't be greater than vesting duration"
        )

    })

    it('duration and amount must be > 0', async () => {

        let vestingAmount = web3.utils.toWei(TreasuryVestingAmount, 'ether')
        let currentTime = await time.latest()

        await CYVOContract.transfer(CYVOVestingContract.address, vestingAmount, {
            from: Treasury
        });
        await expectRevert(
            CYVOVestingContract.createVestingSchedule(
                Treasury,
                Number(BigInt(currentTime)),
                0,
                0,
                threeMonths,
                true,
                vestingAmount
            ),
            "CYVOVesting: duration must be > 0"
        )

        await expectRevert(
            CYVOVestingContract.createVestingSchedule(
                Treasury,
                Number(BigInt(currentTime)),
                1,
                oneMonth * 36,
                threeMonths,
                true,
                0
            ),
            "CYVOVesting: amount must be > 0"
        )

    })

    it('create vesting schedule for Private - 1(36.84% after 9 months)', async () => {


        let vestingAmount = web3.utils.toWei(PrivateVesting1Amount, 'ether')

        let currentTime = await time.latest()
        let balanceBeforeVesting = await CYVOContract.balanceOf(Private)

        await CYVOContract.transfer(CYVOVestingContract.address, vestingAmount, {
            from: Private
        });
        await CYVOVestingContract.createVestingSchedule(
            Private,
            currentTime,
            1,
            nineMonths,
            oneMonth,
            true,
            vestingAmount
        )

        let vestingId = await CYVOVestingContract.getVestingIdAtIndex(0)

        let duration = time.duration.seconds(nineMonths);
        await time.increase(duration);
        await CYVOVestingContract.release(vestingId, vestingAmount)
        let balanceAfterRelease = await CYVOContract.balanceOf(Private);

        assert.equal(
            Number(BigInt(balanceAfterRelease)),
            balanceBeforeVesting,
            `Balance After Vesting Complete Should be equal to ${Number(BigInt(balanceBeforeVesting)) / 1e18}`
        );
    });

    it('create vesting schedule for Private - 2(36.84% after 12 months)', async () => {


        let vestingAmount = web3.utils.toWei(PrivateVesting2Amount, 'ether')

        let currentTime = await time.latest()
        let balanceBeforeVesting = await CYVOContract.balanceOf(Private)

        await CYVOContract.transfer(CYVOVestingContract.address, vestingAmount, {
            from: Private
        });
        await CYVOVestingContract.createVestingSchedule(
            Private,
            currentTime,
            1,
            twelveMonths,
            threeMonths,
            true,
            vestingAmount
        )

        let vestingId = await CYVOVestingContract.getVestingIdAtIndex(0)

        let duration = time.duration.seconds(twelveMonths);
        await time.increase(duration);
        await CYVOVestingContract.release(vestingId, vestingAmount)
        let balanceAfterRelease = await CYVOContract.balanceOf(Private);

        assert.equal(
            Number(BigInt(balanceAfterRelease)),
            balanceBeforeVesting,
            `Balance After Vesting Complete Should be equal to ${Number(BigInt(balanceBeforeVesting)) / 1e18}`
        );
    });

    it('create vesting schedule for public', async () => {

        let vestingAmount = web3.utils.toWei(PublicVestingAmount, 'ether')

        let currentTime = await time.latest()
        let balanceBeforeVesting = await CYVOContract.balanceOf(Public)

        await CYVOContract.transfer(CYVOVestingContract.address, vestingAmount, {
            from: Public
        });
        await CYVOVestingContract.createVestingSchedule(
            Public,
            Number(BigInt(currentTime)) - oneMonth,
            1,
            twoMonths,
            oneMonth,
            true,
            vestingAmount
        )

        let vestingId = await CYVOVestingContract.getVestingIdAtIndex(0)
        let duration = time.duration.seconds(oneMonth);
        await time.increase(duration);
        await CYVOVestingContract.release(vestingId, vestingAmount)
        let balanceAfterRelease = await CYVOContract.balanceOf(Public);

        assert.equal(
            Number(BigInt(balanceAfterRelease)),
            balanceBeforeVesting,
            `Balance After Vesting Complete Should be equal to ${Number(BigInt(balanceBeforeVesting)) / 1e18}`
        );
    });

    it('create vesting schedule for Exchange Listing', async () => {


        let vestingAmount = web3.utils.toWei(ExchangeListingVestingAmount, 'ether')
        let currentTime = await time.latest()

        await CYVOContract.transfer(CYVOVestingContract.address, vestingAmount, {
            from: Exchange_Listing
        });
        await CYVOVestingContract.createVestingSchedule(
            Exchange_Listing,
            Number(BigInt(currentTime)),
            1,
            oneMonth,
            oneMonth,
            true,
            vestingAmount
        )

        let vestingId = await CYVOVestingContract.getVestingIdAtIndex(0)

        let duration = time.duration.seconds(oneMonth);
        await time.increase(duration);
        await CYVOVestingContract.release(vestingId, vestingAmount)
        let balanceAfterRelease = await CYVOContract.balanceOf(Exchange_Listing);

        assert.equal(
            Number(BigInt(balanceAfterRelease)),
            ExchangeListingVestingAmount * multiplier,
            `Balance After Vesting Complete Should be equal to ${ExchangeListingVestingAmount}`
        );
    });

    it('create vesting schedule for staking rewards', async () => {

        let vestingAmount = web3.utils.toWei(StakingVestingAmount, 'ether')
        let currentTime = await time.latest()

        await CYVOContract.transfer(CYVOVestingContract.address, vestingAmount, {
            from: Staking
        });
        await CYVOVestingContract.createVestingSchedule(
            Staking,
            Number(BigInt(currentTime)),
            1,
            oneMonth,
            oneMonth,
            true,
            vestingAmount
        )

        let vestingId = await CYVOVestingContract.getVestingIdAtIndex(0)
        let duration = time.duration.seconds(oneMonth);
        await time.increase(duration);

        await CYVOVestingContract.release(vestingId, vestingAmount)

        let totalBalanceAfterRelease = await CYVOContract.balanceOf(Staking);

        assert.equal(
            Number(BigInt(totalBalanceAfterRelease)),
            StakingVestingAmount * multiplier,
            `Balance After Vesting Complete Should be equal to ${StakingVestingAmount}`
        );
    });

    it('create vesting schedule for Airdrop Referal & NewAccount', async () => {


        let vestingAmount = web3.utils.toWei(AirdropReferalNewAccountVestingAmount, 'ether')

        let currentTime = await time.latest()
        let balanceBeforeVesting = await CYVOContract.balanceOf(Airdrop_Referal_NewAccount)

        await CYVOContract.transfer(CYVOVestingContract.address, vestingAmount, {
            from: Airdrop_Referal_NewAccount
        });
        await CYVOVestingContract.createVestingSchedule(
            Airdrop_Referal_NewAccount,
            Number(BigInt(currentTime)),
            1,
            threeMonths,
            threeMonths,
            true,
            vestingAmount
        )

        let vestingId = await CYVOVestingContract.getVestingIdAtIndex(0)
        let duration = time.duration.seconds(threeMonths);
        await time.increase(duration);
        await CYVOVestingContract.release(vestingId, vestingAmount)
        let balanceAfterRelease = await CYVOContract.balanceOf(Airdrop_Referal_NewAccount);

        assert.equal(
            Number(BigInt(balanceAfterRelease)),
            balanceBeforeVesting,
            `Balance After Vesting Complete Should be equal to ${Number(BigInt(balanceBeforeVesting)) / 1e18}`
        );
    });

    it('create vesting schedule for Bounty', async () => {


        let vestingAmount = web3.utils.toWei(BountyVestingAmount, 'ether')
        let currentTime = await time.latest()

        await CYVOContract.transfer(CYVOVestingContract.address, vestingAmount, {
            from: Bounty
        });
        await CYVOVestingContract.createVestingSchedule(
            Bounty,
            Number(BigInt(currentTime)),
            1,
            1,
            threeMonths,
            true,
            vestingAmount
        )

        let vestingId = await CYVOVestingContract.getVestingIdAtIndex(0)
        let duration = time.duration.seconds(1);
        await time.increase(duration);
        await CYVOVestingContract.release(vestingId, vestingAmount)
        let balanceAfterRelease = await CYVOContract.balanceOf(Bounty);

        assert.equal(
            Number(BigInt(balanceAfterRelease)),
            BountyVestingAmount * multiplier,
            `Balance After Vesting Complete Should be equal to ${BountyVestingAmount}`
        );
    });


    it('create vesting schedule for treasury with immediate release--', async () => {


        let vestingAmount = web3.utils.toWei(TreasuryVestingAmount, 'ether')
        let currentTime = await time.latest()

        await CYVOContract.transfer(CYVOVestingContract.address, vestingAmount, {
            from: Treasury
        });
        await CYVOVestingContract.createVestingSchedule(
            Treasury,
            Number(BigInt(currentTime)) - threeMonths,
            1,
            oneMonth * 33,
            threeMonths,
            true,
            vestingAmount
        )

        let vestingId = await CYVOVestingContract.getVestingIdAtIndex(0)
        let computeReleasableAmountStart = await CYVOVestingContract.computeReleasableAmount(vestingId)
        await CYVOVestingContract.release(vestingId, computeReleasableAmountStart)

        for (let i = 0; i < 10; i++) {
            await increaseTime()
            let computeReleasableAmount = await CYVOVestingContract.computeReleasableAmount(vestingId)
            await CYVOVestingContract.release(vestingId, computeReleasableAmount)

        }
        let totalBalanceAfterRelease = await CYVOContract.balanceOf(Treasury);

        assert.equal(
            Number(BigInt(totalBalanceAfterRelease)),
            TreasuryVestingAmount * multiplier,
            `Balance After Vesting Complete Should be equal to ${TreasuryVestingAmount}`
        );
    });

    async function increaseTime() {
        let duration = time.duration.seconds(threeMonths);
        await time.increase(duration);
    }

})