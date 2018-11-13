import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {ROUTING} from './items.routing';
import { ItemsComponent } from './components/items/items.component';
import { ItemComponent } from './components/item/item.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ROUTING
  ],
  declarations: [

  ItemsComponent,

  ItemComponent],
  providers: []
})
export class ItemsModule {
}
