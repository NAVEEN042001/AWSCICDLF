import { SalesComponent } from './sales.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Salesroutes } from './sales.routing';
import { HttpConfigInterceptor } from 'app/auth/httpconfig.interceptor';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
    declarations: [
        SalesComponent,
    ],
    imports: [
      CommonModule,
      RouterModule.forChild(Salesroutes),
      FormsModule,
      ReactiveFormsModule,
      NgSelectModule,
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
  export class SalesModule { }