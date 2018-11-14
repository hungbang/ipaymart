import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ContractService} from '../../../shared/services/contract.service';
import {forkJoin, Observable, of} from 'rxjs';
import {ScItem} from '../../../shared/model/ScItem';
import {ActivatedRoute} from '@angular/router';
import {IpfsRestClient} from '../../../shared/services/ipfs-rest-client';
import {Item} from '../../../shared/model/item';
import {mergeMap} from 'rxjs/operators';

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
              private ipfsRestClient: IpfsRestClient) {
  }

  ngOnInit() {
    this.resolveData = this.activatedRoute.snapshot.data;
    this.loadItemFromIPFS(this.resolveData.data);
  }

  private loadItemFromIPFS(data: any[]) {
     of(data).pipe(
      mergeMap(items =>  forkJoin(
        items.map(item =>  this.ipfsRestClient.getFile(item.hashId))
      ))
    ).subscribe(value => {
       this.items = value;
       this.changeDetectorRef.markForCheck();
     });
  }
}
