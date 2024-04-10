import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { environment } from "../../environments/environment";
import { BrandData, ColorData, SleeveTypeData, SizeData, ProductData, ItemData } from "./master-product-data.model";

const BACKEND_URL = environment.apiUrl + '/master-product';

@Injectable({ providedIn: "root"})
export class MasterProductService {

    private componentStatusListener = new Subject<boolean>();

    getComponentStatusListener(){
        return this.componentStatusListener.asObservable();
    }

    constructor( private http: HttpClient) {}

    // brand
    createBrand = async(obj: BrandData) => new Promise<any>((resolve, reject) => {
        this.http.post(BACKEND_URL + "/brand", obj)
        .subscribe({
            next: (v) => resolve (v),
            error: (e) => reject (e)
        });
    })

    readBrand = async(query ?: any) => new Promise<any>((resolve, reject) => {
        this.http.get(BACKEND_URL + "/brand" + (query ? query : ''))
        .subscribe({
            next: (v) => resolve (v),
            error: (e) => reject (e)
        });
    })

    updateBrand = async(id, obj:any) => new Promise<any>((resolve, reject) => {
		this.http.put<any>(BACKEND_URL + "/brand/" + id, obj)
		.subscribe({
			next: (v) => resolve(v),
			error: (e) => reject(e),
		});
	})

    deleteBrand  = async(id) => new Promise<any>((resolve, reject) => {
        this.http.delete<any>(BACKEND_URL + "/brand/" + id)
        .subscribe({
            next: (v) => resolve(v),
            error: (e) => reject(e),
        });
    })

    // color
    createColor = async(obj: ColorData) => new Promise<any>((resolve, reject) => {
        this.http.post(BACKEND_URL + "/color", obj)
        .subscribe({
            next: (v) => resolve (v),
            error: (e) => reject (e)
        });
    })

    readColorCode = async(query ?: any) => new Promise<any>((resolve, reject) => {
        this.http.get(BACKEND_URL + "/color/code" + (query ? query : ''))
        .subscribe({
            next: (v) => resolve (v),
            error: (e) => reject (e)
        });
    })

    readColor = async(query ?: any) => new Promise<any>((resolve, reject) => {
        this.http.get(BACKEND_URL + "/color" + (query ? query : ''))
        .subscribe({
            next: (v) => resolve (v),
            error: (e) => reject (e)
        });
    })

    updateColor = async(id, obj:any) => new Promise<any>((resolve, reject) => {
		this.http.put<any>(BACKEND_URL + "/color/" + id, obj)
		.subscribe({
			next: (v) => resolve(v),
			error: (e) => reject(e),
		});
	})

    deleteColor  = async(id) => new Promise<any>((resolve, reject) => {
        this.http.delete<any>(BACKEND_URL + "/color/" + id)
        .subscribe({
            next: (v) => resolve(v),
            error: (e) => reject(e),
        });
    })

    // sleeve type
    createSleeveType = async(obj: SleeveTypeData) => new Promise<any>((resolve, reject) => {
        this.http.post(BACKEND_URL + "/sleeve-type", obj)
        .subscribe({
            next: (v) => resolve (v),
            error: (e) => reject (e)
        });
    })

    readSleeveType = async(query ?: any) => new Promise<any>((resolve, reject) => {
        this.http.get(BACKEND_URL + "/sleeve-type" + (query ? query : ''))
        .subscribe({
            next: (v) => resolve (v),
            error: (e) => reject (e)
        });
    })

    updateSleeveType = async(id, obj:any) => new Promise<any>((resolve, reject) => {
		this.http.put<any>(BACKEND_URL + "/sleeve-type/" + id, obj)
		.subscribe({
			next: (v) => resolve(v),
			error: (e) => reject(e),
		});
	})

    deleteSleeveType  = async(id) => new Promise<any>((resolve, reject) => {
        this.http.delete<any>(BACKEND_URL + "/sleeve-type/" + id)
        .subscribe({
            next: (v) => resolve(v),
            error: (e) => reject(e),
        });
    })

    // size
    createSize = async(obj: SizeData) => new Promise<any>((resolve, reject) => {
        this.http.post(BACKEND_URL + "/size", obj)
        .subscribe({
            next: (v) => resolve (v),
            error: (e) => reject (e)
        });
    })

    readsize = async(query ?: any) => new Promise<any>((resolve, reject) => {
        this.http.get(BACKEND_URL + "/size" + (query ? query : ''))
        .subscribe({
            next: (v) => resolve (v),
            error: (e) => reject (e)
        });
    })

    updateSize = async(id, obj:any) => new Promise<any>((resolve, reject) => {
		this.http.put<any>(BACKEND_URL + "/size/" + id, obj)
		.subscribe({
			next: (v) => resolve(v),
			error: (e) => reject(e),
		});
	})

    deleteSize  = async(id) => new Promise<any>((resolve, reject) => {
        this.http.delete<any>(BACKEND_URL + "/size/" + id)
        .subscribe({
            next: (v) => resolve(v),
            error: (e) => reject(e),
        });
    })

    // item
    createItem = async(obj: ItemData) => new Promise<any>((resolve, reject) => {
        this.http.post(BACKEND_URL + "/item", obj)
        .subscribe({
            next: (v) => resolve (v),
            error: (e) => reject (e)
        });
    })

    readItem = async(query ?: any) => new Promise<any>((resolve, reject) => {
        this.http.get(BACKEND_URL + "/item" + (query ? query : ''))
        .subscribe({
            next: (v) => resolve (v),
            error: (e) => reject (e)
        });
    })

    readItemLabel= async(query ?: any) => new Promise<any>((resolve, reject) => {
        this.http.get<any>(BACKEND_URL + "/item/itemLabel" + (query ? query : ''))
        .subscribe({
            next: (v) => resolve(v),
            error: (e) => reject(e),
        });
    })

    readItemCode = async(query ?: any) => new Promise<any>((resolve, reject) => {
        this.http.get(BACKEND_URL + "/item/code" + (query ? query : ''))
        .subscribe({
            next: (v) => resolve (v),
            error: (e) => reject (e)
        });
    })

    updateItem = async(id, obj:any) => new Promise<any>((resolve, reject) => {
		this.http.put<any>(BACKEND_URL + "/item/" + id, obj)
		.subscribe({
			next: (v) => resolve(v),
			error: (e) => reject(e),
		});
	})

    deleteItem  = async(id) => new Promise<any>((resolve, reject) => {
        this.http.delete<any>(BACKEND_URL + "/item/" + id)
        .subscribe({
            next: (v) => resolve(v),
            error: (e) => reject(e),
        });
    })
}


