const SimpleToken = artifacts.require('SimpleToken');

contract('SimpleToken', (accounts) => {
  let simpleTokenInstance;

  beforeEach(async () => {
    simpleTokenInstance = await SimpleToken.new(1000);
  });

  it('should deploy the contract and initialize balances', async () => {
    const balance = await simpleTokenInstance.balanceOf(accounts[0]);
    assert.equal(balance, 1000, 'Incorrect initial balance');
  });

  it('should transfer tokens between accounts', async () => {
    const sender = accounts[0];
    const recipient = accounts[1];
    const amount = 100;

    await simpleTokenInstance.transfer(recipient, amount, { from: sender });

    const senderBalance = await simpleTokenInstance.balanceOf(sender);
    const recipientBalance = await simpleTokenInstance.balanceOf(recipient);

    assert.equal(senderBalance, 900, 'Incorrect sender balance after transfer');
    assert.equal(recipientBalance, 100, 'Incorrect recipient balance after transfer');
  });

  it('should revert when trying to transfer more tokens than the sender has', async () => {
    const sender = accounts[0];
    const recipient = accounts[1];
    const amount = 2000;

    try {
      await simpleTokenInstance.transfer(recipient, amount, { from: sender });
      assert.fail('Transfer should have reverted');
    } catch (error) {
      assert(error.message.includes('Insufficient balance'), 'Incorrect revert message');
    }
  });
});
