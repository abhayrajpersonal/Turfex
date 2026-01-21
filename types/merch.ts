
export interface MerchItem {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  category: 'Apparel' | 'Equipment' | 'Accessories' | 'Footwear';
  image_url: string;
  rating: number;
  reviews_count: number;
  is_new?: boolean;
  is_bestseller?: boolean;
  colors?: string[];
  sizes?: string[];
}

export interface CartItem extends MerchItem {
  cartItemId: string; // unique id for the cart entry (product_id + variants)
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}
