import { RouterModule, Routes } from '@angular/router';
import {NavigationBarComponent} from './components/navigation-bar.component';



const ROUTES: Routes = [
  {
    path: '', component: NavigationBarComponent
  }
];

export const ROUTING = RouterModule.forChild(ROUTES);
