import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl + '/barcode';

@Injectable({ providedIn: "root"})
export class BarcodeService {

    private componentStatusListener = new Subject<boolean>();

    getComponentStatusListener(){
        return this.componentStatusListener.asObservable();
    }

    constructor( private http: HttpClient) {}

    createBarcode = async(obj) => new Promise<any>((resolve, reject) => {
        this.http.post(BACKEND_URL + "/", obj)
        .subscribe({
            next: (v) => resolve (v),
            error: (e) => reject (e)
        });
    })

    readBarcode = async(query ?: any) => new Promise<any>((resolve, reject) => {
        this.http.get(BACKEND_URL + "/" + (query ? query : ''))
        .subscribe({
            next: (v) => resolve (v),
            error: (e) => reject (e)
        });
    })
}