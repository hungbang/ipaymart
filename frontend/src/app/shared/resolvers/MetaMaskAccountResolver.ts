import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {ScItem} from '../model/sc-item';
import {Observable} from 'rxjs';
import {Web3Service} from '../services/web3.service';
import {Injectable} from '@angular/core';

@Injectable()
export class MetaMaskAccountResolver implements Resolve<ScItem[]> {

  constructor(private web3Service: Web3Service) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ScItem[]> | Promise<ScItem[]> | ScItem[] {
    return this.web3Service.getSelectedAccount();
  }

}
