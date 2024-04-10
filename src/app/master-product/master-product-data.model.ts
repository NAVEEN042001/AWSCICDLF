export interface BrandData {
    name: string;
}

export interface ColorData {
    name: string
}

export interface SleeveTypeData {
    type: string
}

export interface SizeData {
    name: string
}

export interface ProductData {
    name: string;
    features: string;
}

export interface ItemData {
    code: string;
    name: string;
    brand: string;
    product: string;
    cost_rate: number;
    sell_rate: number;
    units: string;
}