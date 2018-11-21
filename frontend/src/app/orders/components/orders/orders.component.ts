import {ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ContractService} from '../../../shared/services/contract.service';
import {map, mergeMap} from 'rxjs/operators';
import {forkJoin} from 'rxjs';
import {OrderStatus, ScOrder} from '../../../shared/model/sc-order';
import {DateTime} from 'luxon';
import {LoadingBarService} from '@ngx-loading-bar/core';
import {DateTimeUtil} from '../../../shared/utils/date-time-util';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersComponent implements OnInit {
  currentAccount: any;
  orders: ScOrder[];
  scOrderStatus = OrderStatus;
  orderStatus: any;
  contract: any;
  referenceId: any;
  dateTimeUtil = DateTimeUtil;
  headElements = ['Buyer', 'Delivery', 'Status', 'Order Time', 'Action'];

  constructor(private activatedRoute: ActivatedRoute,
              public contractService: ContractService,
              private ngZone: NgZone,
              private loadingBar: LoadingBarService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {

    this.contract = this.contractService.getContract();
    const data = this.activatedRoute.snapshot.data;
    this.currentAccount = data.currentAccount;
    this.loadOrders();

    // watch ReceivedItemEvent
    this.contract.ReceivedItemEvent().watch((error: any, result: any) => {
      if (error) {
        this.ngZone.run(() =>  this.loadingBar.complete());
        console.log('Error.');

      }
      if (result) {
        if (this.referenceId === result.args.hashId) {
          this.ngZone.run(() =>  this.loadingBar.complete());
          console.log('Received Order Success.');
        }
      }
    });
  }

  private loadOrders() {
    const observOfHashId = this.contractService.myBuyItems(this.currentAccount);

    const result = observOfHashId.pipe(
      mergeMap(hashes => forkJoin(
        hashes.map(hash => {
          return this.contractService.listOrders(hash).pipe(
            map(val => val.orders),
            map(val => val.length > 0 ? val[0] : null)
          );
        })
      ))
    );
    result.subscribe((orders: ScOrder[]) => {
      this.orders = orders.filter(order => {
        return order !== null;
      });
      this.ngZone.run(() => this.changeDetectorRef.markForCheck());
    });
  }

  toDate(datetime: string): any {
    return DateTime.fromMillis(+datetime * 1000);
  }

  orderTracking(order: ScOrder): void {
    this.orderStatus = this.scOrderStatus.toOrderStatus(order.orderStatus);
  }


  onReceive(itemHashId: any): void {
    // TODO: we need to listen ReceivedItemEvent to know whether the transaction is success or not
    this.referenceId = itemHashId;
    this.loadingBar.start();
    this.contractService.receiveItem(this.currentAccount, itemHashId);
  }
}
