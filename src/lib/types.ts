export interface IProduct {
  _id?: string;
  id?: string;
  name: string;
  category: string;
  price: number;
  priceDisplay?: string;
  typeVariant?: string;
  shortDescription: string;
  specifications?: string[];
  variants?: string[];
  imageUrl: string;
  availability: 'In Stock' | 'Limited Stock' | 'On Order' | 'Out of Stock';
  isPriceListItem?: boolean;
  createdAt?: string;
}

export interface ICategory {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export interface IEnquiry {
  _id?: string;
  id?: string;
  name: string;
  phone: string;
  email?: string;
  product?: string;
  message: string;
  date: string;
  status: 'New' | 'Contacted' | 'Completed';
}

export interface IGalleryItem {
  _id?: string;
  id?: string;
  title: string;
  category: 'Store' | 'Products' | 'Glass Work' | 'Plywood' | 'Hardware' | 'Projects';
  imageUrl: string;
  date?: string;
}

export interface IBusinessInfo {
  name: string;
  address: string;
  phones: string[];
  whatsapp: string;
  email: string;
  openingHours: string;
  description: string;
}
