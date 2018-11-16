import {RouterModule, Routes} from '@angular/router';
import {ScItemResolver} from './shared/resolvers/ScItemResolver';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', loadChildren: './home/home.module#HomeModule', resolve: {data: ScItemResolver}},
  {path: 'items', loadChildren: './items/items.module#ItemsModule'},
  {path: 'orders', loadChildren: './orders/orders.module#OrdersModule'},
  {path: 'sell-items', loadChildren: './sell-items/sell-items.module#SellItemsModule'},
  {path: 'carriers', loadChildren: './carriers/carriers.module#CarriersModule'}
];

export const ROUTING = RouterModule.forRoot(routes, {useHash: true});
