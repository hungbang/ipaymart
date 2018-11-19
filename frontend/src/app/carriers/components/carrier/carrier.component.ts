import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {IPFS} from '../../../ipfs';
import {ContractService} from '../../../shared/services/contract.service';

@Component({
  selector: 'app-carrier',
  templateUrl: './carrier.component.html',
  styleUrls: ['./carrier.component.scss']
})
export class CarrierComponent implements OnInit {

  currentAccount: any;
  referenceHashId: any;
  deliveryForm = new FormGroup({
    name: new FormControl('', Validators.required)
  });

  constructor(private activateRouter: ActivatedRoute, @Inject(IPFS) private ipfs, private contractService: ContractService) {
  }

  ngOnInit() {
    const data = this.activateRouter.snapshot.data;
    this.currentAccount = data.currentAccount;

  }

  async registerCarrier() {
    const data = this.deliveryForm.getRawValue();
    if (this.deliveryForm.invalid) {
      return;
    }
    const filesAdded = await this.ipfs.files.add(new this.ipfs.types.Buffer(JSON.stringify(data)));
    this.referenceHashId = filesAdded[0].hash;
    this.contractService.registerDelivery(this.currentAccount, this.referenceHashId);
  }

  resetItemForm(): void {
    this.deliveryForm.reset();
  }


}
