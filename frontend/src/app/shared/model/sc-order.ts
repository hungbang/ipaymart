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
