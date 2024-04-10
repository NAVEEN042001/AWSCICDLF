import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup,FormBuilder, Validators,FormControl, FormArray } from '@angular/forms';
import Swal from 'sweetalert2';
import { Location } from '@angular/common'; 
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationsService } from 'app/_services/_notification';
import { CompanyService } from './company-profile.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit {
  companyForm: FormGroup;
  submitted: boolean;

  returnUrl: String;
  states = [];
  districts = [];
  cities = [];
  area = [];
  image1: any;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private location: Location,
    private companyService: CompanyService,
    private notification: NotificationsService,
    private spinnerService: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinnerService.show();
    this.submitted = false;
    this.companyForm = this.formBuilder.group({
      name : new FormControl('', Validators.required),
      gstin  : new FormControl (''),
      email  : new FormControl ('', Validators.compose([Validators.required, Validators.email]) ),
      address: new FormControl ('', Validators.required),
      pincode : new FormControl (),
      phone  : this.formBuilder.array([new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)])]),
    }); 

    this.companyService.readCompany('?active=true')
    .then(company_res => {
      
      this.spinnerService.hide();
      if(company_res) {
        this.companyForm.patchValue({
          name: company_res.name,
          gstin: company_res.gstin,
          email: company_res.email,
          phone: company_res.phone,
          pincode: company_res.pincode,
          address: company_res.address,
        })
      }
    })
    .catch(err => {
      console.log(err);
    });    
  }  

  get phones(): FormArray{
    return this.companyForm.get("phone") as FormArray;
  }

  addPhone(){
    this.phones.push(new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]));
  }

  removePhone(i){
    this.phones.removeAt(i);
  }

  get companyControl(): any {
    return this.companyForm.controls;
  }

  back(): void {
		this.location.back();
	}

  onSave(): void {
    if(this.companyForm.invalid) { 
      this.submitted =true;
      Swal.fire({
				title: 'Mandatory fields missing !!!',
				text: 'Please fill in all the required fields.',
				icon: 'warning',
			})
      return;
    } else {
      const unique_phone = Array.from(new Set(this.companyForm.get('phone').value));
      if(this.companyForm.get('phone').value.length != unique_phone.length) {
        Swal.fire({
          title: 'ERROR: Phone number duplicated!',
          text: 'Remove the duplicate phone to proceed...',
          icon: 'error',
        })
        return;
      }
      this.companyService.saveCompany(this.companyForm.value)          
      .then(company_res => {
        this.notification.showNotification('success');
        window.location.reload();
      })
      .catch(err => {
        console.log(err);
        let _msg=err.error ? err.error.message : err.statusText;
        Swal.fire({
          title: 'ERROR!',
          text: _msg,
          icon: 'error'
        });
      });
    }
  }
}
    


