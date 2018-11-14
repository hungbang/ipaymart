import {RouterModule, Routes} from '@angular/router';
import {ItemsComponent} from './components/items/items.component';
import {ItemComponent} from './components/item/item.component';
import {ItemDetailResolver} from '../shared/resolvers/ItemDetailResolver';


const ROUTES: Routes = [
  {
    path: '', component: ItemsComponent
  }, {
    path: ':id', component: ItemComponent, resolve: {itemData: ItemDetailResolver}
  }
];

export const ROUTING = RouterModule.forChild(ROUTES);
