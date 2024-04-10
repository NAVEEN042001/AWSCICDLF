import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MasterProductService } from 'app/master-product/master-product.service';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';
import * as JsBarcode from 'jsbarcode';
import { NgxSpinnerService } from 'ngx-spinner';
import { BarcodeService } from './barcode-generation.service';

@Component({
  selector: 'app-barcode-genaration',
  templateUrl: './barcode-genaration.component.html',
  styleUrls: ['./barcode-genaration.component.css']
})
export class BarcodeGenarationComponent implements OnInit {

  items: any[];
  sizes: any[];
  colors: any[];
  submitted: boolean;
  barcodeForm: FormGroup;
  btnButton: any;

  constructor(
    private formBuilder: FormBuilder,
    private productService: MasterProductService,
    private barcodeService: BarcodeService,
    private spinnerService: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.spinnerService.show();
    this.submitted = false;
    this.btnButton = { label: "Generate", method: "onGenerate" };
    this.items = [];
    this.sizes = [];
    this.colors = [];

    this.barcodeForm = this.formBuilder.group({
      item: [null, Validators.required],
      size: [null, Validators.required],
      color: [null],
      price: ['', Validators.required],
    });

    this.productService.readItemLabel('?active=true')
      .then(_res => {
        this.items = _res;
      }).catch(err => console.log(err))

    this.productService.readColor('?active=true')
    .then(_res => {
      this.colors = _res;
    }).catch(err => console.log(err))

    this.productService.readsize('?active=true')
    .then(_res => {
      this.sizes = _res;
    }).catch(err => console.log(err)).finally(()=> this.spinnerService.hide())

    this.barcodeForm.get("item").valueChanges
    .subscribe(itemID => {
      this.barcodeForm.get('price').setValue(null, { emitEvent: false });
      if(itemID) {
       let item = this.items.find(val=>val._id == itemID)
        this.barcodeForm.patchValue({
          price: item.sell_rate
        })
      }
    })
  }

  get barcodeControl() {
    return this.barcodeForm.controls;
  }

  async onGenerate() {
    if (this.barcodeForm.invalid) {
      this.submitted = true;
      Swal.fire({
        title: 'Mandatory fields missing !!!',
        text: 'Please fill in all the required fields.',
        icon: 'warning',
      });
      return;
    }

    const item = this.barcodeForm.get('item').value;
    const size = this.barcodeForm.get('size').value;
    const color = this.barcodeForm.get('color').value;
    const price = this.barcodeForm.get('price').value;

    let serialNumber: string;
    let barcodeData: string
    const exist_barcode = await this.barcodeService.readBarcode(`?active=true&item=${item}&size=${size}&color=${color}&price=${price}`);

    if (!exist_barcode) {
      serialNumber = this.generateSerialNumber();
      let obj = this.barcodeForm.value;
      obj['serial_num'] = serialNumber;

      this.barcodeService.createBarcode(obj)
      .then(async res => {
        barcodeData = res.serial_num;
        await this.generateBarcodePDF(barcodeData);
        window.location.reload();
      });
    } else {
      barcodeData = exist_barcode.serial_num; // Using existing serial number
      await this.generateBarcodePDF(barcodeData);
      window.location.reload();
    }
  }

  generateBarcodePDF(barcodeData: string) {
    const itemcode = this.items.find(x => x._id === this.barcodeForm.get('item').value);
    const size = this.sizes.find(x => x._id === this.barcodeForm.get('size').value)?.name;
    const price = this.barcodeForm.get('price').value
    const doc = new jsPDF();
    JsBarcode(doc.canvas, barcodeData, {
      format: 'CODE128',
      displayValue: false,
      width: 1,
      height: 40,
    });
    const textX = 10;
    const textY = 73;
    // doc.text(${barcodeData}, textX, textY - 10); 
    doc.text(`${itemcode.shortcode}`, textX, textY);
    doc.text(`${size}`, textX, textY + 10);
    doc.text(`MRP`, textX + 75, textY);
    doc.text(`${price}`, textX + 75, textY + 10);
    doc.save(`${itemcode.itemLabel}_${size}_${price}.pdf`);
  }

  generateSerialNumber(): string {
    const minSerialNumber = 10000000;
    const serialNumber = Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER - minSerialNumber + 1)) + minSerialNumber;
    return serialNumber.toString(); 
  }
}