import {ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {Web3Service} from './shared/services/web3.service';

declare const window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  title = 'ipayMart';

  currentAccount: any;
  balance: any;

  constructor(private web3Service: Web3Service, private changeDetectorRef: ChangeDetectorRef, private ngZone: NgZone) {
  }

  ngOnInit(): void {
    this.web3Service.getSelectedAccount().subscribe(value => {
      console.log('AppComponent====', value);
      this.currentAccount = value;
      this.web3Service.getBalanceByAccount(value).subscribe(balance => {
        console.log('current balance====', balance);
        this.balance = balance;
        this.ngZone.run(() => this.changeDetectorRef.markForCheck());
      });
    });
    // Check meta mask update to update current balance
    window.web3.currentProvider.publicConfigStore.on('update', () => {
      this.web3Service.getSelectedAccount().subscribe(value => {
        console.log('AppComponent====', value);
        this.currentAccount = value;
        this.web3Service.getBalanceByAccount(value).subscribe(balance => {
          console.log('current balance====', balance);
          this.balance = balance;
          this.ngZone.run(() => this.changeDetectorRef.markForCheck());
        });
      });
    });
  }
}
