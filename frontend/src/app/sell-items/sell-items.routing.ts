import {RouterModule, Routes} from '@angular/router';
import {SellItemsComponent} from './components/sell-items/sell-items.component';
import {MetaMaskAccountResolver} from '../shared/resolvers/MetaMaskAccountResolver';
import {ViewDetailItemComponent} from './components/view-detail-item/view-detail-item.component';


const ROUTES: Routes = [
  {
    path: '', component: SellItemsComponent, resolve: {currentAccount: MetaMaskAccountResolver}
  },
  {
    path: ':id', component: ViewDetailItemComponent, resolve: {currentAccount: MetaMaskAccountResolver}

  }
];

export const ROUTING = RouterModule.forChild(ROUTES);
