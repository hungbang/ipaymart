import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
declare const window: any;

@Injectable()
export class Web3Service {

  constructor() {
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
}
