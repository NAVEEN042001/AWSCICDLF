import { StockManagementComponent } from './stock-management.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { StockManagementroutes } from './stock-managemnet.routing';
import { HttpConfigInterceptor } from 'app/auth/httpconfig.interceptor';
import { DataTablesModule } from 'angular-datatables';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
    declarations: [
      StockManagementComponent,
    ],
    imports: [
      CommonModule,
      RouterModule.forChild(StockManagementroutes),
      FormsModule,
      ReactiveFormsModule,
      DataTablesModule,
      NgxSpinnerModule,
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
  export class StockManagemnetModule { }