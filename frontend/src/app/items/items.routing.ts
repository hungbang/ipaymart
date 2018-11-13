import { RouterModule, Routes } from '@angular/router';
import {ItemsComponent} from './components/items/items.component';
import {ItemComponent} from './components/item/item.component';



const ROUTES: Routes = [
  {
    path: '', component: ItemsComponent
  },{
    path: ':id', component: ItemComponent
  }
];

export const ROUTING = RouterModule.forChild(ROUTES);
