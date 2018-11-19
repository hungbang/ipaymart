import {ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ContractService} from '../../../shared/services/contract.service';
import {forkJoin, of} from 'rxjs';
import {mergeMap} from 'rxjs/operators';
import {ScItem, ScItemStatus} from '../../../shared/model/sc-item';
import {Carrier} from '../../../shared/model/carrier';
import {CarrierStatus} from '../../../shared/model/carrier-status';
import {OrderStatus} from '../../../shared/model/sc-order';

export class ItemDetailVO {
  receiver: any;
  seller: any;
  contactDetail: any;
  delivery: any;
  orderStatus: any;
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

  headElements = ['Item Hash', 'Price', 'Status', 'Action'];
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

  constructor(private activatedRoute: ActivatedRoute,
              private changeDetectorRef: ChangeDetectorRef,
              private ngZone: NgZone,
              public contractService: ContractService) {

  }

  ngOnInit() {
    const data = this.activatedRoute.snapshot.data;
    console.log(data);
    console.log(data.hashIds);

    this.contract = this.contractService.getContract();
    this.loadScItems(data.hashIds);
    this.contractService.listDeliveries().subscribe((carriers: Carrier[]) => {
      this.carriers = [...this.carriers, ...carriers];
      this.changeDetectorRef.markForCheck();
    });

    this.contract.ItemSentEvent().watch((err: any, result: any) => {
      console.log(result);
      if (result.args.hashId === this.referenceId) {
        alert('Success');
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
        this.itemDetail = {
          receiver: data.orders[lastOrder].buyer,
          seller: data.seller,
          contactDetail: data.orders[lastOrder].receiverContact,
          delivery: data.orders.currentAccount,
          orderStatus: data.orders[lastOrder].orderStatus
        };
        this.changeDetectorRef.markForCheck();
      } else {
        this.itemDetail = {
          receiver: 'None',
          seller: data.seller,
          contactDetail: 'None',
          delivery: 'None',
          orderStatus: null
        };
        this.changeDetectorRef.markForCheck();
      }
    });
  }


  saveDelivery(hashId: any): void {
    // TODO: we need to watch ItemSentEvent to confirm whether transaction success or not.
    this.referenceId = hashId;
    this.contractService.sendItem(this.currentAccount, hashId, this.selectedCarrier);
  }
}
