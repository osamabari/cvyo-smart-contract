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

    it('transfer should throw if to address is not valid', async () => {
        await expectRevert(
            CYVOContract.transfer('0x0000000000000000000000000000000000000000', 1000, { from: Public }),
            'ERC20: transfer to the zero address'
        );
    });

    it('transfer should throw if balance is insufficient', async () => {
        await expectRevert(
            CYVOContract.transfer(Public, 1000, { from: OWNER }),
            'ERC20: transfer amount exceeds balance'
        );
    });

    it('transfer success', async () => {
        const result = await CYVOContract.transfer(Private, 1000, { from: Public });
       
        expectEvent(result, 'Transfer');
    });

});