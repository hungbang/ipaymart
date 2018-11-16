import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {ROUTING} from './orders.routing';
import {OrderComponent} from './components/order/order.component';
import {OrdersComponent} from './components/orders/orders.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ROUTING
  ],
  declarations: [


    OrderComponent,


    OrdersComponent],
  providers: []
})
export class OrdersModule {
}
