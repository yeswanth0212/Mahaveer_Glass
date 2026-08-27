export interface IProductVariant {
  id: string;
  name: string; // e.g. "1 Litre", "2 Litre", "5 Litre", "8ft x 4ft", "Antique Brass"
  sku?: string;
  basePrice: number; // MRP / Original Base Price
  sellingPrice: number; // Discounted / Selling Price
  discountType?: 'percentage' | 'flat'; // 'percentage' or 'flat'
  discountValue?: number; // e.g. 15 for 15% or 100 for ₹100 flat discount
  inStock?: boolean; // Stock availability
  order?: number; // Sorting order
}

export interface IProduct {
  id?: string;
  _id?: string;
  name: string;
  category: string;
  price: number; // Current / Starting selling price
  basePrice?: number; // Original MRP / Base price before discount
  discountType?: 'percentage' | 'flat';
  discountValue?: number;
  priceDisplay?: string;
  typeVariant?: string;
  description?: string;
  shortDescription?: string;
  specifications?: string[];
  variants?: string[]; // Array of variant names for backwards compatibility
  variantsData?: IProductVariant[]; // Comprehensive variant pricing records
  image?: string;
  imageUrl?: string;
  images?: string[];
  available?: boolean;
  availability?: 'In Stock' | 'Limited Stock' | 'On Order' | 'Out of Stock';
  featured?: boolean;
  isPriceListItem?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICategory {
  id?: string;
  _id?: string;
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IEnquiry {
  id?: string;
  _id?: string;
  name?: string;
  customerName?: string;
  phone: string;
  email?: string;
  productId?: string;
  product?: string;
  productName?: string;
  message: string;
  date?: string;
  status: 'New' | 'Contacted' | 'Completed';
  createdAt?: string;
  updatedAt?: string;
}

export interface IGalleryItem {
  id?: string;
  _id?: string;
  title: string;
  category: 'Store' | 'Products' | 'Glass Work' | 'Plywood' | 'Hardware' | 'Projects' | string;
  image?: string;
  imageUrl?: string;
  description?: string;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IBusinessInfo {
  storeName?: string;
  name?: string;
  address: string;
  phones: string[];
  whatsapp: string;
  email?: string;
  openingHours: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}
