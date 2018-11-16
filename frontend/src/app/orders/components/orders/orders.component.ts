import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ContractService} from '../../../shared/services/contract.service';
import {map, mergeMap, tap} from 'rxjs/operators';
import {forkJoin} from 'rxjs';
import {OrderStatus, ScOrder} from '../../../shared/model/sc-order';
import {DateTime} from 'luxon';

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
  headElements = ['Buyer', 'Delivery', 'Status', 'Order Time', 'Action'];

  constructor(private activatedRoute: ActivatedRoute,
              public contractService: ContractService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    const data = this.activatedRoute.snapshot.data;
    console.log(data);
    this.currentAccount = data.currentAccount;
    this.loadOrders();
  }

  private async loadOrders() {
    const observOfHashId = await this.contractService.myBuyItems(this.currentAccount);

    const result = observOfHashId.pipe(
      mergeMap(hashes => forkJoin(
        hashes.map(hash => {
          return this.contractService.listOrders(hash).pipe(
            tap(val => console.log(val)),
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
      this.changeDetectorRef.markForCheck();
    });
  }

  toDate(datetime: string): any {
    return DateTime.fromMillis(+datetime * 1000);
  }

  orderTracking(order: ScOrder): void {
    this.orderStatus = this.scOrderStatus.toOrderStatus(order.orderStatus);
  }

}
