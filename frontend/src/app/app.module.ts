import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';

import {AppComponent} from './app.component';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {ROUTING} from './app.routing';
import {NavigationBarComponent} from './navigation-bar/components/navigation-bar.component';
import {SharedModule} from './shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import {initIPFS, IPFS} from './ipfs';


@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent
  ],
  imports: [
    BrowserModule,
    MDBBootstrapModule.forRoot(),
    SharedModule,
    ROUTING,
    ReactiveFormsModule
  ],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: initIPFS,
    multi: true,
    deps: [IPFS]
  }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]

})
export class AppModule { }
