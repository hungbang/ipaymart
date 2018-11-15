import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {IPFS} from '../../ipfs';

@Injectable()
export class IpfsRestClient {
  constructor(private http: HttpClient, @Inject(IPFS) private ipfs) {
  }

  getFile(hashId: string): Observable<any> {
    const domain = `https://gateway.ipfs.io/ipfs/${hashId}`;
    // const domain = `https://ipfs.infura.io/ipfs/${hashId}`;
    return this.http.get(domain);
  }

}
