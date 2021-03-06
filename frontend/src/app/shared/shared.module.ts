import {ModuleWithProviders, NgModule} from '@angular/core';
import {
  ButtonsModule,
  CardsFreeModule,
  CarouselModule,
  InputsModule,
  MDBBootstrapModule,
  ModalModule,
  TableModule,
  WavesModule
} from 'angular-bootstrap-md';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FileSelectDirective, FileUploadModule} from 'ng2-file-upload';
import {ContractService} from './services/contract.service';
import {Web3Service} from './services/web3.service';
import {HttpClientModule} from '@angular/common/http';
import {NgxSpinnerModule} from 'ngx-spinner';
import {ScItemResolver} from './resolvers/ScItemResolver';
import {IpfsRestClient} from './services/ipfs-rest-client';
import {ItemDetailResolver} from './resolvers/ItemDetailResolver';
import {MetaMaskAccountResolver} from './resolvers/MetaMaskAccountResolver';
import {NgSelectModule} from '@ng-select/ng-select';
import {CommonModule} from '@angular/common';
import {MatProgressBarModule, MatStepperModule} from '@angular/material';
import {HttpErrorHandler} from './services/http-error-handler';
import {MySellItemsResolver} from './resolvers/my-sell-items-resolver';
import {DeliveriesResolver} from './resolvers/DeliveriesResolver';
import {IpfsService} from './services/ipfs.service';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { ToastrModule } from 'ngx-toastr';
import { StorageServiceModule } from 'angular-webstorage-service';



/**
 * Make sure that we should only
 1. import `modules` and not the `components` or `services`
 2. declare `components` and not the `modules or services`.
 3. provide `services` and not `components or modules`.
 */

@NgModule({
  imports: [
    MDBBootstrapModule.forRoot(),
    ButtonsModule.forRoot(),
    WavesModule.forRoot(),
    CardsFreeModule.forRoot(),
    InputsModule.forRoot(),
    CarouselModule.forRoot(),
    TableModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    ModalModule.forRoot(),
    NgSelectModule,
    CommonModule,
    MatStepperModule,
    LoadingBarModule.forRoot(),
    MatProgressBarModule,
    FileUploadModule,
    // BrowserAnimationsModule,
    ToastrModule.forRoot(),
    StorageServiceModule
  ],
  declarations: [
    // Components
    //  Modals

    // Directives
    // FileSelectDirective

  ],
  exports: [
    // Modules
    MDBBootstrapModule,
    ModalModule,
    ButtonsModule,
    WavesModule,
    CardsFreeModule,
    FormsModule,
    ReactiveFormsModule,
    CarouselModule,
    InputsModule,
    HttpClientModule,
    NgxSpinnerModule,
    TableModule,
    NgSelectModule,
    CommonModule,
    MatStepperModule,
    LoadingBarModule,
    MatProgressBarModule,
    FileUploadModule,
    // BrowserAnimationsModule,
    ToastrModule,
    StorageServiceModule,
    // Components

    // Directives
    // FileSelectDirective
    // Pipes

  ],
  entryComponents: [

      ],
  providers: [
    DeliveriesResolver,
    MySellItemsResolver,
    MetaMaskAccountResolver,
    ItemDetailResolver,
    ScItemResolver,
    ContractService,
    IpfsService,
    Web3Service,
    IpfsRestClient,
    HttpErrorHandler
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
