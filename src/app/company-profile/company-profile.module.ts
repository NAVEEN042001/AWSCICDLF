import { CompanyProfileComponent } from './company-profile.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CompanyProfileroutes } from './company-profile.routing';
import { HttpConfigInterceptor } from 'app/auth/httpconfig.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
    declarations: [
        CompanyProfileComponent,
    ],
    imports: [
      CommonModule,
      RouterModule.forChild(CompanyProfileroutes),
      FormsModule,
      ReactiveFormsModule,
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
  export class CompanyProfileModule { }