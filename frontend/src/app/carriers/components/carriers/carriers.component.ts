import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CarryingItem} from '../../../shared/model/carrying-item';
import {ContractService} from '../../../shared/services/contract.service';
import {Web3Service} from '../../../shared/services/web3.service';
import {OrderStatus} from '../../../shared/model/sc-order';

@Component({
  selector: 'app-carriers',
  templateUrl: './carriers.component.html',
  styleUrls: ['./carriers.component.scss']
})
export class CarriersComponent implements OnInit {


  carryingItems: CarryingItem[] = [];
  orderStatus = OrderStatus;
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
