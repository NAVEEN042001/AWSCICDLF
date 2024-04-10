import { Routes } from '@angular/router';
import { PurchaseComponent  } from './purchase.component';
import { NewpurchaseComponent } from './newpurchase/newpurchase.component';
// import { AuthGuard } from 'app/auth/guard/auth.guard';


export const Purchaseroutes: Routes = [
  { path: '', component: PurchaseComponent },
  { path: 'newpurchase', component: NewpurchaseComponent }

];