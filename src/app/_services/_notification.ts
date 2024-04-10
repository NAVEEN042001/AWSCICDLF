import { Injectable  } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

declare var $:any

@Injectable({
  providedIn: 'root'
})

export class NotificationsService{
  constructor(private toastr: ToastrService) {}
  showNotification(type) {
    switch(type) {
      case 'updated':
        this.toastr.info(
          '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Data Updated Successfully.</span>',
          "",
          {
            timeOut: 1000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-info alert-with-icon",
            positionClass: "toast-bottom-right"
          }
        );
        break;

      case 'success':
        this.toastr.success(
          '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Data Saved Successfully.</span>',
          "",
          {
            timeOut: 1000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-success alert-with-icon",
            positionClass: "toast-bottom-right"
          }
        );
        break;
        
      case 'delete':
        this.toastr.show(
          '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Data Deleted Successfully.</span>',
          "",
          {
            timeOut: 1000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-warning alert-with-icon",
            positionClass: "toast-bottom-right"
          }
        );
        break;
      default:
        // Handle other cases if needed
    }
  }
}