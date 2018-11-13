import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FileUploader} from 'ng2-file-upload';
import {Item} from '../../../shared/model/item';
import {IPFS} from '../../../ipfs';
import {ContractService} from '../../../shared/services/contract.service';
import {Web3Service} from '../../../shared/services/web3.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {Observable, Subject, Subscription} from 'rxjs';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemComponent implements OnInit {

  // TODO: [HBQ] got an error : Cannot read property 'options' of undefined when remove this field. have no idea.
  public uploader: FileUploader = new FileUploader({url: '', itemAlias: 'photo'});
  imageFiles: any[] = [];
  selectedAccount: any;
  contract: any;
  referenceHashId: any;
  spinnerObservable: Subject;
  created = false;
  processing = false;
  itemForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    price: new FormControl(''),
    images: new FormControl(''),
    category: new FormControl(''),
  });

  constructor(@Inject(IPFS) private ipfs,
              private contractService: ContractService,
              private web3Service: Web3Service,
              private spinner: NgxSpinnerService,
              private changeDetectorRef: ChangeDetectorRef) {
    this.spinnerObservable = this.spinner.spinnerObservable;
  }

  async ngOnInit() {
    this.web3Service.getSelectedAccount().subscribe((account: any) => {
      console.log('=======account=========', account);
      this.selectedAccount = account;
    });

    // this.spinnerA = Observable.create(obs => this.obs = obs);
    // this.spinnerA.subscribe(result => {
    //   alert('aaa');
    // })
    const version = await this.ipfs.version();
    console.log({version});

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
    };
    this.contract = this.contractService.getContract();

    // watch NewItemEvent
    this.contract.NewItemEvent().watch((error: any, result: any) => {
      if (error) {
        this.changeDetectorRef.markForCheck();
        alert('Cannot create your item.');

      }
      if (result) {
        if (this.referenceHashId === result.args.hashId) {
          console.log('this=============', this.referenceHashId);
          this.inserted();
        }
      }
    });
  }


  handleSelectedFiles(files: File[]): void {
    if (files) {
      for (const file of Object.values(files)) {
        console.log(file);
        const fileReader = new FileReader();
        fileReader.onload = () => {
          console.log(fileReader.result);
          this.imageFiles.push(fileReader.result);
          this.changeDetectorRef.markForCheck();
        };
        fileReader.readAsDataURL(file);
      }

    }
  }

  public async createItem() {
    const data: Item = this.itemForm.getRawValue();
    data.images = this.imageFiles;
    const filesAdded = await this.ipfs.files.add(new this.ipfs.types.Buffer(JSON.stringify(data)));
    this.referenceHashId = filesAdded[0].hash;
    this.creating();
    this.changeDetectorRef.markForCheck();
    this.contractService.addItem(this.selectedAccount, filesAdded[0].hash, data.price);

  }

  resetItemForm() {
    this.itemForm.reset();
    this.imageFiles = [];
  }

  private creating() {
    this.processing = true;
    this.created = false;
  }

  private inserted() {
    this.processing = false;
    this.created = true;
    this.itemForm.reset();
    this.changeDetectorRef.markForCheck();
  }
}
