import {Inject, Injectable} from '@angular/core';
import {IPFS} from '../../ipfs';
import { Buffer } from 'buffer';

@Injectable()
export class IpfsService {

  constructor(@Inject(IPFS) private ipfs) {}

  // public async set(path: string, value: string) {
  //   const content = Buffer.from(value);
  //   const filesAdded = await this.ipfs.files.add({path, content});
  //   this.hash = filesAdded[0].hash;
  // }
  //
  // public async get(hash: string) {
  //   const fileBuffer = await this.ipfs.files.cat(hash);
  //   console.log(fileBuffer.toString());
  // }


}
