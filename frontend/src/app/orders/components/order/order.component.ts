import { Component, OnInit } from '@angular/core';
import {ScItem, ScItemStatus} from '../../../shared/model/sc-item';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  scItems: ScItem[];
  scItemStatus = ScItemStatus;

  constructor() { }

  ngOnInit() {
  }

}
