import { Component, OnInit } from '@angular/core';
import { ColorComponent } from './color/color.component';
import { SizeComponent } from './size/size.component';
import { SleeveTypeComponent } from './sleeve-type/sleeve-type.component';
import { BrandComponent } from './brand/brand.component';
import { ItemComponent } from './item/item.component';

@Component({
  selector: 'app-master-product',
  templateUrl: './master-product.component.html',
  styleUrls: ['./master-product.component.css']
})
export class MasterProductComponent implements OnInit {
  productOption: any[] = [
    { label: "Item", component: ItemComponent },
    { label: "Brand", component: BrandComponent },
    { label: "Size", component: SizeComponent },
    { label: "Sleeve Type", component: SleeveTypeComponent },
    { label: "Colour", component: ColorComponent },
  ];
  productComponent: any;
  activeTabIndex: number = 0; // Tracks the index of the active tab

  constructor() { }

  ngOnInit(): void {
    this.productComponent = this.productOption[0].component;
  }

  changeHandler(ind: number): void {
    this.productComponent = this.productOption[ind].component;
    this.activeTabIndex = ind; // Update the active tab index
  }
}
