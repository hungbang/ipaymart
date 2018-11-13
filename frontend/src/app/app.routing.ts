import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', loadChildren: './home/home.module#HomeModule'},
  {path: 'items', loadChildren: './items/items.module#ItemsModule'}

];

export const ROUTING = RouterModule.forRoot(routes, {useHash: true});
