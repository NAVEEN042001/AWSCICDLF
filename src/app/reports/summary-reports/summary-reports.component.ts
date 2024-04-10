import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { SalesService } from 'app/sales/sales.service';

@Component({
  selector: 'app-summary-reports',
  templateUrl: './summary-reports.component.html',
  styleUrls: ['./summary-reports.component.css']
})
export class SummaryReportsComponent implements OnInit {
  salesReportForm: FormGroup;
  submitted: boolean;

  constructor(
    private fb: FormBuilder,
    public datePipe: DatePipe,
    private salesService: SalesService,
    private spinnerService: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.submitted = false;
    this.salesReportForm = this.fb.group({
      fromDate: new FormControl(this.datePipe.transform(Date.now(), 'yyyy-MM-01'), Validators.required),
      toDate: new FormControl(this.datePipe.transform(Date.now(), 'yyyy-MM-dd'), Validators.required)
    })
  }

  get salesControl() {
    return this.salesReportForm.controls;
  }
  
  exportexcel() {
    if (this.salesReportForm.invalid) {
      this.submitted = true;
      Swal.fire({
        title: 'Mandatory fields missing !!!',
        text: 'Please fill in all the required fields.',
        icon: 'warning',
      });
      return;
    } else {
      let arranged = [];
      let fDate = this.salesReportForm.get('fromDate').value;
      let tDate = this.salesReportForm.get('toDate').value;
      if(fDate > tDate) {
        Swal.fire({ title: 'Invalid date range !!!', icon: 'warning', });
        return;  
      } else {
        this.spinnerService.show();
        this.salesService.readSale(`?from_date=${fDate}&to_date=${tDate}`)
        .then(p_res => {
        if (p_res.length) {
          let i = 1;
          p_res.forEach(x => {
            x.sale_items.forEach((item) => {
              let arrangedItem = {};
              arrangedItem['S.No.'] = i;
              arrangedItem['Bill No'] = x.bill_no;
              arrangedItem['Bill Date'] = moment(x.bill_date, 'YYYY-MM-DD').format('DD-MM-YYYY');
              arrangedItem['Customer Phone'] = x.customer_phone ? x.customer_phone : '';
              arrangedItem['Item'] = item.item.name;
              arrangedItem['Color'] = item.color ? item.color.name : '';
              arrangedItem['Size'] = item.size ? item.size.name : '';
              arrangedItem['Price per Item'] = item.price;
              arrangedItem['Quantity'] = item.quantity;
              arrangedItem['Total Amount'] = parseFloat(item.price) * parseFloat(item.quantity);
              arrangedItem['Bill Total Quantity'] = x.total_quantity;
              arrangedItem['Bill Total Amount'] = x.total_amount;
              arranged.push(arrangedItem)
              ++i;
            });
          })
          //export to excel
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(arranged);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
          XLSX.writeFile(wb, `sales_summary_${moment(fDate, 'YYYY-MM-DD').format('DD-MM-YYYY')}_${moment(tDate, 'YYYY-MM-DD').format('DD-MM-YYYY')}.xlsx`);
          this.ngOnInit();
        } else {
          Swal.fire({ title: "No records found !!!", icon: 'info' })
        }
        }).catch(err => {
          console.log(err);
          let _msg = err.error ? err.error.message : err.statusText;
          Swal.fire({ title: 'ERROR!', text: _msg, icon: 'error' });
        }).finally(() => this.spinnerService.hide());
      }
    }
  }
}