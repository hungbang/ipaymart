import {RouterModule, Routes} from '@angular/router';
import {CarrierComponent} from './components/carrier/carrier.component';
import {MetaMaskAccountResolver} from '../shared/resolvers/MetaMaskAccountResolver';
import {CarriersComponent} from './components/carriers/carriers.component';
import {DeliveriesResolver} from '../shared/resolvers/DeliveriesResolver';


const ROUTES: Routes = [
  {
    path: ':id', component: CarrierComponent, resolve: {currentAccount: MetaMaskAccountResolver}
  },
  {
    path: 'account/:address', component: CarriersComponent, resolve: {deliveriesData: DeliveriesResolver}
  }
];

export const ROUTING = RouterModule.forChild(ROUTES);
