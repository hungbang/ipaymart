import { RouterModule, Routes } from '@angular/router';
import {CarrierComponent} from './components/carrier/carrier.component';
import {MetaMaskAccountResolver} from '../shared/resolvers/MetaMaskAccountResolver';



const ROUTES: Routes = [
  {
    path: ':id', component: CarrierComponent, resolve: {currentAccount: MetaMaskAccountResolver}
  }
];

export const ROUTING = RouterModule.forChild(ROUTES);
