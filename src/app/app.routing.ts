import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', loadChildren: './home/home.module#HomeModule'},
  // {path: 'home', loadChildren: './home/home.module#HomeModule'},

];

export const ROUTING = RouterModule.forRoot(routes, {useHash: true});
