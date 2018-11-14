import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ContractService} from '../../../shared/services/contract.service';
import {forkJoin, of} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {IpfsRestClient} from '../../../shared/services/ipfs-rest-client';
import {Item} from '../../../shared/model/item';
import {mergeMap, tap} from 'rxjs/operators';
import {ItemDetailComponent} from '../../../items/components/item-detail/item-detail.component';
import 'rxjs-compat/add/operator/map';

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

  constructor(private contractService: ContractService,
              private changeDetectorRef: ChangeDetectorRef,
              private activatedRoute: ActivatedRoute,
              private route: Router,
              private ipfsRestClient: IpfsRestClient) {
  }

  ngOnInit() {
    this.resolveData = this.activatedRoute.snapshot.data;
    this.loadItemFromIPFS(this.resolveData.data);
  }

  private loadItemFromIPFS(data: any[]) {
    of(data).pipe(
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
