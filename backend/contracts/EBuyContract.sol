pragma solidity ^0.4.21;

import "./strings.sol";

contract EBuyContract {

  using strings for *;

  function EBuyContract() {

  }

  event NewItemEvent(string hashId, address seller);
  event NewOrderEvent(string hashId, address seller, address buyer);
  event ReceivedItemEvent(string hashId, address seller, address buyer);
  event ItemSentEvent(string hashId, address seller, address delivery);

  enum State {None, Available, Ordered, Sold, Canceled}
  enum OrderState {Ordered, InDelivery, Delivered, Done, Canceled}


  struct Item {

    State state;
    uint48 createdTime;
    uint48 soldTime;
    uint256 price;
    address seller;
    address buyer;
    string hashId;
  }

  struct Order {
    uint16 id;
    OrderState state;
    address buyer;
    address delivery;
    uint48 orderTime;
    uint48 deliveryTime;
    uint48 deliveredTime;
    uint48 closedTime;
    string hashId;// item id
    string receiverInfo;
  }

  enum DeliveryState {None, New, Approved, Deleted}

  struct Delivery {
    DeliveryState state;
    address addr;
    string ipfsId;
  }
  struct CarryingItem {
    uint16 orderId;
    string hashId;
  }

  mapping(address=> string[]) public sellItems;
  mapping(address=>string[]) public buyItems;
  mapping(address=>CarryingItem[]) private carryingItems;
  string[] public itemIds;
  mapping(string=> Item) items;
  mapping(string => Order[]) orders;
  mapping(address => uint256) balances;

  address [] public deliveryAddresses;
  mapping(address => Delivery) private deliveries;

  modifier onlySeller(string _hashId) {
    require(items[_hashId].seller == msg.sender);
    _;
  }

  modifier onlyBuyer(string _hashId) {
    require(items[_hashId].buyer == msg.sender);
    require(orders[_hashId].length > 0);
    _;
  }

  modifier canCancel(string _hashId) {
    require(items[_hashId].buyer == msg.sender || items[_hashId].seller == msg.sender);
    require(orders[_hashId].length > 0);
    _;
  }

  function registerDelivery(string ipfsId) public {
    require(deliveries[msg.sender].state == DeliveryState.None);
    deliveries[msg.sender] = Delivery(DeliveryState.New, msg.sender, ipfsId);
    deliveryAddresses.push(msg.sender);
  }

  function getDelivery(address _addr) public view returns(address, DeliveryState, string ipfsId) {
    return (deliveries[_addr].addr, deliveries[_addr].state, deliveries[_addr].ipfsId);
  }

  function listDeliveries() public view returns(address[], DeliveryState[], string ipfsIds) {
    DeliveryState[] memory states = new DeliveryState[](deliveryAddresses.length);
    for(uint i = 0; i < deliveryAddresses.length; i++) {
      states[i] = deliveries[deliveryAddresses[i]].state;
      ipfsIds = ipfsIds.toSlice().concat("--LINE--".toSlice()).toSlice().concat(deliveries[deliveryAddresses[i]].ipfsId.toSlice());
    }

    return (deliveryAddresses, states, ipfsIds);
  }

  function addItem(string _hashId, uint256 _price) public returns(bool) {

    require(_price > 0);
    require(items[_hashId].state == State.None);
    itemIds.push(_hashId);
    items[_hashId] = Item(State.Available, uint48(now), 0, _price, msg.sender, 0x0, _hashId);
    sellItems[msg.sender].push(_hashId);
    emit NewItemEvent(_hashId, msg.sender);
  }


  function orderItem(string _hashId, string _receiverInfo) payable public returns(bool) {
    require(msg.sender != items[_hashId].seller);
    require(msg.value == items[_hashId].price);
    require(items[_hashId].state == State.Available);

    items[_hashId].state = State.Ordered;
    items[_hashId].buyer = msg.sender;
    buyItems[msg.sender].push(_hashId);

    balances[msg.sender] += msg.value;
    Order memory order = Order(0, OrderState.Ordered, msg.sender, items[_hashId].seller, uint48(now), 0, 0, 0,_hashId, _receiverInfo);
    uint16 id = uint16(orders[_hashId].push(order) - 1);
    orders[_hashId][id].id = id;
    emit NewOrderEvent(_hashId, items[_hashId].seller, msg.sender);
  }


  function sendItem(string _hashId, address _delivery) public onlySeller(_hashId) {
    // check if item is in latest order
    require(orders[_hashId].length > 0);
    Order storage order = orders[_hashId][orders[_hashId].length - 1];
    require(order.state == OrderState.Ordered);
    order.delivery = _delivery;
    order.deliveryTime = uint48(now);
    order.state = OrderState.InDelivery;
    carryingItems[_delivery].push(CarryingItem(order.id, _hashId));
    emit ItemSentEvent(_hashId, items[_hashId].seller, _delivery);

  }

  function deliverItem(string _hashId) {
    require(items[_hashId].state == State.Ordered);
    Order storage order = orders[_hashId][orders[_hashId].length - 1];
    require(order.state == OrderState.InDelivery);
    require(order.delivery == msg.sender);
    order.deliveredTime = uint48(now);
    order.state = OrderState.Delivered;

  }

  function receiveItem(string _hashId) public onlyBuyer(_hashId) returns(bool) {
    Order storage order = orders[_hashId][orders[_hashId].length - 1];
    require(order.buyer == msg.sender);
    require(items[_hashId].seller != 0x0);
    order.state = OrderState.Done;
    order.closedTime = uint48(now);
    items[_hashId].seller.transfer(items[_hashId].price);
    balances[msg.sender] -= items[_hashId].price;
    items[_hashId].state = State.Sold;
    items[_hashId].soldTime = uint48(now);
    emit ReceivedItemEvent(_hashId, items[_hashId].seller, msg.sender);
    return true;
  }

  //  function cancelOrder(string _hashId) public canCancel(_hashId) returns (bool) {
  //    Order storage order = orders[_hashId][orders[_hashId].length - 1];
  //    require(order.state != OrderState.Done && order.state != OrderState.Delivered && order.state != OrderState.Canceled);
  //    require( balances[msg.sender] > items[_hashId].price);
  //    order.state = OrderState.Canceled;
  //    items[_hashId].state = State.Available;
  //    msg.sender.transfer(items[_hashId].price);
  //    balances[msg.sender] -= items[_hashId].price;
  //    return true;
  //  }

  function listItems() public view returns(string, uint256[], address[], address[],
    State[], uint48[], uint48[] ) {
    uint256[] memory prices = new uint[](itemIds.length);
    uint48[] memory createTimes = new uint48[](itemIds.length);
    uint48[] memory soldTimes = new uint48[](itemIds.length);
    address[] memory buyers = new address[](itemIds.length);
    address[] memory sellers = new address[](itemIds.length);
    State[] memory states = new State[](itemIds.length);

    for(uint i = 0; i < itemIds.length;i++) {
      prices[i] = items[itemIds[i]].price;
      sellers[i] = items[itemIds[i]].seller;
      buyers[i] = items[itemIds[i]].buyer;
      states[i] = items[itemIds[i]].state;
      createTimes[i] = items[itemIds[i]].createdTime;
      soldTimes[i] = items[itemIds[i]].soldTime;
    }

    return(getItemIds(), prices, sellers, buyers, states, createTimes, soldTimes);

  }

  function getItem(string hashId) public view returns(string, uint256, address, address,
    State, uint48, uint48 ) {

    return (hashId,items[hashId].price, items[hashId].seller, items[hashId].buyer, items[hashId].state, items[hashId].createdTime, items[hashId].soldTime );
  }

  function getItemIds() private returns(string ids)  {
    for(uint i =0; i < itemIds.length;i++) {
      ids = ids.toSlice().concat("--LINE--".toSlice()).toSlice().concat(itemIds[i].toSlice());
    }
  }
  //
  function listCarryingItems(address deliveryAddress) public returns(string hashIds, uint[], OrderState[] ) {
    uint[] memory orderIds = new uint[](carryingItems[deliveryAddress].length);
    OrderState[] memory states = new OrderState[](orderIds.length);

    for(uint i = 0; i < orderIds.length;i++) {
      string hashId = carryingItems[deliveryAddress][i].hashId;
      hashIds = hashIds.toSlice().concat("--LINE--".toSlice()).toSlice().concat(hashId.toSlice());
      orderIds[i] =  carryingItems[deliveryAddress][i].orderId;
      states[i] = orders[hashId][orderIds[i]].state;
    }
    return (hashIds,orderIds, states);
  }

  function getOrderDetails(string _hashId) public view returns(address, address[], address[],
    string, string, string) {
    Order[] memory itemOrders = orders[_hashId];
    string memory receiverInfo;
    string memory times;
    string memory states;
    //
    address[] memory buyers = new address[](itemOrders.length);
    address[] memory deliveries = new address[](itemOrders.length);
    for(uint i = 0;i < itemOrders.length; i++) {
      buyers[i] = itemOrders[i].buyer;
      deliveries[i] = itemOrders[i].delivery;
      receiverInfo = receiverInfo.toSlice().concat("--LINE--".toSlice()).toSlice().concat(itemOrders[i].receiverInfo.toSlice());
      times =               times.toSlice().concat("--LINE--".toSlice()).toSlice().concat(uint2str(itemOrders[i].orderTime).toSlice()).toSlice().concat("-BR-".toSlice());
      times = times.toSlice().concat(uint2str(itemOrders[i].deliveryTime).toSlice()).toSlice().concat("-BR-".toSlice());
      times = times.toSlice().concat(uint2str(itemOrders[i].deliveredTime).toSlice()).toSlice().concat("-BR-".toSlice());
      times = times.toSlice().concat(uint2str(itemOrders[i].closedTime).toSlice()).toSlice().concat("-BR-".toSlice());
      states =               states.toSlice().concat("--LINE--".toSlice()).toSlice().concat(uint2str(uint(itemOrders[i].state)).toSlice());

    }
    return (items[_hashId].seller, buyers, deliveries, receiverInfo,times,states);
  }

  function getItemsBySeller(address _seller) public view returns(string itemIds) {
    if(sellItems[_seller].length > 0) {
      for(uint i = 0; i < sellItems[_seller].length; i++) {
        itemIds = itemIds.toSlice().concat("--LINE--".toSlice()).toSlice().concat(sellItems[_seller][i].toSlice());
      }
    }
  }
  function getItemsByBuyer(address _buyer) public view returns(string itemIds) {
    if(buyItems[_buyer].length > 0) {
      for(uint i = 0; i < buyItems[_buyer].length; i++) {
        itemIds = itemIds.toSlice().concat("--LINE--".toSlice()).toSlice().concat(buyItems[_buyer][i].toSlice());
      }
    }
  }

  function uint2str(uint i) internal view returns (string){
    if (i == 0) return "0";
    uint j = i;
    uint len;
    while (j != 0){
      len++;
      j /= 10;
    }
    bytes memory bstr = new bytes(len);
    uint k = len - 1;
    while (i != 0){
      bstr[k--] = byte(48 + i % 10);
      i /= 10;
    }
    return string(bstr);
  }
}
