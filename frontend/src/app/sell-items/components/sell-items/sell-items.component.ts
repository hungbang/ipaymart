import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ContractService} from '../../../shared/services/contract.service';
import {forkJoin} from 'rxjs';
import {mergeMap, tap} from 'rxjs/operators';
import {ScItem, ScItemStatus} from '../../../shared/model/sc-item';
import {Carrier} from '../../../shared/model/carrier';
import {CarrierStatus} from '../../../shared/model/carrier-status';

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
  defaultCarrier: Carrier;
  constructor(private activatedRoute: ActivatedRoute,
              private changeDetectorRef: ChangeDetectorRef,
              public contractService: ContractService) {
  }

  ngOnInit() {
    const data = this.activatedRoute.snapshot.data;
    console.log(data);
    this.currentAccount = data.currentAccount;

    this.contract = this.contractService.getContract();
    this.loadScItems();
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


  private async loadScItems() {
    const observOfHashId = await this.contractService.mySellItems(this.currentAccount);

    const results = observOfHashId.pipe(
      mergeMap(hashes => forkJoin(
        hashes.map(hash => {
          return this.contractService.getItem(hash).pipe(
            tap(val => console.log(val))
          );
        })
      ))
    );

    results.subscribe((value: ScItem[]) => {
      this.scItems = [...this.scItems, ...value];
      this.changeDetectorRef.markForCheck();
      console.log(this.scItems);
    });
  }

  viewDetail(hashId: any): void {

  }

  onOpen(hashId: any): void {
    this.itemDetail = new ItemDetailVO();
    this.contractService.listOrders(hashId).subscribe(data => {
      console.log(data);
      if (data.orders.length > 0) {
        this.itemDetail = {
          receiver: data.orders[0].buyer,
          seller: data.seller,
          contactDetail: data.orders[0].receiverContact,
          delivery: data.orders.currentAccount,
          orderStatus: data.orders[0].orderStatus
        };
        this.changeDetectorRef.markForCheck();
      } else {
        this.itemDetail = {
          receiver: 'None',
          seller: this.currentAccount,
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
