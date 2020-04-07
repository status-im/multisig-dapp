const utils = require('../utils/testUtils');
const MultiSigWallet = artifacts.require('MultiSigWallet')
const requiredConfirmations = 2;
var accounts;
config({
    contracts: {
        deploy: {
            MultiSigWallet: {
                args: [[
                    '$accounts[0]', 
                    '$accounts[1]', 
                    '$accounts[2]'
                ], requiredConfirmations]
            }
        }
    }
}, (_err, web3_accounts) => {
    accounts = web3_accounts;
});

contract("MultiSigWallet", function() {
    this.timeout(0);
    const deposit = '1000'
    const excludePending = false
    const includePending = true
    const excludeExecuted = false
    const includeExecuted = true
    const newRequired = '1'

    var txId;
    var txId2;

    it('Send money to wallet contract', async () => {
        await new Promise((resolve, reject) => web3.eth.sendTransaction({to: MultiSigWallet.address, value: deposit, from: accounts[0]}, e => (e ? reject(e) : resolve())))
        const balance = await utils.balanceOf(web3, MultiSigWallet.address)
        assert.equal(balance.valueOf(), deposit)
    });

    it('Add owner wa_4', async () => {
        const addOwnerABI = MultiSigWallet.methods.addOwner(accounts[3]).encodeABI();
        const tx1 = await MultiSigWallet.methods.submitTransaction(MultiSigWallet.address, 0, addOwnerABI).send({from: accounts[0]})
        txId = tx1.events.Submission.returnValues.transactionId;
        assert.deepEqual(
            await MultiSigWallet.methods.getTransactionIds(0, 1, includePending, excludeExecuted).call(),
            [txId]
        )
    });

    it('Update required to 1', async () => {
        const updateRequirementABI = MultiSigWallet.methods.changeRequirement(newRequired).encodeABI()
        const tx2 = await MultiSigWallet.methods.submitTransaction(MultiSigWallet.address, 0, updateRequirementABI).send({from: accounts[0]})
        txId2 = tx2.events.Submission.returnValues.transactionId;
        assert.deepEqual(
            await MultiSigWallet.methods.getTransactionIds(0, 2, includePending, excludeExecuted).call(),
            [txId, txId2]
        )
    });
    
    it('Confirm change requirement tx', async () => {
        await MultiSigWallet.methods.confirmTransaction(txId2).send({from: accounts[1]})
        assert.equal(await MultiSigWallet.methods.required().call(), newRequired)
        assert.deepEqual(
            await MultiSigWallet.methods.getTransactionIds(0, 1, excludePending, includeExecuted).call(),
            [txId2]
        )
    });
    
    it('Execution fails, because sender is not wallet owner', async () => {
        utils.assertThrowsAsynchronously(
            () => MultiSigWallet.methods.executeTransaction(txId).send({from: accounts[9]})
        )
    });
    
    it('Because the # required confirmations changed to 1, the addOwner tx can be executed now', async () => {
        await MultiSigWallet.methods.executeTransaction(txId).send({from: accounts[0]})
        assert.deepEqual(
            await MultiSigWallet.methods.getTransactionIds(0, 2, excludePending, includeExecuted).call(),
            [txId, txId2]
        )
    })
});
