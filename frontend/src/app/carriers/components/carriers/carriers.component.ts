import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CarryingItem} from '../../../shared/model/carrying-item';
import {CarrierStatus} from '../../../shared/model/carrier-status';
import {ContractService} from '../../../shared/services/contract.service';
import {Web3Service} from '../../../shared/services/web3.service';

@Component({
  selector: 'app-carriers',
  templateUrl: './carriers.component.html',
  styleUrls: ['./carriers.component.scss']
})
export class CarriersComponent implements OnInit {


  carryingItems: CarryingItem[] = [];
  carrierStatus = CarrierStatus;
  currentAccount: any;

  constructor(private router: ActivatedRoute, private contractService: ContractService, private web3Service: Web3Service) {
  }

  ngOnInit() {
    this.carryingItems = this.router.snapshot.data.deliveriesData;
    console.log(this.carryingItems);
    this.web3Service.getSelectedAccount().subscribe(account => {
      this.currentAccount = account;
    });
  }


  onDelivered(hashId: any): void {
    console.log(hashId);
    this.contractService.deliverItem(this.currentAccount, hashId);
  }
}
