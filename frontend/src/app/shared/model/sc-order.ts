export enum OrderStatus {
  None = 'None', Ordered = 'Ordered', InDelivery = 'InDelivery', Delivered = 'Delivered', Done = 'Done', Canceled = 'Canceled'
}

export namespace OrderStatus {

  export function toOrderStatus(status: any): string {
    switch (status) {
      case '0':
        return OrderStatus.Ordered;
      case '1':
        return OrderStatus.InDelivery;
      case '2':
        return OrderStatus.Delivered;
      case '3':
        return OrderStatus.Done;
      case '4':
        return OrderStatus.Canceled;
      default:
        return OrderStatus.None;
    }
  }

  export function toOrderStatusMessage(status: any): string {
    switch (status) {
      case '0':
        return 'Your item is Ordered.';
      case '1':
        return 'Your item is In Delivery';
      case '2':
        return 'Your item is delivered to buyer.';
      case '3':
        return 'Unavailable for sell.';
      case '4':
        return 'Buyer has been cancelled.';
      default:
        return 'Available for sell.';
    }
  }
}

export class ScOrder {
  buyer: any;
  delivery: any;
  receiverContact: any;
  orderTime: any;
  deliveryTime: any;
  deliveredTime: any;
  closedTime: any;
  orderStatus: any;

}
