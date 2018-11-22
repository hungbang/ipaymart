import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, NgZone, OnInit, ViewContainerRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ContractService} from '../../../shared/services/contract.service';
import {forkJoin, from, of} from 'rxjs';
import {map, mergeMap, tap} from 'rxjs/operators';
import {ScItem, ScItemStatus} from '../../../shared/model/sc-item';
import {Carrier} from '../../../shared/model/carrier';
import {CarrierStatus} from '../../../shared/model/carrier-status';
import {OrderStatus} from '../../../shared/model/sc-order';
import {IpfsService} from '../../../shared/services/ipfs.service';
import {IPFS} from '../../../ipfs';
import {Web3Service} from '../../../shared/services/web3.service';
import {DateTimeUtil} from '../../../shared/utils/date-time-util';
import {LoadingBarService} from '@ngx-loading-bar/core';
import {ToastrService} from 'ngx-toastr';

export class ItemDetailVO {
  receiver: any;
  seller: any;
  contactDetail: any;
  delivery: any;
  orderStatus: number;
}


export class CarrierOption {
  address: string;
  name: string;
}

@Component({
  selector: 'app-sell-items',
  templateUrl: './sell-items.component.html',
  styleUrls: ['./sell-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SellItemsComponent implements OnInit {
  currentAccount: any;
  scItems: ScItem[] = [];
  scItemStatus = ScItemStatus;
  orderStatus = OrderStatus;
  contactDetail: any;
  itemDetail: ItemDetailVO = new ItemDetailVO();
  carrierOptions: CarrierOption[] = [];
  dateTimeUtil = DateTimeUtil;
  headElements = ['Item Hash', 'Price', 'Status', 'Created At', 'Action'];
  carriers: Carrier[] = [
    {
      hashId: 'QmdwbN4HypYhHwXZpjyLqEJsy38PK1tqDnPj2k2VLadBQr',
      address: this.currentAccount,
      status: CarrierStatus.None
    }
  ];
  selectedCarrier = 'QmdwbN4HypYhHwXZpjyLqEJsy38PK1tqDnPj2k2VLadBQr';
  contract: any;
  referenceId: any;

  constructor(@Inject(IPFS) private ipfs,
              private activatedRoute: ActivatedRoute,
              private changeDetectorRef: ChangeDetectorRef,
              private ipfsService: IpfsService,
              private ngZone: NgZone,
              public toastr: ToastrService,
              private loadingBar: LoadingBarService,
              private web3Service: Web3Service,
              public contractService: ContractService) {

  }

  ngOnInit() {
    const data = this.activatedRoute.snapshot.data;
    this.contract = this.contractService.getContract();
    this.loadScItems(data.hashIds);
    this.contractService.listDeliveries().subscribe((carriers: Carrier[]) => {
      this.loadCarriers(carriers);
      this.carriers = [...this.carriers, ...carriers];
      this.changeDetectorRef.markForCheck();
    });

    this.web3Service.getSelectedAccount().subscribe(account => {
      this.currentAccount = account;
    });

    this.contract.ItemSentEvent().watch((err: any, result: any) => {
      if (err) {
        this.ngZone.run(() => {
          this.loadingBar.complete();
          this.toastr.error('Error occurs when delivery your item', 'Oops');
        });
      }
      console.log(result);
      if (result.args.hashId === this.referenceId) {
        this.ngZone.run(() => {
          this.loadingBar.complete();
          this.toastr.success('The item has been shipped.', 'Success');
        });
      }
    });
  }


  private loadScItems(hashIds: any[]) {

    of(hashIds).pipe(
      mergeMap(hashes => forkJoin(
        hashes.map(hash => {
          return this.contractService.getItem(hash);
        })
      ))
    ).subscribe((value: ScItem[]) => {
      this.scItems = [...this.scItems, ...value];
      // [HBQ] workaround to markForCheck
      this.ngZone.run(() => this.changeDetectorRef.markForCheck());
    });
  }

  viewDetail(hashId: any): void {

  }

  onOpen(hashId: any): void {
    this.itemDetail = new ItemDetailVO();
    this.contractService.listOrders(hashId).subscribe(data => {
      const lastOrder = data.orders.length - 1;
      if (lastOrder >= 0) {
        console.log(data.orders[lastOrder].orderStatus);
        this.itemDetail = {
          receiver: data.orders[lastOrder].buyer,
          seller: data.seller,
          contactDetail: data.orders[lastOrder].receiverContact,
          delivery: data.orders.currentAccount,
          orderStatus: data.orders[lastOrder].orderStatus
        };
        this.ngZone.run(() => this.changeDetectorRef.markForCheck());
      } else {
        this.itemDetail = {
          receiver: 'None',
          seller: data.seller,
          contactDetail: 'None',
          delivery: 'None',
          orderStatus: null
        };
        this.ngZone.run(() => this.changeDetectorRef.markForCheck());
      }
    });
  }


  saveDelivery(hashId: any): void {
    console.log(this.selectedCarrier);
    console.log(this.currentAccount);
    console.log(hashId);
    const carrier = this.carriers.filter(val => val.hashId === this.selectedCarrier)[0];
    // TODO: we need to watch ItemSentEvent to confirm whether transaction success or not.
    this.referenceId = hashId;
    this.loadingBar.start();
    this.contractService.sendItem(this.currentAccount, hashId, carrier.address);
  }

  private loadCarriers(carriers: Carrier[]): void {
    of(carriers.map(value => value.hashId)).pipe(
      mergeMap(hashes => forkJoin(
        hashes.map(hash => {
          return from(this.ipfs.files.cat(hash)).pipe(
            tap(val => console.log(val)),
            map(val => {
              const carrierOption = {address: hash, name: JSON.parse(val.toString()).name};
              return carrierOption;
            })
          );
        })
      ))
    ).subscribe(value => {
      this.carrierOptions = [...this.carrierOptions, ...value];
      this.ngZone.run(() => this.changeDetectorRef.markForCheck());
    });
  }

  toDetailData(hashId: string): any {
    return `https://gateway.ipfs.io/ipfs/${hashId}`;
  }
}
