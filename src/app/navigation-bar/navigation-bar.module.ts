import {NgModule} from '@angular/core';
import {ROUTING} from './navigation-bar.routing';
import {NavigationBarComponent} from './components/navigation-bar.component';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    ROUTING
  ],
  declarations: [
    NavigationBarComponent
  ],
  providers: []
})
export class NavigationBarModule {
}
