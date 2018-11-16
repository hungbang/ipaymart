import {ChangeDetectorRef, Component, Inject, NgZone, OnInit} from '@angular/core';
import {FileUploader} from 'ng2-file-upload';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {IPFS} from '../../../ipfs';
import {ContractService} from '../../../shared/services/contract.service';
import {Web3Service} from '../../../shared/services/web3.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {Item} from '../../../shared/model/item';

@Component({
  selector: 'app-item-properties',
  templateUrl: './item-properties.component.html',
  styleUrls: ['./item-properties.component.scss']
})
export class ItemPropertiesComponent implements OnInit {

// TODO: [HBQ] got an error : Cannot read property 'options' of undefined when remove this field. have no idea.
  public uploader: FileUploader = new FileUploader({url: '', itemAlias: 'photo'});
  imageFiles: any[] = [];
  selectedAccount: any;
  contract: any;
  referenceHashId: any;
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
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private spinner: NgxSpinnerService,
              private changeDetectorRef: ChangeDetectorRef,
              private ngZone: NgZone) {
  }

  async ngOnInit() {

    this.web3Service.getSelectedAccount().subscribe((account: any) => {
      console.log('=======account=========', account);
      this.selectedAccount = account;
    });


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
          alert('Success');
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
    if (this.itemForm.invalid) {
      return;
    }
    const data: Item = this.itemForm.getRawValue();
    data.images = this.imageFiles;
    const filesAdded = await this.ipfs.files.add(new this.ipfs.types.Buffer(JSON.stringify(data)));
    this.referenceHashId = filesAdded[0].hash;
    this.changeDetectorRef.markForCheck();
    this.contractService.addItem(this.selectedAccount, filesAdded[0].hash, data.price);

  }

  resetItemForm() {
    this.itemForm.reset();
    this.imageFiles = [];
  }

}
