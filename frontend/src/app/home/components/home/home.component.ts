import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ContractService} from '../../../shared/services/contract.service';
import {forkJoin, of} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {IpfsRestClient} from '../../../shared/services/ipfs-rest-client';
import {Item} from '../../../shared/model/item';
import {mergeMap, tap} from 'rxjs/operators';
import {ItemDetailComponent} from '../../../items/components/item-detail/item-detail.component';
import {ScItem} from '../../../shared/model/sc-item';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

  items: Item[] = [];
  resolveData: any;
  imageDefault = 'https://mdbootstrap.com/img/Photos/Others/images/16.jpg';
  scItems: ScItem[] = [];
  constructor(private contractService: ContractService,
              private changeDetectorRef: ChangeDetectorRef,
              private activatedRoute: ActivatedRoute,
              private route: Router,
              private ipfsRestClient: IpfsRestClient) {
  }

  ngOnInit() {
    this.resolveData = this.activatedRoute.snapshot.data;
    console.log(this.resolveData);
    this.scItems = this.resolveData.data;
    this.loadItemFromIPFS();
  }

  private loadItemFromIPFS() {
    // [HBQ] to intercept too much request to ipfs server. to avoid `HttpStatus 429 - Too many request` for demo purpose
    const latest = this.scItems.slice(this.scItems.length - 10, this.scItems.length - 1);
    /**
     * @link{https://www.learnrxjs.io/operators/combination/forkjoin.html}
     * Be aware that if any of the inner observables supplied to forkJoin error you will lose
     * the value of any other observables that would or have already completed
     * if you do not catch the error correctly on the inner observable.
     * If you are only concerned with all inner observables completing successfully you can catch the error on the outside.
     */
    of(latest).pipe(
      mergeMap(items => forkJoin(
        items.map(item => {
          return this.ipfsRestClient.getFile(item.hashId).pipe(
            tap(value => value.hashId = item.hashId)
          );
        })
      ))
    ).subscribe(values => {
      console.log(values);
      this.items = values;
      this.changeDetectorRef.markForCheck();
    });
  }

  viewDetail(hashId: any): void {
    this.route.navigate([`${ItemDetailComponent.ITEM_DETAIL}/${hashId}`]);
  }
}
