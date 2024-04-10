import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { MasterProductService } from 'app/master-product/master-product.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationsService } from 'app/_services/_notification';
import { PurchaseService } from '../purchase.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-newpurchase',
  templateUrl: './newpurchase.component.html',
  styleUrls: ['./newpurchase.component.css']
})
export class NewpurchaseComponent implements  OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<void> = new Subject<void>();

  items: any[];
  brands: any[];
  sizes: any[];
  sleeve_types: any[];
  colors: any[];
  submitted: boolean;
  submittedProduct: boolean;
  purchaseForm: FormGroup;
  addItemForm: FormGroup;
  products_datatable: any[];
  productEdit_index: number;
  btnButtonProduct: any;
  btnObjProduct = [
    { label: "Create", method: "onCreateProduct" },
    { label: "Save", method: "onSaveProduct" }
  ];
  btnButton: any;
  btnObj = [
    { label: "Create", method: "onCreate" },
    { label: "Save", method: "onSave" },
  ];
  editData: any

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private productService: MasterProductService,
    private purchaseService: PurchaseService,
    private spinnerService: NgxSpinnerService,
    private notification: NotificationsService,
    private modalService: NgbModal,
    private router: Router,
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.editData = navigation?.extras?.state;
   }

  ngOnInit(): void {
    this.submitted = false;
    this.btnButton = this.btnObj[0];
    this.items = [];
    this.brands = [];
    this.sizes = [];
    this.sleeve_types = [];
    this.colors = [];
    this.products_datatable = [];
    this.submittedProduct = false;
    this.btnButtonProduct = this.btnObjProduct[0];

    this.purchaseForm = this.formBuilder.group({
      invoiceNum: [''],
      invoiceDate: ['',Validators.required],
      supplier: ['',Validators.required],
      address: ['', Validators.required],
      phone  : ['',[ Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
      purchased_item: this.formBuilder.array([]),
      net_total: new FormControl ('', Validators.required)
    });

    this.addItemForm = this.formBuilder.group({
      item: [null, Validators.required],
      brand: [null, Validators.required],
      size: [null, Validators.required],
      sleeve_type: [null],
      color: [null],
      price: ['',Validators.required],
      quantity: ['',Validators.required],
    })

    this.dtOptions = {
      searching: false,
      paging: false,
      info: false,
      ordering: false,
      retrieve:true,
      responsive: true,
      data: this.products_datatable,
      destroy: true,
      columns: [{
        title: 'S.NO',
        render: function(data: any, type: any, row: any, meta: any) {
          return meta.row + 1;
        },
      }, {
        title: "Item",
        defaultContent: '-',
        data: "item.name"
      }, {
        title: "Brand",
        defaultContent: '-',
        data: "brand.name"
      }, {
        title: "Size",
        defaultContent: '-',
        data: "size.name"
      }, {
        title: "Color",
        defaultContent: '-',
        data: "color.name"
      }, {
        title: "Sleeve Type",
        defaultContent: '-',
        data: "sleeve_type.type"
      }, {
          title: "Price Per Item",
          defaultContent: '-',
          data: "price"
        }, {
          title: "Quantity",
          defaultContent: '-',
          data: "quantity"
        }, {
          title: "Amount",
          defaultContent: '-',
          render: function (data: any, type: any, full: any) {
            return full.price * full.quantity;
          }
      }, {
        title: 'Action',
        render: function (data: any, type: any, full: any) {
          return '<button type="button" class="btn btn-link btn-warning btn-icon btn-sm edit" ><i class="fa fa-pencil"></i><router-outlet></router-outlet></button>&nbsp;' +
            '<button type="button" class="btn btn-link btn-danger btn-icon btn-sm delete"><i class="fa fa-trash"></i></button>';
        }
      }],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        $('.edit', row).off('click');
        $('.edit', row).on('click', () => {
          this.editItem(index);
        });
        $('.delete', row).off('click');
        $('.delete', row).on('click', () => {
          this.removeItem(index);
        });
        return row;
      }
    }

    this.productService.readBrand('?active=true')
    .then(_res => {
      this.brands = _res;
    }).catch(err => console.log(err))

    this.productService.readsize('?active=true')
    .then(_res => {
      this.sizes = _res;
    }).catch(err => console.log(err))

    this.productService.readColor('?active=true')
    .then(_res => {
      this.colors = _res;
    }).catch(err => console.log(err))

    this.productService.readSleeveType('?active=true')
    .then(_res => {
      this.sleeve_types = _res;
    }).catch(err => console.log(err))

    this.addItemForm.get('brand').valueChanges
    .subscribe(brand => {
      if(brand){
        this.productService.readItem('?active=true&brand='+brand)
        .then(_res => {
          this.items = _res;
        }).catch(err => console.log(err))
      } else {
        this.items = []
      }
    });

    if (this.editData) {
      this.btnButton = this.btnObj[1];
      this.purchaseService.readPurchase('?active=true&_id=' + this.editData._id)
      .then(_res => {
        _res.forEach(_item => {
          const invoiceDate = new Date(_item.invoiceDate);
          const formattedDate = invoiceDate.toISOString().substring(0, 10);
          this.purchaseForm.patchValue({
            invoiceNum: _item.invoiceNum,
            invoiceDate: formattedDate,
            phone: _item.phone,
            supplier: _item.supplier,
            address: _item.address,
            net_total: _item.net_total,
          })
          _item.purchased_item.forEach(val => {
            this.purchaseProducts.push(this.PurchaseItemFormGroup());

            this.purchaseProducts.at(this.purchaseProducts.length - 1).patchValue({
              item: val.item._id,
              brand:  val.brand._id,
              size:  val.size._id,
              sleeve_type:  val.sleeve_type?._id,
              color:  val.color?._id,
              price:  val.price,
              quantity: val.quantity
            });
            this.products_datatable.push({
              item: val.item,
              brand: val.brand,
              size: val.size,
              sleeve_type: val.sleeve_type,
              color: val.color,
              price: val.price,
              quantity: val.quantity,
            })
          })
        });
        this.refreshTable_Items();
      }).catch(err => console.log(err));
    }
  }

  ngAfterViewInit(): void {
     this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  get purchaseControl() {
    return this.purchaseForm.controls;
  }

  get purchaseProducts(): FormArray {
    return this.purchaseForm.get('purchased_item') as FormArray;
  }

  get purchaseItemControl() {
    return this.addItemForm.controls;
  }

  PurchaseItemFormGroup(){
    return this.formBuilder.group({
      item: [null, Validators.required],
      brand: [null, Validators.required],
      size: [null, Validators.required],
      sleeve_type: [null],
      color: [null],
      price: ['',Validators.required],
      quantity: ['',Validators.required],
    })
  }

  openProductModal(): void {
    this.btnButtonProduct = this.btnObjProduct[0];
    this.addItemForm.reset();
    this.submittedProduct = false;
  }

  editItem(index: number): void {
    this.btnButtonProduct = this.btnObjProduct[1];
    this.addItemForm.patchValue(this.purchaseProducts.at(index).value);
    this.productEdit_index = index;
    $('#productModal').modal('show');
  }

  removeItem(index: number): void {
    if (this.purchaseProducts.controls.length < 2) {
      Swal.fire({ title: "Cannot Delete", text: "Minimum 1 item required" })
    } else {
      this.products_datatable.splice(index, 1);
      this.refreshTable_Items();
      this.purchaseProducts.removeAt(index);
      this.calculateTotalPrice();
    }
  }

  refreshTable_Items(): void {
    this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.destroy();
      this.dtOptions.data = this.products_datatable;
      this.dtTrigger.next();
    })
  }

  back(): void {
		this.location.back();
	}

  onCreate(): void {console.log(this.purchaseForm.value,'purchase')
    if(this.purchaseForm.invalid) {
      this.submitted = true;
      Swal.fire({
        title: 'Mandatory fields missing !!!',
        text: 'Please fill in all the required fields.',
        icon: 'warning',
      })
      return;
    } else {
      this.spinnerService.show();
      this.purchaseService.createPurchase(this.purchaseForm.value)
      .then(() => {
        this.notification.showNotification('success');
        this.ngOnInit();
        window.location.reload();
      }) .catch(err => {
        console.log(err);
        let _msg = err.error ? err.error.message : err.statusText;
        Swal.fire({ title: 'Error', text: _msg, icon: 'error'})
      }).finally(() => this.spinnerService.hide())
    }
  }

  onSave(): void {
    if(this.purchaseForm.invalid) {
      this.submitted = true;
      Swal.fire({
        title: 'Mandatory fields missing!!!',
        text: 'Please fill in all the required fields',
        icon: 'warning'
      })
      return;
    } else {
      this.spinnerService.show();
      // Iterate over each purchased item to add the existing quantity
      const updatedPurchaseFormValue = { ...this.purchaseForm.value };
      updatedPurchaseFormValue.purchased_item.forEach((item, index) => {
        if(this.editData.purchased_item[index]?.quantity){
          item.exist_qty = this.editData.purchased_item[index].quantity;
        } else{
          item.exist_qty = 0
        }
      });

      this.purchaseService.updatePurchase(this.editData._id, updatedPurchaseFormValue)
      .then(() => {
        this.notification.showNotification('updated');
        this.ngOnInit();
      })
      .catch(err => {
        console.log(err);
        let _msg = err.error ? err.error.message : err.statusText;
        Swal.fire({ title: 'ERROR!', text: _msg, icon: 'error' });
      }).finally(() => this.spinnerService.hide());
    }
  }


  onCreateProduct(): void {
    if (this.addItemForm.invalid) {
      this.submittedProduct = true;
      return;
    } else {
      this.purchaseProducts.push(this.PurchaseItemFormGroup());
      this.purchaseProducts.at(this.purchaseProducts.length -1).patchValue(this.addItemForm['value'])
      this.products_datatable.push({
        item: this.items.find(x => x._id === this.addItemForm.get('item').value),
        brand: this.brands.find(x => x._id === this.addItemForm.get('brand').value),
        size: this.sizes.find(x => x._id === this.addItemForm.get('size').value),
        sleeve_type: this.sleeve_types.find(x => x._id === this.addItemForm.get('sleeve_type').value),
        color: this.colors.find(x => x._id === this.addItemForm.get('color').value),
        price: this.addItemForm.get('price').value,
        quantity: this.addItemForm.get('quantity').value,
      });

      $('#productModal').modal('hide');
      this.refreshTable_Items();
      this.calculateTotalPrice();

    }
  }

  onSaveProduct(): void {
    if (this.addItemForm.invalid) {
      this.submittedProduct = true;
      return;
    } else {
      this.purchaseProducts.at(this.productEdit_index).patchValue(this.addItemForm['value']);
      this.products_datatable.splice(this.productEdit_index, 1, {
        item: this.items.find(x => x._id === this.addItemForm.get('item').value),
        brand: this.brands.find(x => x._id === this.addItemForm.get('brand').value),
        size: this.sizes.find(x => x._id === this.addItemForm.get('size').value),
        sleeve_type: this.sleeve_types.find(x => x._id === this.addItemForm.get('sleeve_type').value),
        color: this.colors.find(x => x._id === this.addItemForm.get('color').value),
        price: this.addItemForm.get('price').value,
        quantity: this.addItemForm.get('quantity').value,
      })
      $('#productModal').modal('hide');
      this.calculateTotalPrice();
      this.refreshTable_Items();
    }
  }

  calculateTotalPrice() {
    let totalAmount = 0;
    this.products_datatable.forEach(item => {
      totalAmount += item.price * item.quantity;
    }, 0);
    this.purchaseControl['net_total'] .setValue(totalAmount);
  }
}













