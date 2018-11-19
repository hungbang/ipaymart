import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ItemDetailComponent} from '../item-detail/item-detail.component';
import {IpfsRestClient} from '../../../shared/services/ipfs-rest-client';
import {Item} from '../../../shared/model/item';

export enum ItemTab {
  PROPERTIES = 'PROPERTIES',
  DETAIL = 'DETAIL'
}

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemComponent implements OnInit {

  @ViewChild('itemDetail') itemDetail: ItemDetailComponent;

  selectedTab = ItemTab.DETAIL;
  itemTab = ItemTab;
  resolveData: any;
  item: Item;

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
              private ipfsRestClient: IpfsRestClient, private changeDetectorRef: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params['id'] === 'new') {
        this.selectedTab = ItemTab.PROPERTIES;
      } else {
        this.resolveData = this.activatedRoute.snapshot.data;
        this.reloadItem();
      }
    });
  }


  private reloadItem() {
    this.item = this.resolveData.itemData;
  }
}
