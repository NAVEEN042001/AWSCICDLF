import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { environment } from "../../environments/environment";
import { PurchaseData } from "./purchase-data.model";

const BACKEND_URL = environment.apiUrl + '/purchase';

@Injectable({ providedIn: "root"})
export class PurchaseService {

    private componentStatusListener = new Subject<boolean>();

    getComponentStatusListener(){
        return this.componentStatusListener.asObservable();
    }

    constructor( private http: HttpClient) {}

    createPurchase = async(obj: PurchaseData) => new Promise<any>((resolve, reject) => {
        this.http.post(BACKEND_URL + "/", obj)
        .subscribe({
            next: (v) => resolve (v),
            error: (e) => reject (e)
        });
    })

    readPurchase = async(query ?: any) => new Promise<any>((resolve, reject) => {
        this.http.get(BACKEND_URL + "/" + (query ? query : ''))
        .subscribe({
            next: (v) => resolve (v),
            error: (e) => reject (e)
        });
    })

    updatePurchase = async(id, obj:any) => new Promise<any>((resolve, reject) => {
		this.http.put<any>(BACKEND_URL + "/" + id, obj)
		.subscribe({
			next: (v) => resolve(v),
			error: (e) => reject(e),
		});
	})

    deletePurchase = async(id) => new Promise<any>((resolve, reject) => {
        this.http.delete<any>(BACKEND_URL + "/" + id)
        .subscribe({
            next: (v) => resolve(v),
            error: (e) => reject(e),
        });
    })
}


