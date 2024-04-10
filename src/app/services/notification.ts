import { Injectable } from '@angular/core';

declare var $:any;

@Injectable({
    providedIn: 'root'
})
  
export class NotificationService {
    constructor() { }

    success_notify(_msg: string) {
        $.notify({
            icon: "nc-check-2",
            message: _msg
          },{
              type: 'success',
              timer: 1000,
              placement: {
                  from: 'bottom',
                  align: 'right'
              },
              template: '<div data-notify="container" class="col-11 col-md-4 alert alert-{0} alert-with-icon" role="alert"><button type="button" aria-hidden="true" class="close" data-notify="dismiss"><i class="nc-icon nc-simple-remove"></i></button><span data-notify="icon" class="nc-icon nc-bell-55"></span> <span data-notify="title">{1}</span> <span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
          });
    }

    fail_notify() {
        // add more... and so on
    }
}