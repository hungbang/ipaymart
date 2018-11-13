import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export class IpfsRestClient{
  constructor(private http: HttpClient) { }

  getFile(hashId: string, silent: boolean): Observable<any>{
    const domain = `https://ipfs.infura.io/ipfs/${hashId}`;
    return this.http.get(domain);
  }

}
