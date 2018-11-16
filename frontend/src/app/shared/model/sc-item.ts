export enum ScItemStatus {
  None = 'None', Available = 'Available', Ordered = 'Ordered', Sold = 'Sold', Canceled = 'Canceled'

}

export namespace ScItemStatus {
  export function toStatus(status: any) {
    switch (status) {
      case 1:
        return ScItemStatus.Available;
      case 2:
        return ScItemStatus.Ordered;
      case 3:
        return ScItemStatus.Sold;
      case 4:
        return ScItemStatus.Canceled;
      default:
        return ScItemStatus.None;
    }
  }
}

export class ScItem {
  hashId: any;
  price: number;
  seller: any;
  buyer: any;
  status: number;
  createdAt: number;
  soldAt: number;

// *** Custom code below this line *** //


}
