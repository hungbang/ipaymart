import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Item} from '../model/item';
import {Observable} from 'rxjs';
import {IpfsRestClient} from '../services/ipfs-rest-client';
import {Injectable} from '@angular/core';
import {tap} from 'rxjs/operators';

@Injectable()
export class ItemDetailResolver implements Resolve<Item> {

  constructor(private ipfsRestClient: IpfsRestClient) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Item> | Promise<Item> | Item {
    const hashId = route.paramMap.get('id');
    if (hashId !== 'new') {
      return this.ipfsRestClient.getFile(hashId).pipe(
        tap(value => value.hashId = hashId)
      );
    }
  }

}
