import * as uuid from 'uuid';


export class Item {
  title: string;
  description: string;
  category: string;
  price: number;
  images: any[];
  hashId: any;
  ownerMetaMaskAddress: string;

// *** Custom code below this line *** //
  dummieId: any;

  getDummieId(): any {
    return uuid.v4();
  }
}
