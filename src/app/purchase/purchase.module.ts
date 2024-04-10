import { PurchaseComponent } from './purchase.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Purchaseroutes } from './purchase.routing';
import { NewpurchaseComponent } from './newpurchase/newpurchase.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';

import { HttpConfigInterceptor } from 'app/auth/httpconfig.interceptor';

@NgModule({
    declarations: [
        PurchaseComponent,
        NewpurchaseComponent,
    ],
    imports: [
      CommonModule,
      RouterModule.forChild(Purchaseroutes),
      FormsModule,
      ReactiveFormsModule,
      NgSelectModule,
      NgxSpinnerModule,
      DataTablesModule
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
  export class PurchaseModule { }