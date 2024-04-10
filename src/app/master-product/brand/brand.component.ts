import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { MasterProductService } from '../master-product.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationsService } from 'app/_services/_notification';
import { DataTableDirective } from 'angular-datatables';
import * as DataTables from 'datatables.net';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css']
})
export class BrandComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<void> = new Subject<void>();

  brands: any[];
  submitted: boolean;
  brandList: any[];
  brandForm: FormGroup;
  brandID: any;
  btnObj = [
    { label: "Create", method: "onCreate" },
    { label: "Save", method: "onSave" }
  ];
  btnButton: any;

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
    this.brands = []

    this.brandForm = this.formBuilder.group({
      name: ['', Validators.required],
    });
    this.dtOptions = {
      retrieve:true,
      data: this.brandList,
      columns: [{
        title: 'S.NO',
        render: function(data: any, type: any, row: any, meta: any) {
          return meta.row + 1;
        },
      }, {
        title: "Brand Name",
        defaultContent: '-',
        data: "name"
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

    this.productService.readBrand('?active=true')
    .then(brand_res => {
      this.brands = brand_res;
      this.dtOptions.data = this.brands;
      this.dtTrigger.next();
    }) .catch(err => console.log(err)).finally(() => this.spinnerService.hide());
  }

  ngAfterViewInit(): void { }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  get brandControl(){
    return this.brandForm.controls
  }

  onSave(){
    if(this.brandForm.invalid) {
      this.submitted = true;
      Swal.fire({
        title: 'Mandatory fields missing !!!',
        text: 'Please fill in all the required fields.',
        icon: 'warning',
      })
      return;
    } else {
      this.spinnerService.show();
      this.productService.updateBrand(this.editdata._id,this.brandForm.value)
      .then(() => {
        this.notification.showNotification('updated');
        this.ngOnInit();
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
    this.brandForm.patchValue({
      name: this.editdata.name,
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
        this.productService.deleteBrand(data._id)
        .then(res=>{
          console.log(res)
          if(res.exist_brand_item){
            Swal.fire({ title: 'Info!', text: 'Brand cannot be deleted because it has associated items.', icon: 'info' })
          } else if(res.exist_brand_purchase){
            Swal.fire({ title: 'Info!', text: 'Brand cannot be deleted because it has associated purchase.', icon: 'info' })
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

  refreshTable(): void {
    this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.destroy();
      this.ngOnInit();
    })
  }

  onCreate(): void {
    if(this.brandForm.invalid) {
      this.submitted = true;
      Swal.fire({
        title: 'Mandatory fields missing !!!',
        text: 'Please fill in all the required fields.',
        icon: 'warning',
      })
      return;
    } else {
      this.spinnerService.show();
      this.productService.createBrand(this.brandForm.value)
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

  onEdit(data): void {
    this.btnButton = this.btnObj[1];
    this.brandForm.patchValue({
      name: data.name
    })
    // this.brandID = data._id
  }

  onDelete(data): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.value) {
        this.spinnerService.show();
        // this.masterService.deleteProductBrand(data._id)
        // .then(()=>{
        //   this.notificationService.success_notify('Data deleted successfully.');
        //   this.refreshTable();
        // }).catch(err =>{
        //   console.log(err);
        //   let _msg = err.error ? err.error.message : err.statusText;
        //   Swal.fire({ title: 'ERROR!', text: _msg, icon: 'error' });
        // }).finally(() => this.spinnerService.hide());
      }
    })
  }


}
