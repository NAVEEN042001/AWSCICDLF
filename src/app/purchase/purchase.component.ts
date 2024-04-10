import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { PurchaseService } from '../purchase/purchase.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationsService } from '../_services/_notification';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<void> = new Subject<void>();
  dataList: any[];
  filterForm: FormGroup
  submitted: boolean;

  constructor(
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private notification: NotificationsService,
    private purchaseService: PurchaseService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.spinnerService.show();
    this.dataList = [];
    this.submitted = false;

    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    this.filterForm = this.formBuilder.group({
      fromDate: [moment(firstDayOfMonth).format('YYYY-MM-DD'), Validators.required],
      toDate: [moment(today).format('YYYY-MM-DD'), Validators.required]
    });

    this.dtOptions = {
      retrieve:true,
      data: this.dataList,
      columns: [{
        title: 'S.NO',
        render: function(data: any, type: any, row: any, meta: any) {
          return meta.row + 1;
        },
      }, {
        title: "Invoice No",
        defaultContent: '-',
        data: "invoiceNum"
      }, {
        title: "Invoice Date",
        defaultContent: '-',
        render: function(data: any, type: any, row: any, meta: any) {
          return moment(new Date(row.invoiceDate)).format('DD/MM/YYYY');
        }
      }, {
        title: "Supplier Name",
        defaultContent: '-',
        data: "supplier"
      }, {
        title: "Phone",
        defaultContent: '-',
        data: "phone"
      }, {
        title: "No Of Items",
        defaultContent: '-',
        data: "purchased_item",
        render: function(data: any, type: any){
          return data.length
        }
      }, {
        title: "Total Amount",
        defaultContent: '-',
        data: "net_total"
      }, {
        title: "Address",
        defaultContent: '-',
        data: "address"
      }, {
        title: 'Action',
        render: function (data: any, type: any, full: any) {
          return '<button type="button" class="btn btn-link btn-warning btn-icon btn-sm edit" ><i class="fa fa-pencil"></i><router-outlet></router-outlet></button>&nbsp;' +
            '<button type="button" class="btn btn-link btn-danger btn-icon btn-sm delete"><i class="fa fa-trash"></i></button>';
        }
      }],
      columnDefs: [
        { targets: 6, width: '350px' } // Set width of the 7th column (index starts from 0)
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        // Unbind first in order to avoid any duplicate handler
        // (see https://github.com/l-lin/angular-datatables/issues/87)
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
    let startDate = this.filterForm.get('fromDate').value;
    let endDate = this.filterForm.get('toDate').value;
    this.purchaseService.readPurchase('?active=true&from_date='+startDate + '&to_date=' +endDate)
    .then(res => {
      this.dataList = res;
      this.dtOptions.data = this.dataList;
      this.dtTrigger.next();
    }).catch(err => {
      console.error(err);
    }).finally(() => this.spinnerService.hide());
  }

  ngAfterViewInit() {

   }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  edit(data: any) {
    this.router.navigate(['newpurchase'], {relativeTo: this.activatedRoute, state: data});
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
        this.purchaseService.deletePurchase(data._id)
        .then(()=>{
          this.notification.showNotification('delete');
          this.refreshTable();
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

  get filterControl(){
    return this.filterForm.controls
  }

  refreshTable_sub(): void {
    this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.clear();
      this.dtOptions.data = this.dataList;
      dtInstance.rows.add(this.dataList);
      dtInstance.draw();
    });
  }

  onSubmit() {
    if (this.filterForm.invalid) {
      this.submitted = true;
      Swal.fire({
        title: 'Mandatory fields missing !!!',
        text: 'Please fill in all the required fields.',
        icon: 'warning',
      });
      return;
    } else {
      let startDate = this.filterForm.get('fromDate').value;
      let endDate = this.filterForm.get('toDate').value;
      if(startDate > endDate){
        Swal.fire({ title: 'Invalid date range !!!', icon: 'warning', });
        this.dataList = [];
        this.refreshTable_sub();
        return;
      } else {
        this.spinnerService.show();
        this.purchaseService.readPurchase('?active=true&from_date='+startDate + '&to_date=' +endDate)
        .then(_res => {
          this.dataList = _res;
          this.refreshTable_sub();
        }).catch(err => {
          console.log(err);
        }).finally(() => this.spinnerService.hide());
      }
    }
  }
}
