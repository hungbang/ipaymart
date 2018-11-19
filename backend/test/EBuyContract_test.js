const EBuyContract = artifacts.require("EBuyContract");

toEther = (wei) => {
  return wei / 1000000000000000000;
}
describe('EBuyContract Test', async () => {

  contract("EBuyContract", accounts => {
        let contract;


    beforeEach('setup contract for each test', async () => {
      contract = await EBuyContract.new();
    })


    it('test create new item -> order -> send item -> deliver item -> accept item by  buyer', async () => {

      const itemId = 'I0001';
      const itemId2 = 'I0002';
      const itemId3 = 'I0003';
      const itemPrice = web3.toWei(1, 'ether');
      const originBalanceOfSeller = toEther(web3.eth.getBalance(accounts[1]).toNumber());
      const originBalanceOfBuyer = toEther(web3.eth.getBalance(accounts[2]).toNumber());

      await contract.addItem(itemId, itemPrice, {from: accounts[1]});
      await contract.addItem(itemId2, itemPrice, {from: accounts[1]});
      await contract.addItem(itemId3, itemPrice, {from: accounts[1]});
      await contract.orderItem(itemId, 'SmartDev LLC Danang', {from: accounts[2], value: itemPrice});
      await contract.orderItem(itemId2, 'SmartDev LLC Danang', {from: accounts[2], value: itemPrice});
      await contract.orderItem(itemId3, 'SmartDev LLC Danang', {from: accounts[2], value: itemPrice});
      await contract.sendItem(itemId, accounts[3], {from: accounts[1]});
      await contract.sendItem(itemId2, accounts[3], {from: accounts[1]});
      await contract.sendItem(itemId3, accounts[3], {from: accounts[1]});
      await contract.deliverItem(itemId, {from: accounts[3]});
      await contract.deliverItem(itemId3, {from: accounts[3]});
      await contract.receiveItem(itemId, {from: accounts[2]});
      await contract.receiveItem(itemId3, {from: accounts[2]});
     console.log('carrying: ');
      contract.listCarryingItems.call(accounts[3]).then(result=>{
        console.log(result)
        console.log('id: ', result[0]);
        console.log("order details:");
        for(let i =0;i< result[1].length;i++) {
          console.log("orderid: ", result[1][i].toNumber(), ' State: ', result[2][i].toNumber());
        }
      })
      const balanceOfSeller = toEther(web3.eth.getBalance(accounts[1]).toNumber());
      const balanceOfBuyer = toEther(web3.eth.getBalance(accounts[2]).toNumber());

      console.log(await contract.getOrderDetails(itemId));
      console.log('Origin Balance Of Seller: ', originBalanceOfSeller);
      console.log('Origin Balance Of Buyer: ', originBalanceOfBuyer);

      console.log('Current Balance Of Seller: ', balanceOfSeller);
      console.log('Current Balance Of Buyer: ', balanceOfBuyer);

    })
  })
})
