import {RouterModule, Routes} from '@angular/router';
import {SellItemsComponent} from './components/sell-items/sell-items.component';
import {MetaMaskAccountResolver} from '../shared/resolvers/MetaMaskAccountResolver';
import {ViewDetailItemComponent} from './components/view-detail-item/view-detail-item.component';
import {MySellItemsResolver} from '../shared/resolvers/my-sell-items-resolver';


const ROUTES: Routes = [
  {
    path: 'account/:id', component: SellItemsComponent, resolve: {hashIds: MySellItemsResolver}
  },
  {
    path: ':id', component: ViewDetailItemComponent, resolve: {currentAccount: MetaMaskAccountResolver}

  }
];

export const ROUTING = RouterModule.forChild(ROUTES);
