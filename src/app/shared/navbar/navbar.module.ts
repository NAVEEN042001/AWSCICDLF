import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpConfigInterceptor } from 'app/auth/httpconfig.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
    imports: [ 
      RouterModule, 
      CommonModule,
      ReactiveFormsModule,
      FormsModule,
      NgSelectModule,
      NgbModule
    ],
    declarations: [ 
      NavbarComponent,
    ],
    providers: [{
      provide: HTTP_INTERCEPTORS,
      useClass: HttpConfigInterceptor,
      multi: true
    }],
    exports: [ NavbarComponent ]
  })

export class NavbarModule {}
