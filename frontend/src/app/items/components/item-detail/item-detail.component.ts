import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Item} from '../../../shared/model/item';
import {ImagesUtil} from '../../../shared/utils/images-util';
import {ContractService} from '../../../shared/services/contract.service';
import {Web3Service} from '../../../shared/services/web3.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LoadingBarService} from '@ngx-loading-bar/core';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemDetailComponent implements OnInit {
  static ITEM_DETAIL = 'items';
  contract: any;

  canNotBuy = true;
  defaultImages = ImagesUtil.IMAGES;
  resolveData: any;
  @Input() item: Item;
  selectedAccount: any;
  referenceHashId: any;

  itemForm = new FormGroup({
    contactDetail: new FormControl('', Validators.required),
  });


  constructor(private activatedRoute: ActivatedRoute,
              private contractService: ContractService,
              private web3Service: Web3Service,
              private ngZone: NgZone,
              private route: Router,
              private changeDetectorRef: ChangeDetectorRef,
              private loadingBar: LoadingBarService) {
  }

  ngOnInit() {
    this.web3Service.getSelectedAccount().subscribe((account: any) => {
      console.log('=======account=========', account);
      this.selectedAccount = account;
      this.ngZone.run(() => {
        if (this.item.ownerMetaMaskAddress === this.selectedAccount) {
          this.canNotBuy = false;
          this.changeDetectorRef.markForCheck();
        }
      });
    });


    this.contract = this.contractService.getContract();

    // watch NewItemEvent
    this.contract.NewOrderEvent().watch((error: any, result: any) => {
      if (error) {
        alert('Cannot create your item.');

      }
      if (result) {
        if (this.referenceHashId === result.args.hashId) {
          this.ngZone.run(() => {
            this.loadingBar.complete();
            this.route.navigate([`orders`]);
          });
          console.log('Success');
        }
      }
    });

  }


  buyIt(): void {
    if (this.itemForm.invalid || this.item.ownerMetaMaskAddress === this.selectedAccount) {
      return;
    }
    const data = this.itemForm.getRawValue();
    this.referenceHashId = this.item.hashId;
    this.loadingBar.start();
    this.contractService.orderItem(this.selectedAccount, this.item.hashId, data.contactDetail, this.item.price);
  }
}
