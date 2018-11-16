import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {ROUTING} from './sell-items.routing';
import {SellItemsComponent} from './components/sell-items/sell-items.component';
import { ViewDetailItemComponent } from './components/view-detail-item/view-detail-item.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ROUTING
  ],
  declarations: [

    SellItemsComponent,

    ViewDetailItemComponent
  ],
  providers: []
})
export class SellItemsModule {
}
