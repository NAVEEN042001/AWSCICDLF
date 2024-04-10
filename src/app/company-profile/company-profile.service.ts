import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { environment } from "../../environments/environment";
import { CompanyData } from "../company-profile/company-profile-data.model";

const BACKEND_URL = environment.apiUrl + '/company';

@Injectable({ providedIn: "root" })

export class CompanyService {
  private companyStatusListener = new Subject<boolean>();
  
  getCompanyStatusListener() {
    return this.companyStatusListener.asObservable();
  }

  constructor(private http: HttpClient, private router: Router) {}

  saveCompany = async(obj: CompanyData) => new Promise((resolve, reject) => {
    this.http.post<any>(BACKEND_URL + "", obj)
    .subscribe({
			next: (v) => resolve(v),
			error: (e) => reject(e),
		});
  })

  readCompany = async(query?: any) => new Promise<any>((resolve, reject) => {
		this.http.get<any>(BACKEND_URL + "" + (query ? query : ''))
		.subscribe({
			next: (v) => resolve(v),
			error: (e) => reject(e),
		});
	})
}