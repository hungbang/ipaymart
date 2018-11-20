import {Inject, Injectable} from '@angular/core';
import {IPFS} from '../../ipfs';

@Injectable()
export class IpfsService {

  constructor(@Inject(IPFS) private ipfs) {
  }

  // public async set(path: string, value: string) {
  //   const content = Buffer.from(value);
  //   const filesAdded = await this.ipfs.files.add({path, content});
  //   this.hash = filesAdded[0].hash;
  // }
  //
  // public get(hash: string): Observable<string> {
  //
  //   return Observable.create(observe => {
  //     const data: Promise = this.ipfs.files.cat(hash);
  //     data.then(val => {
  //       console.log(val);
  //       if (val) {
  //         observe.next(data);
  //
  //       } else {
  //         observe.error('can not get data');
  //       }
  //     }).catch(
  //       observe.error('can not get data')
  //     );
  //
  //     observe.complete();
  //
  //   });
  // }


}
