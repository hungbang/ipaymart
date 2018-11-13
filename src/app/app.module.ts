import { BrowserModule } from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';

import { AppComponent } from './app.component';
import {ButtonsModule, CardsFreeModule, MDBBootstrapModule, WavesModule} from 'angular-bootstrap-md';
import {ROUTING} from './app.routing';
import { NavigationBarComponent } from './navigation-bar/components/navigation-bar.component';
import {SharedModule} from './shared/shared.module';


@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    ButtonsModule.forRoot(),
    WavesModule.forRoot(),
    CardsFreeModule.forRoot(),
    MDBBootstrapModule.forRoot(),
    ROUTING,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]

})
export class AppModule { }
