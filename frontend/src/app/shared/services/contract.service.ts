/* tslint:disable */
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {NgxSpinnerService} from 'ngx-spinner';
import {Observable} from 'rxjs';

declare var require: any;
const ContractABI = require('../../../assets/contract/EbuyContract.json');
declare const window: any;
let ebuyContract: any;

@Injectable()
export class ContractService {
  private BREAK_LINE = '--LINE--' as string;

  constructor(private ngxSpinnerService: NgxSpinnerService) {
    const contract = window.web3.eth.contract(ContractABI);
    ebuyContract = contract.at(environment.contractAddress);
  }

  getContract() :any {
    return ebuyContract;
  }

  addItem = (account:any, ipfsId: any, price: number) => {
    ebuyContract.addItem(ipfsId, this.toWei(price), {from: account}, (err: any, success: any) => {
      console.log(err);
      console.log(success);
    });
  }

  orderItem = (account:any, ipfsId: any, contactDetail: string, amount:number) => {
    ebuyContract.orderItem(ipfsId, contactDetail, {from: account, value: this.toWei(amount)}, (err: any, success: any) => {
      console.log(err);
      console.log(success);
    });
  }

  /**
   * Seller chooses a delivery to send goods
   * @param ipfsId
   * @param  deliveryAddress address of delivery
   */

  sendItem = (account:any, ipfsId: any, deliveryAddress: any) => {
    ebuyContract.sendItem(ipfsId, deliveryAddress, {from: account}, (err: any, success: any) => {
      console.log(err);
      console.log(success);
    });
  }

  /**
   * Delivery update status of goods when sends goods to buyer
   * @param ipfsId
   */
  deliverItem = (account:any, ipfsId: any, deliveryAddress:any) => {
    ebuyContract.sendItem(ipfsId, deliveryAddress, {from: account}, (err: any, success: any) => {
      console.log(err);
      console.log(success);
    });
  }

  /**
   * Receiver confirm receiving goods, the balance will be moved to seller
   * @param ipfsId
   */
  receiveItem = (account:any, ipfsId: any) => {
    ebuyContract.receiveItem(ipfsId, {from: account}, (err: any, success: any) => {
      console.log(err);
      console.log(success);
    });
  }

  registerDelivery  = (account:any, ipfsId: any) => {
    ebuyContract.registerDelivery(ipfsId, {from: account}, (err: any, success: any) => {
      console.log(err);
      console.log(success);
    });
  }

  cancelOrder  = (account:any, ipfsId: any) => {
    ebuyContract.cancelOrder(ipfsId, {from: account}, (err: any, success: any) => {
      console.log(err);
      console.log(success);
    });
  }

  getDelivery(address: any): Observable<any> {
    return Observable.create((observe: any) => {
      ebuyContract.getDelivery.call(address, (err: any, result: any) => {

        if (err) {
          observe.error(err);
        } else {
          observe.next({address: result[0], status: result[1].toNumber(), hashId: result[2]});
        }
        observe.complete();
      });

    });
  }

  listDeliveries(): Observable<any> {

    return Observable.create((observe: any) => {
      ebuyContract.listDeliveries.call((err: any, result: any) => {

        if (err) {
          observe.error(err);
        } else {
          const deliveries = [] as any;
          for (let i = 0; i < result[0].length; i++) {
            const ids = result[2].split(this.BREAK_LINE);
            deliveries.push({
              address: result[0][i],
              status: result[1][i].toNumber(),
              hashId : ids[i + 1]
            });
          }
          observe.next(deliveries);
        }
        observe.complete();
      });
    });
  }

    mySellItems(account:any): Observable<any> {

    return Observable.create((observe: any)   => {

      ebuyContract.getItemsBySeller.call(account, (err: any, result: any) =>{
        if (err) {
          observe.error(err);
        } else {
          if (result.length > 0) {
            observe.next(result.split(this.BREAK_LINE));
          } else {
            observe.next([]);
          }
        }
        observe.complete();
      })
    });
  }
  myBuyItems(account:any): Observable<any> {
    console.log('ebuyContract', ebuyContract)
    return Observable.create((observe: any) => {
      ebuyContract.getItemsByBuyer.call(account, (err: any, result: any) =>{
        if (err) {
          observe.error(err);
        } else {
          if (result.length > 0) {
            observe.next(result.split(this.BREAK_LINE));
          } else {
            observe.next([]);
          }
        }
        observe.complete();
      })
    });
  }

   listItems(): Observable<any> {
    return Observable.create((observe: any) => {

      ebuyContract.listItems.call((err: any, result: any) => {
        const items = [] as  any;
        const itemIds = result[0].split(this.BREAK_LINE);

        for (let i = 0; i < result[1].length; i++) {
          items.push({
            hashId: itemIds[i + 1],
            price: result[1][i].toNumber(),
            seller: result[2][i],
            buyer: result[3][i] === '0x0000000000000000000000000000000000000000' ? '' : result[3][i],
            status: result[4][i].toNumber(),
            createdAt: result[5][i].toNumber(),
            soldAt: result[6][i].toNumber()
          });
        }
        if (err) {
          observe.error(err);
        }
        observe.next(items);
        observe.complete();
      });
    });
  }

  getItem(hashId:string): Observable<any> {

    return Observable.create((observe:any)=>{
       ebuyContract.getItem.call(hashId, (err:any,result:any)=>{
         let item = {hashId:result[0],
                 price:result[1].toNumber(),
                 seller: result[2],
                buyer: result[3] === '0x0000000000000000000000000000000000000000' ? '' : result[3],
                status: result[4].toNumber(),
                createdAt: result[5].toNumber(),
                soldAt: result[6].toNumber()
               };
         if(err) {
           observe.error(err);
         }
         observe.next(item);
         observe.complete();
       })
    })
  }
  listOrders(hashId: string): Observable<any> {
    return Observable.create((observe: any) => {

      ebuyContract.getOrderDetails.call(hashId, (err: any, result: any) => {
        const orderDetails = {seller: result[0], orders: [] as any};
        const receiverInfo = result[3].split(this.BREAK_LINE);
        const times = result[4].split(this.BREAK_LINE);
        const orderStatuses = result[5].split(this.BREAK_LINE);
        for (let i = 0; i < result[1].length; i++) {

          const orderTrackingTimes = times[i + 1].split('-BR-');
          orderDetails.orders.push({
            buyer: result[1][i],
            delivery: result[2][i],
            receiverContact: receiverInfo[i + 1],
            orderTime : orderTrackingTimes[0],
            deliveryTime : orderTrackingTimes[1],
            deliveredTime : orderTrackingTimes[2],
            closedTime: orderTrackingTimes[3],
            orderStatus: orderStatuses[i + 1]

          });
        }
        if (err) {
          observe.error(err);
        }

        observe.next(orderDetails);
        observe.complete();
      });
    });


  }
  toWei(ether:number){
    return window.web3.toWei(ether, 'ether');
  }
  toEther(wei:number) {
    return wei/1000000000000000000;
  }
  // listItems = async (): Promise<any> =>{
  //
  //   return ebuyContract.listItems.call((err:any, result:any)=>{
  //     console.log(err)
  //     console.log(result)
  //     let items = [] as  any;
  //     let itemIds = result[0].split(this.BREAK_LINE)
  //
  //     for(let i =0; i< result[1].length;i++) {
  //       items.push({'hashId': itemIds[i+1],
  //         'seller': result[1][i],
  //         'buyer': result[2][i],
  //         'status': result[3][i],
  //         'createdAt': result[4][i],
  //         'soldAt': result[5][i]
  //       });
  //     }
  //     return Promise.resolve(items);
  //   })
  // }
}
