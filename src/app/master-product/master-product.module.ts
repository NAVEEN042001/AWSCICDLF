import { MasterProductComponent } from './master-product.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MasterProductroutes } from './master-product.routing';
import { ColorComponent } from './color/color.component';
import { SizeComponent } from './size/size.component';
import { SleeveTypeComponent } from './sleeve-type/sleeve-type.component';
import { BrandComponent } from './brand/brand.component';
import { ItemComponent } from './item/item.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';
import { HttpConfigInterceptor } from 'app/auth/httpconfig.interceptor';

@NgModule({
    declarations: [
        MasterProductComponent,
        ColorComponent,
        SizeComponent,
        SleeveTypeComponent,
        BrandComponent,
        ItemComponent,
    ],
    imports: [
      CommonModule,
      RouterModule.forChild(MasterProductroutes),
      FormsModule,
      ReactiveFormsModule,
      NgxSpinnerModule,
      NgSelectModule,
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
  export class MasterProductModule { }