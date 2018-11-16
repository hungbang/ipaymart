import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import { CarrierComponent } from './components/carrier/carrier.component';
import {ROUTING} from './carriers.routing';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ROUTING
  ],
  declarations: [

  CarrierComponent],
  providers: []
})
export class CarriersModule {
}
