import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { CompanyService } from 'app/company-profile/company-profile.service';
import { MasterProductService } from 'app/master-product/master-product.service';
import { BarcodeService } from 'app/barcode-genaration/barcode-generation.service';
import { SalesService } from './sales.service';
import { NotificationsService } from 'app/_services/_notification';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {
  @ViewChild('billCard') billCard: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private companyService: CompanyService,
    private masterProductService: MasterProductService,
    private spinnerService: NgxSpinnerService,
    private notification: NotificationsService,
    private salesService: SalesService,
    private barcodeService: BarcodeService) { }

  salesForm: FormGroup;
  saleItem: FormGroup;
  company: any;
  items: any[];
  colors: any[];
  product: any = { name: '', quantity: '', price: '', amount: '' };
  additionalRows: any[] = [];
  todayDate: any;
  scannedBarcode: string = '';
  products: any[];
  sizes: any[];
  submitted: boolean;
  barcodeData: any;

  ngOnInit(): void {
    this.submitted = false;
    this.products = [];
    this.sizes = [];
    this.colors = [];
    this.todayDate = new Date();
    this.salesForm = this.formBuilder.group({
      code: { value: '', disabled: true },
      bill_date: [this.todayDate],
      sale_items: this.formBuilder.array([]),
      discount: [0, Validators.min(0)],
      total_quantity: [0],
      total_amount: [0],
      customer_phone: ['', [Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
      bill_amount: [0]
    });

    this.saleItem = this.formBuilder.group({
      item: [null, Validators.required],
      size: [null, Validators.required],
      color: [null, Validators.required],
      price: ['', Validators.required],
      quantity: ['1', Validators.required],
      amount: ['', Validators.required],
    });

    this.salesService.readSaleCode('?active=true')
      .then(code_res => {
        this.salesForm.patchValue({ code: code_res.code })
      }).catch(err => { console.log(err) });

    this.companyService.readCompany('?active=true')
      .then(cmpy_res => {
        this.company = cmpy_res;
      }).catch(err => { console.log(err) });

    this.masterProductService.readItem('?active=true')
      .then(item_res => {
        this.items = item_res;
      }).catch(err => { console.log(err) });

    this.masterProductService.readsize('?active=true')
      .then(item_res => {
        this.sizes = item_res;
      }).catch(err => { console.log(err) });

    this.masterProductService.readColor('?active=true')
      .then(clr_res => {
        this.colors = clr_res;
      }).catch(err => { console.log(err) });
  }

  get salesControl() {
    return this.salesForm.controls;
  }
  @HostListener('window:keydown', ['$event'])
  async handleKeyboardEvent(event: KeyboardEvent) {
    if (/^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;"'<>,.?/\\|~-]$/.test(event.key)) {
      this.scannedBarcode += event.key;
    } else if (event.key === 'Enter') {
      console.log('Scanned Barcode:', this.scannedBarcode); 
      await this.handleScannedBarcode();
    }
  }

  async handleScannedBarcode() {
    try {
      const bar_res = await this.barcodeService.readBarcode('?active=true&serial_num=' + this.scannedBarcode);
      this.barcodeData = bar_res;
      console.log('Barcode Data:', this.barcodeData);
      this.processBarcodeData();
    } catch (error) {
      console.error(error);
      // Handle error
    } finally {
      this.scannedBarcode = ''; // Reset scannedBarcode after processing
    }
  }

  processBarcodeData() {
    const itmExistIndex = this.sale_items.value.findIndex(itm => {
      return (
        itm['item'] === this.barcodeData.item._id &&
        itm['size'] === this.barcodeData.size._id &&
        itm['color'] === this.barcodeData.color._id &&
        itm['price'] === this.barcodeData.price
      );
    });
    if (itmExistIndex === -1) {
      console.log('Existing Item Index:', itmExistIndex);
      this.addSaleItemFromBarcode();
    } else {
      this.incrementQuantityAndAmount(itmExistIndex);
    }
  }

  addSaleItemFromBarcode() {
    console.log('Adding Sale Item:', this.barcodeData);
    this.sale_items.push(this.formBuilder.group({
      item: this.barcodeData.item._id,
      size: this.barcodeData.size._id,
      color: this.barcodeData.color._id,
      price: this.barcodeData.price,
      quantity: 1,
      amount: this.barcodeData.price,
    }));
    this.updateTotalAmount();
  }

  incrementQuantityAndAmount(index: number) {
    console.log('Incrementing Quantity and Amount:', index);
    let currentValue = this.sale_items.at(index).get('quantity').value;
    currentValue += 1;
    this.sale_items.at(index).get('quantity').setValue(currentValue);
    let amount = currentValue * this.sale_items.at(index).get('price').value;
    this.sale_items.at(index).get('amount').setValue(amount);
    this.updateTotalAmount();
  }

  get sale_items(): FormArray {
    return this.salesForm.get('sale_items') as FormArray;
  }

  addSale() {
    if (this.barcodeData) {
      // If barcode data exists, add sale item from barcode
      this.addSaleItemFromBarcode();
    } else {
      console.log("inside the addsale")
    const newSaleItem = this.formBuilder.group({
      item: [this.saleItem.get('item').value, Validators.required],
      size: [this.saleItem.get('size').value, Validators.required],
      color: [this.saleItem.get('color').value, Validators.required],
      price: [this.saleItem.get('price').value, Validators.required],
      quantity: [this.saleItem.get('quantity').value, Validators.required],
      amount: [this.saleItem.get('amount').value, Validators.required],
    });
    this.sale_items.push(newSaleItem);
    this.scannedBarcode = '';
    this.updateTotalAmount();
    this.calculateDiscount();
  }
  this.saleItem.reset();
  }

  removeItem(index: number) {
    this.sale_items.removeAt(index);
    this.updateTotalAmount();
    this.calculateDiscount();
  }

  formatCurrentDate(): string {
    // Get the current date and time without timezone information
    return this.todayDate.toLocaleString([], { hour12: false });
  }

  itemReset(){
    this.saleItem.reset();
  }


  printBill() {
    if (this.salesForm.invalid) {
        this.submitted = true;
        Swal.fire({
            title: 'Mandatory fields missing !!!',
            text: 'Please fill in all the required fields.',
            icon: 'warning',
        });
        return;
    } else {
        this.spinnerService.show();

        // Make a copy of the printable content
        const printableContent = this.billCard.nativeElement.cloneNode(true);

        // Remove unnecessary elements from the printable content
        const elementsToRemove = printableContent.querySelectorAll('.card-body #hide, .card-body .col-md-6.text-right, .card-body label[for="customer_phone"], .card-body #customer_phone, .card-body label[for="discount"], .card-body #discount');
        elementsToRemove.forEach(element => {
            element.remove();
        });

        const style = `
              <style>
                  .container {
                      margin: 0 auto;
                      width: 80%; /* Adjust the width as needed */
                      text-align: center;
                  }
                  table {
                      border-collapse: collapse;
                      width: 100%;
                  }
                  th, td {
                      border-bottom: 0.5px dotted black;
                      padding: 8px;
                      text-align: center;
                  }
                  .cash{
                    margin-left:20px;
                    text-align: center;
                  }
              </style>
          `;
  
        const printWindow = window.open('', '_blank');
        // printWindow.document.body.innerHTML = printableContent.innerHTML;
        printWindow.document.body.innerHTML = `${style}${printableContent.innerHTML}`;
            printWindow.print();
            printWindow.close();
        this.salesService.createSale(this.salesForm.value)
            .then((resp) => {
                this.notification.showNotification('success');
                if(this.salesForm.get('customer_phone').value){
                  const message =  "🛍️ Thank you for shopping with us! 🛍️\n\nWe hope you love your new outfits as much as we do! Remember, great style is a reflection of your unique personality. Tag us in your photos @the_crowns_attire so we can admire your fabulous fashion choices!\n\nIf you have any questions or need assistance, feel free to reach out. Happy shopping!\n\nBest wishes,\nThe Crown's Attire \nmens clothing store";
                  const encodedMessage = encodeURIComponent(message);
                  const whatsappLink = `https://wa.me/91${this.salesForm.get('customer_phone').value}/?text=${encodedMessage}`;
                  window.open(whatsappLink);
                  }
                window.location.reload();
            }).catch(err => {
                console.log(err);
                let _msg = err.error ? err.error.message : err.statusText;
                Swal.fire({ title: 'Error', text: _msg, icon: 'error'});
            }).finally(() => this.spinnerService.hide());
          
    }
  }
    calculateDiscount() {
    const totalAmount = this.salesForm.get('total_amount').value; // Get the total amount
    let discountPercentage = this.salesForm.get('discount').value; // Get the discount percentage

    // Ensure discount is not negative
    discountPercentage = discountPercentage < 0 ? 0 : discountPercentage;

    // Calculate the discount amount
    const discountAmount = (totalAmount * discountPercentage) / 100;

    // Calculate the discounted amount
    const discountedAmount = totalAmount - discountAmount;

    // Update the total amount after discount
    this.salesForm.patchValue({
        bill_amount: discountedAmount
    });
}
  
  updateTotalAmount() {
    let totalAmount = 0;
    let totalQuantity = 0;

    this.salesForm.patchValue({ total_amount: totalAmount, total_quantity: totalQuantity });
    this.sale_items.controls.forEach((itemFormGroup: FormGroup) => {
        const quantity = parseFloat(itemFormGroup.get('quantity').value);
        const amount = parseFloat(itemFormGroup.get('amount').value);
        totalQuantity += quantity;
        totalAmount += amount;
    });

    this.salesForm.patchValue({ total_amount: totalAmount, total_quantity: totalQuantity ,bill_amount: totalAmount });
}

  totalAmount() {
    const price = this.saleItem.get('price').value;
    const quantity = this.saleItem.get('quantity').value;
    this.saleItem.get('amount').setValue(price * quantity);
  }

  getItemName(itemId: string): string {
    const item = this.items.find(item => item._id === itemId);
    return item ? item.name : '';
  }
  
  getSizeName(sizeId: string): string {
    const size = this.sizes.find(size => size._id === sizeId);
    return size ? size.name : '';
  }

}