import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MasterProductService } from '../master-product.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { NotificationsService } from '../../_services/_notification';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-master-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})

export class ItemComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<void> = new Subject<void>();

  brands: any[];
  submitted: boolean;
  itemForm: FormGroup;
  itemID: any;
  unitOption: string[];
  btnButton: any;
  btnObj = [
    { label: "Create", method: "onCreate" },
    { label: "Save", method: "onSave" }
  ];
  item_datatable: any[];
  editdata: any;

  constructor(
    private formBuilder: FormBuilder,
    private productService: MasterProductService,
    private spinnerService: NgxSpinnerService,
    private notification: NotificationsService,
  ) { }

  ngOnInit(): void {
    this.spinnerService.show();
    this.submitted = false;
    this.btnButton = this.btnObj[0];
    this.unitOption = ['Pcs', 'Meters'];
    this.brands = [];
    this.item_datatable = [];

    this.itemForm = this.formBuilder.group({
      shortcode: [{value:'', disabled: true}, Validators.required],
      name: ['', Validators.required],
      brand: [null, Validators.required],
      cost_rate: [''],
      sell_rate: [''],
      units: [null, Validators.required],
    });

    this.dtOptions = {
      retrieve:true,
      data: this.item_datatable,
      columns: [{
        title: 'S.NO',
        render: function(data: any, type: any, row: any, meta: any) {
          return meta.row + 1;
        },
      }, {
        title: "Item code",
        defaultContent: '-',
        data: "shortcode"
      }, {
        title: "Name",
        defaultContent: '-',
        data: "name"
      }, {
        title: "Brand",
        defaultContent: '-',
        data: "brand.name"
      }, {
        title: "Purchase Price",
        defaultContent: '-',
        data: "cost_rate"
      }, {
        title: "Selling PRice",
        defaultContent: '-',
        data: "sell_rate"
      }, {
        title: "Units",
        defaultContent: '-',
        data: "units"
      }, {
        title: 'Action',
        render: function (data: any, type: any, full: any) {
          return '<button type="button" class="btn btn-link btn-warning btn-icon btn-sm edit" ><i class="fa fa-pencil"></i><router-outlet></router-outlet></button>&nbsp;' +
            '<button type="button" class="btn btn-link btn-danger btn-icon btn-sm delete"><i class="fa fa-trash"></i></button>';
        }
      }],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        $('.edit', row).off('click');
        $('.edit', row).on('click', () => {
          this.edit(data);
        });
        $('.delete', row).off('click');
        $('.delete', row).on('click', () => {
          this.delete(data);
        });
        return row;
      }
    }

    this.productService.readItem('?active=true')
    .then(res => {
      this.item_datatable = res;
      this.dtOptions.data = this.item_datatable;
      this.dtTrigger.next();
    }).catch(err => {
      console.error(err);
    })

    this.productService.readItemCode()
    .then(_res => {
      this.itemForm.patchValue({
        shortcode: _res.shortcode
      });
    }).catch(err => console.log(err))

    this.productService.readBrand('?active=true')
    .then(_res => {
      this.brands = _res
    }) .catch(err => console.log(err))
   .finally(() => this.spinnerService.hide())
  }

  get itemControl() {
    return this.itemForm.controls;
  }

  ngAfterViewInit() { }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  onCreate() {
    if(this.itemForm.invalid) {
      this.submitted = true;
      Swal.fire({
        title: 'Mandatory fields missing !!!',
        text: 'Please fill in all the required fields.',
        icon: 'warning',
      })
      return;
    } else {
      this.spinnerService.show();
      this.productService.createItem(this.itemForm.value)
      .then(() => {
        this.notification.showNotification('success');
        this.refreshTable();
      }) .catch(err => {
        console.log(err);
        let _msg = err.error ? err.error.message : err.statusText;
        Swal.fire({ title: 'Error', text: _msg, icon: 'error'})
      }).finally(() => this.spinnerService.hide())
    }
  }

  refreshTable(): void {
    this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.destroy();
      this.ngOnInit();
    })
  }

  onSave(){
    if(this.itemForm.invalid) {
      this.submitted = true;
      Swal.fire({
        title: 'Mandatory fields missing !!!',
        text: 'Please fill in all the required fields.',
        icon: 'warning',
      })
      return;
    } else {
      this.spinnerService.show();
      this.productService.updateItem(this.editdata._id,this.itemForm.value)
      .then(() => {
        this.notification.showNotification('updated');
        this.refreshTable();
      }) .catch(err => {
        console.log(err);
        let _msg = err.error ? err.error.message : err.statusText;
        Swal.fire({ title: 'Error', text: _msg, icon: 'error'})
      }).finally(() => this.spinnerService.hide())
    }
  }

  edit(data: any) {
    this.editdata = data
    this.btnButton = this.btnObj[1];
    this.itemForm.patchValue({
      shortcode: this.editdata.shortcode,
      name: this.editdata.name,
      brand: this.editdata.brand._id,
      cost_rate: this.editdata.cost_rate,
      sell_rate: this.editdata.sell_rate,
      units: this.editdata.units,
    })
  }

  delete(data): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if(result.value) {
        this.spinnerService.show();
        this.productService.deleteItem(data._id)
        .then(res=>{
          if(res.exist_item_purchase){
            Swal.fire({ title: 'Info!', text: 'Item cannot be deleted because it has associated purchase.', icon: 'info' })
          } else {
          this.notification.showNotification('delete');
          this.refreshTable();
          this.ngOnInit();
          }
        }).catch(err =>{
          console.log(err);
          let _msg = err.error ? err.error.message : err.statusText;
          Swal.fire({ title: 'ERROR!', text: _msg, icon: 'error' });
        }).finally(() => this.spinnerService.hide());
      }
    })
  }
}
