import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
declare var $:any;

@Component({
  moduleId: module.id,
  selector: 'login-cmp',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
    focus;
    focus1;
    focus2;
    test : Date = new Date();
    private toggleButton;
    private sidebarVisible: boolean;
    isLoading: boolean;
    valid: boolean;
    authStatusSub: any;

    constructor(public authService: AuthService) {}

    ngOnInit(): void {
      this.valid = true;
        // this.checkFullPageBackgroundImage();
        var body = document.getElementsByTagName('body')[0];
        body.classList.add('login-page');
        //var navbar : HTMLElement = this.element.nativeElement;
        //this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        
        setTimeout(function(){
            // after 1000 ms we add the class animated to the login/register card
            $('.card').removeClass('card-hidden');
        }, 700)
    }

    onLogin(form: NgForm) {
      if(form.invalid) {
          this.valid = false;
          return;
      }
      this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(authStatus => {
          this.isLoading = false;
          if(authStatus === false) {
              this.valid = false;
          }
      });
      this.isLoading = true;
      this.authService.login(form.value.email, form.value.password);
  }

  ngOnDestroy() {
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('login-page');
    this.authStatusSub.unsubscribe();
}

}
