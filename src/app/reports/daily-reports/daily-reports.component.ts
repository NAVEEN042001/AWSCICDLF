import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { SalesService } from 'app/sales/sales.service';

@Component({
  selector: 'app-daily-reports',
  templateUrl: './daily-reports.component.html',
  styleUrls: ['./daily-reports.component.css']
})
export class DailyReportsComponent implements OnInit {
  salesDailyReportForm: FormGroup;
  submitted: boolean;
  todayDate: string;  
  details_filename: 'daily_sales.xlsx';
  date;
  
  constructor(
    public datePipe: DatePipe,
    private fb: FormBuilder,
    private salesService: SalesService,
    private spinnerService: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.submitted = false;
    this.todayDate = this.datePipe.transform(Date.now(), 'yyyy-MM-dd');
    
    this.salesDailyReportForm = this.fb.group({
      dateSel: new FormControl(this.todayDate, Validators.required),
    })
  }

  get dailySalesControl() {
    return this.salesDailyReportForm.controls;
  }

  exportexcel() {
    if (this.salesDailyReportForm.invalid) {
      this.submitted = true;
      Swal.fire({
        title: 'Mandatory fields missing !!!',
        text: 'Please fill in all the required fields.',
        icon: 'warning',
      });
        return;
      } else {
        let arranged = [];
        let currentdate = this.salesDailyReportForm.get('dateSel').value;
        this.spinnerService.show();
        this.salesService.readSale(`?fDate=${currentdate}`)
        .then(p_res => {console.log(p_res)
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
          XLSX.writeFile(wb, `daily_sales${moment(currentdate, 'YYYY-MM-DD').format('DD-MM-YYYY')}.xlsx`);
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
