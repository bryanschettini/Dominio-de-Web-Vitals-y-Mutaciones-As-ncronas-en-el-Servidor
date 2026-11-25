export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url?: string | null;
}

export interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
  product?: { name: string };
}

export interface Order {
  id: number;
  total: number;
  status: string;
  created_at: string;
  items?: OrderItem[];
}

export interface FormState {
  error?: string;
  fieldErrors?: Record<string, string[]>;
}
