import { Component, OnInit } from '@angular/core';


export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { path: '/sales',     title: 'Sales',         icon:'nc-tag-content',       class: '' },
    { path: '/purchase',         title: 'Purchase',             icon:'nc-cart-simple',    class: '' },
    { path: '/stock-management',         title: 'Stock Management',        icon:'nc-shop',    class: '' },
    { path: '/barcode-genaration',    title: 'Barcode Genaration',        icon:'nc-tile-56', class: '' },
    { path: '/master-product', title: 'Master Product',     icon:'nc-paper',    class: '' },
    { path: '/company-profile',          title: 'Company Profile',      icon:'nc-single-02',  class: '' },
    { path: '/reports',       title: 'Reports',    icon:'nc-chart-bar-32',  class: '' },
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }
}
