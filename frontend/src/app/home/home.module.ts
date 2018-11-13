import {NgModule} from '@angular/core';
import {HomeComponent} from './components/home/home.component';
import {ROUTING} from './home.routing';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ROUTING
  ],
  declarations: [
    HomeComponent
  ],
  providers: []
})
export class HomeModule {
}
