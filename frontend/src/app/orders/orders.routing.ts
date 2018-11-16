import {RouterModule, Routes} from '@angular/router';
import {OrderComponent} from './components/order/order.component';
import {OrdersComponent} from './components/orders/orders.component';
import {MetaMaskAccountResolver} from '../shared/resolvers/MetaMaskAccountResolver';


const ROUTES: Routes = [
  {
    path: '', component: OrdersComponent, resolve: {currentAccount: MetaMaskAccountResolver}
  },
  {
    path: ':id', component: OrderComponent
  }
];

export const ROUTING = RouterModule.forChild(ROUTES);
