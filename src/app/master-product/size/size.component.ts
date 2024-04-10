import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MasterProductService } from '../master-product.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationsService } from 'app/_services/_notification';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-size',
  templateUrl: './size.component.html',
  styleUrls: ['./size.component.css']
})
export class SizeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<void> = new Subject<void>();

  submitted: boolean;
  sizeForm: FormGroup;
  btnButton: any;
  btnObj = [
    { label: "Create", method: "onCreate" },
    { label: "Save", method: "onSave" }
  ];
  sizeList: any[];
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
    this.sizeList = [];

    this.sizeForm = this.formBuilder.group({
      name: ['', Validators.required],
    });

    this.dtOptions = {
      retrieve:true,
      data: this.sizeList,
      columns: [{
        title: 'S.NO',
        render: function(data: any, type: any, row: any, meta: any) {
          return meta.row + 1;
        },
      }, {
        title: "Size",
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

    this.productService.readsize('?active=true')
    .then(_res => {
      this.sizeList = _res;
      this.dtOptions.data = this.sizeList;
      this.dtTrigger.next();
    }) .catch(err => console.log(err)).finally(() => this.spinnerService.hide());
  }

  ngAfterViewInit(): void { }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  get sizeControl(){
    return this.sizeForm.controls
  }

  onSave(){
    if(this.sizeForm.invalid) {
      this.submitted = true;
      Swal.fire({
        title: 'Mandatory fields missing !!!',
        text: 'Please fill in all the required fields.',
        icon: 'warning',
      })
      return;
    } else {
      this.spinnerService.show();
      this.productService.updateSize(this.editdata._id,this.sizeForm.value)
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
    this.sizeForm.patchValue({
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
        this.productService.deleteSize(data._id)
        .then(res=>{
          if(res.exist_size_purchase){
            Swal.fire({ title: 'Info!', text: 'Size cannot be deleted because it has associated purchase.', icon: 'info' })
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
    if(this.sizeForm.invalid) {
      this.submitted = true;
      Swal.fire({
        title: 'Mandatory fields missing !!!',
        text: 'Please fill in all the required fields.',
        icon: 'warning',
      })
      return;
    } else {
      this.spinnerService.show();
      this.productService.createSize(this.sizeForm.value)
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
