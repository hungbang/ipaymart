import {ModuleWithProviders, NgModule} from '@angular/core';
import {ButtonsModule, CardsFreeModule, MDBBootstrapModule} from 'angular-bootstrap-md';


/**
 * Make sure that we should only
 1. import `modules` and not the `components` or `services`
 2. declare `components` and not the `modules or services`.
 3. provide `services` and not `components or modules`.
 */

@NgModule({
  imports: [
    ButtonsModule.forRoot(),
    CardsFreeModule.forRoot(),
    MDBBootstrapModule.forRoot(),
  ],
  declarations: [
    // Components
    //  Modals

    // Directives

  ],
  exports: [
    // Modules
    MDBBootstrapModule,
    ButtonsModule,
    CardsFreeModule
    // Components

    // Directives

    // Pipes

  ],
  entryComponents: [

      ],
  providers: [
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }

}
