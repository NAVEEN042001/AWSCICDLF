import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { environment } from "../../environments/environment";
import { SalesData } from "./sales-data.model";

const BACKEND_URL = environment.apiUrl + "/sales/sales";

@Injectable({ providedIn: "root" })
export class SalesService {
    private componentStatusListener = new Subject<boolean>();
  
  getComponentStatusListener() {
    return this.componentStatusListener.asObservable();
  }

  constructor(private http: HttpClient, private router: Router) { }

  readSaleCode = async(query ?: any) => new Promise<any>((resolve, reject) => {
    this.http.get<any>(BACKEND_URL + "/code" + (query ? query : ''))
    .subscribe({
			next: (v) => resolve(v),
			error: (e) => reject(e),
		})
  })

  createSale = async(obj: SalesData) => new Promise<any>((resolve, reject) => {
    this.http.post(BACKEND_URL, obj)
    .subscribe({
			next: (v) => resolve(v),
			error: (e) => reject(e),
		})
  })

  readSale = async(query ?: any) => new Promise<any>((resolve, reject) => {
    this.http.get<any>(BACKEND_URL + (query ? query : ''))
    .subscribe({
			next: (v) => resolve(v),
			error: (e) => reject(e),
		});
  })
}