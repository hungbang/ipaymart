import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {ContractService} from '../services/contract.service';
import {Injectable} from '@angular/core';
import {ScItem} from '../model/sc-item';

@Injectable()
export class ScItemResolver implements Resolve<ScItem[]> {

  constructor(private constractService: ContractService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ScItem[]> | Promise<ScItem[]> | ScItem[] {
    return this.constractService.listItems();
  }

}
