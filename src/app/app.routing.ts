import { Routes } from '@angular/router';
import { AuthGuard } from 'app/auth/guard/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

export const AppRoutes: Routes = [
  {
    path: '',
    component: LoginComponent,
    pathMatch: 'full',
  }, {
    path: '',
    component: AdminLayoutComponent,
    children: [{
      path: '',
      canActivate: [ AuthGuard ],
      loadChildren: () => import('./layouts/admin-layout/admin-layout.module').then(x => x.AdminLayoutModule)
    }, {
      path: 'sales',
      canActivate: [ AuthGuard ],
      loadChildren: () => import('./sales/sales.module').then(x => x.SalesModule)
    }, {
      path: 'purchase',
      canActivate: [ AuthGuard ],
      loadChildren: () => import('./purchase/purchase.module').then(x => x.PurchaseModule)
    },{
      path: 'master-product',
      canActivate: [ AuthGuard ],
      loadChildren: () => import('./master-product/master-product.module').then(x => x.MasterProductModule)
    }, {
      path: 'company-profile',
      canActivate: [ AuthGuard ],
      loadChildren: () => import('./company-profile/company-profile.module').then(x => x.CompanyProfileModule)
    }, {
      path: 'stock-management',
      canActivate: [ AuthGuard ],
      loadChildren: () => import('./stock-management/stock-management.module').then(x => x.StockManagemnetModule)
    }, {
      path: 'barcode-genaration',
      canActivate: [ AuthGuard ],
      loadChildren: () => import('./barcode-genaration/barcode-genaration.module').then(x => x.BarcodeGenarationModule)
    }, {
      path: 'reports',
      canActivate: [ AuthGuard ],
      loadChildren: () => import('./reports/reports.module').then(x => x.ReportsModule)
    }
  ]},
  {
    path: '**',
    redirectTo: 'sales'
  }
]
