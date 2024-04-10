import { ReportsComponent } from './reports.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Reportsroutes } from './reports.routing';
import { HttpConfigInterceptor } from 'app/auth/httpconfig.interceptor';
import { DailyReportsComponent } from './daily-reports/daily-reports.component';
import { SummaryReportsComponent } from './summary-reports/summary-reports.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
    declarations: [
     ReportsComponent,
     DailyReportsComponent,
     SummaryReportsComponent ,
    ],
    imports: [
      CommonModule,
      RouterModule.forChild(Reportsroutes),
      FormsModule,
      NgxSpinnerModule,
      ReactiveFormsModule,
    ],
    providers: [
      DatePipe, 
      {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpConfigInterceptor,
          multi: true
      }
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
  })
  export class ReportsModule { }