import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {ContractService} from '../services/contract.service';
import {Injectable} from '@angular/core';

@Injectable()
export class DeliveriesResolver implements Resolve<any> {

  constructor(private contractService: ContractService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    const currentAddress = route.paramMap.get('address');
    console.log('currentAddress===========', currentAddress);
    return this.contractService.listCarryingItems(currentAddress);
  }

}
