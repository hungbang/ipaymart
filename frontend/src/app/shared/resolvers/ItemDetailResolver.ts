import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Item} from '../model/item';
import {from, Observable} from 'rxjs';
import {IpfsRestClient} from '../services/ipfs-rest-client';
import {Inject, Injectable} from '@angular/core';
import {map, tap} from 'rxjs/operators';
import {IPFS} from '../../ipfs';

@Injectable()
export class ItemDetailResolver implements Resolve<Item> {

  constructor(private ipfsRestClient: IpfsRestClient, @Inject(IPFS) private ipfs,
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Item> | Promise<Item> | Item {
    const hashId = route.paramMap.get('id');
    if (hashId !== 'new') {
      return from(this.ipfs.files.cat(hashId)).pipe(
        map(value => JSON.parse(value.toString())),
        tap(value => value.hashId = hashId)
      );
    }
  }

}
