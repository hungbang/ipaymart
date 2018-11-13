import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: 'home', loadChildren: 'app/home/home.module#HomeModule'},
  {path: '', redirectTo: 'home', pathMatch: 'full'}
];

export const ROUTING = RouterModule.forRoot(routes, {useHash: true});
