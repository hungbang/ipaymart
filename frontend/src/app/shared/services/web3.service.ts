import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

declare const window: any;

@Injectable()
export class Web3Service {

  constructor() {
  }

  toWei(ether: number): number {
    return window.web3.toWei(ether, 'ether');
  }

  toEther(wei: number): any {
    const eth = wei / 1000000000000000000;
    return eth.toPrecision(6);
  }


  getSelectedAccount(): Observable<any> {
    return Observable.create((ob: any) => {
      window.web3.eth.getAccounts((err: any, accounts: any) => {
        if (err) {
          ob.error(err);
        }
        ob.next(accounts[0]);
        ob.complete();
      });
    });
  }

  getBalanceByAccount(account: any): Observable<any> {
    return Observable.create(observer => {
      window.web3.eth.getBalance(account, (err, balance) => {
        if (err) {
          observer.error(err);
        }
        observer.next(this.toEther(balance));
        observer.complete();
      });
    });
  }
}
