import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { StockService } from './stock-management.service';

@Component({
  selector: 'app-stock-management',
  templateUrl: './stock-management.component.html',
  styleUrls: ['./stock-management.component.css']
})
export class StockManagementComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<void> = new Subject<void>();
  dataList: any[]

  constructor(
    private spinnerService: NgxSpinnerService,
    private stockService: StockService,
  ) { }

  ngOnInit(): void {
    this.spinnerService.show();

    this.dtOptions = {
      retrieve:true,
      data: this.dataList,
      columns: [{
        title: 'S.NO',
        render: function(data: any, type: any, row: any, meta: any) {
          return meta.row + 1;
        },
      }, {
        title: "Item",
        defaultContent: '-',
        data: "item.name"
      }, {
        title: "Brand",
        defaultContent: '-',
        data: "item.brand.name"
      }, {
        title: "Size",
        defaultContent: '-',
        data: "size.name"
      }, {
        title: "Colour",
        defaultContent: '-',
        data: "color.name"
      }, {
        title: "Quantity",
        defaultContent: '-',
        data: "quantity"
      }],
      createdRow: (row: Node, data: any, index: number) => {
        const quantity = data.quantity;
        const quantityCell = $('td', row).eq(5); // Quantity column index is 5 (0-based index)
        console.log("Quantity Cell:", quantityCell); // Log the selected cell for debugging
        if (quantity === 0) {
          quantityCell.css('color', '#e65054').text('Out of Stock');
        } else if (quantity <= 5) {
          quantityCell.css('color', '#e65054'); // Add any additional class if needed
        }
      }
    }

    this.stockService.readStock('?active=true')
    .then(_res => {
      this.dataList = _res
      this.dtOptions.data= this.dataList;
      this.dtTrigger.next()
    }).catch (err => console.log(err)).finally(() => this.spinnerService.hide())

  }
  ngAfterViewInit(): void {
 }

 ngOnDestroy(): void {
   this.dtTrigger.unsubscribe();
 }
}
