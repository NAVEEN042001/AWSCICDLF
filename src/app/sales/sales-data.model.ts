export interface SalesData {
  item:ItemData[];
  total_quantity: string;
  total_amount: string;
  customer_phone: number;
}

export interface ItemData {
  item: string;
  size: string;
  quantity: string;
  amount: string;
}