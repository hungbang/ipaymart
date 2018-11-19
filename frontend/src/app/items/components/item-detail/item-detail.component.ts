import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Item} from '../../../shared/model/item';
import {ImagesUtil} from '../../../shared/utils/images-util';
import {ContractService} from '../../../shared/services/contract.service';
import {Web3Service} from '../../../shared/services/web3.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent implements OnInit {
  static ITEM_DETAIL = 'items';
  contract: any;


  defaultImages = ImagesUtil.IMAGES;
  resolveData: any;
  @Input() item: Item;
  selectedAccount: any;
  referenceHashId: any;

  itemForm = new FormGroup({
    contactDetail: new FormControl('', Validators.required),
  });


  constructor(private activatedRoute: ActivatedRoute, private contractService: ContractService, private web3Service: Web3Service) {
  }

  ngOnInit() {
    this.web3Service.getSelectedAccount().subscribe((account: any) => {
      console.log('=======account=========', account);
      this.selectedAccount = account;
    });


    this.contract = this.contractService.getContract();

    // watch NewItemEvent
    this.contract.NewOrderEvent().watch((error: any, result: any) => {
      if (error) {
        alert('Cannot create your item.');

      }
      if (result) {
        if (this.referenceHashId === result.args.hashId) {
          alert('Success');
        }
      }
    });

  }


  buyIt(): void {
    if (this.itemForm.invalid) {
      return;
    }
    const data = this.itemForm.getRawValue();
    this.referenceHashId = this.item.hashId;
    this.contractService.orderItem(this.selectedAccount, this.item.hashId, data.contactDetail, this.item.price);
  }
}
