import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {IPFS} from '../../ipfs';
import {catchError, tap, timeout} from 'rxjs/operators';

@Injectable()
export class IpfsRestClient {
  constructor(private http: HttpClient, @Inject(IPFS) private ipfs) {

  }

  private handleError(operation: String) {
    return (err: any) => {
      const errMsg = `error in ${operation}() retrieving data from IPFS`;
      console.log(`${errMsg}:`, err);
      if (err instanceof HttpErrorResponse) {
        // you could extract more info about the error if you want, e.g.:
        console.log(`status: ${err.status}, ${err.statusText}`);
        // errMsg = ...
      }
      return Observable.throw(errMsg);
    };
  }

  getFile(hashId: string): Observable<any> {
    console.log('hashId====================', hashId);
    const domain = `https://gateway.ipfs.io/ipfs/${hashId}`;
    return this.http.get(domain)
      .pipe(
        timeout(10000),
        tap(data => console.log('server data:', data)),
        catchError(this.handleError('getData'))
      );
  }

}
