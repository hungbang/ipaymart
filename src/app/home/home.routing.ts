import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './components/home/home.component';



const ROUTES: Routes = [
  {
    path: '', component: HomeComponent
  }
];

export const ROUTING = RouterModule.forChild(ROUTES);
