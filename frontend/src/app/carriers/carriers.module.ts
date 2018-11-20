import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import { CarrierComponent } from './components/carrier/carrier.component';
import {ROUTING} from './carriers.routing';
import { CarriersComponent } from './components/carriers/carriers.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ROUTING
  ],
  declarations: [

  CarrierComponent,

  CarriersComponent],
  providers: []
})
export class CarriersModule {
}
