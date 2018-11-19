import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {ContractService} from '../services/contract.service';
import {Injectable} from '@angular/core';
import {filter, tap} from 'rxjs/operators';

@Injectable()
export class MySellItemsResolver implements Resolve<string[]> {
  constructor(private contractService: ContractService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.contractService.mySellItems(route.paramMap.get('id'));
  }

}
