import { BarcodeGenarationComponent } from './barcode-genaration.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BarcodeGenarationroutes } from './barcode-genaration.routing';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxBarcodeModule } from 'ngx-barcode';
import { HttpConfigInterceptor } from 'app/auth/httpconfig.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
    declarations: [
        BarcodeGenarationComponent,
    ],
    imports: [
      CommonModule,
      RouterModule.forChild(BarcodeGenarationroutes),
      FormsModule,
      ReactiveFormsModule,
      NgSelectModule,
      NgxBarcodeModule,
      NgxSpinnerModule
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
  export class BarcodeGenarationModule { }