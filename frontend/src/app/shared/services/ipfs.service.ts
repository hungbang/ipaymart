import {Inject, Injectable} from '@angular/core';
import {IPFS} from '../../ipfs';
import {SESSION_STORAGE, StorageService} from 'angular-webstorage-service';


const STORAGE_KEY = 'local_data';


@Injectable()
export class IpfsService {

  datas: any[] = [];

  constructor(@Inject(IPFS) private ipfs, @Inject(SESSION_STORAGE) private storage: StorageService) {
  }

  public async sync(hash: any) {
    console.log('hash====', hash);
    const file = await this.ipfs.files.cat(hash);
    console.log('========', file.toString());
    this.datas = this.storage.get(STORAGE_KEY) || [];
    const newDatas = [file.toString()];
    this.datas = [this.datas, ...newDatas];
    this.storage.set(STORAGE_KEY, this.datas);
  }

  public getFiles(items: any[]): any[] {
    items.forEach(item =>
      this.sync(item.hashId)
    );
    return this.storage.get(STORAGE_KEY);
  }


}
