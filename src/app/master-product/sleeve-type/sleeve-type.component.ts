import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MasterProductService } from '../master-product.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationsService } from '../../_services/_notification';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-sleeve-type',
  templateUrl: './sleeve-type.component.html',
  styleUrls: ['./sleeve-type.component.css']
})
export class SleeveTypeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<void> = new Subject<void>();

  submitted: boolean;
  sleevetypeForm: FormGroup;
  sleeveTypeList: any[];
  btnButton: any;
  btnObj = [
    { label: "Create", method: "onCreate" },
    { label: "Save", method: "onSave" }
  ];
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
    this.sleeveTypeList = [];

    this.sleevetypeForm = this.formBuilder.group({
      type: ['', Validators.required],
    });

    this.dtOptions = {
      retrieve:true,
      data: this.sleeveTypeList,
      columns: [{
        title: 'S.NO',
        render: function(data: any, type: any, row: any, meta: any) {
          return meta.row + 1;
        },
      }, {
        title: "Sleeve Type",
        defaultContent: '-',
        data: "type"
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

    this.productService.readSleeveType('?active=true')
    .then(_res => {
      this.sleeveTypeList = _res;
      this.dtOptions.data = this.sleeveTypeList;
      this.dtTrigger.next();
    }) .catch(err => console.log(err)).finally(() => this.spinnerService.hide());
  }

  ngAfterViewInit(): void { }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  get sleevetypeControl(){
    return this.sleevetypeForm.controls
  }

  onSave(){
    if(this.sleevetypeForm.invalid) {
      this.submitted = true;
      Swal.fire({
        title: 'Mandatory fields missing !!!',
        text: 'Please fill in all the required fields.',
        icon: 'warning',
      })
      return;
    } else {
      this.spinnerService.show();
      this.productService.updateSleeveType(this.editdata._id,this.sleevetypeForm.value)
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
    this.sleevetypeForm.patchValue({
      type: this.editdata.type,
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
        this.productService.deleteSleeveType(data._id)
        .then(res=>{
          if(res.exist_st_purchase){
            Swal.fire({ title: 'Info!', text: 'Sleeve Type cannot be deleted because it has associated purchase.', icon: 'info' })
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
    if(this.sleevetypeForm.invalid) {
      this.submitted = true;
      Swal.fire({
        title: 'Mandatory fields missing !!!',
        text: 'Please fill in all the required fields.',
        icon: 'warning',
      })
      return;
    } else {
      this.spinnerService.show();
      this.productService.createSleeveType(this.sleevetypeForm.value)
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
}
