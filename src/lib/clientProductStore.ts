import { IProduct, ICategory } from './types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from './seedData';

// In-memory instant client cache
let memoryProducts: IProduct[] = [];
let memoryCategories: ICategory[] = [];

export function getClientProducts(): IProduct[] {
  if (memoryProducts.length > 0) {
    return memoryProducts;
  }
  if (typeof window !== 'undefined') {
    try {
      const stored = sessionStorage.getItem('mahaveer_products');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          memoryProducts = parsed;
          return parsed;
        }
      }
    } catch {}
  }
  return INITIAL_PRODUCTS;
}

export function setClientProducts(products: IProduct[]) {
  if (Array.isArray(products) && products.length > 0) {
    memoryProducts = products;
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('mahaveer_products', JSON.stringify(products));
      } catch {}
    }
  }
}

export function getClientProductById(id: string): IProduct | null {
  const all = getClientProducts();
  const found = all.find(p => p.id === id || p._id === id);
  if (found) return found;
  return INITIAL_PRODUCTS.find(p => p.id === id || p._id === id) || null;
}

export function getClientCategories(): ICategory[] {
  if (memoryCategories.length > 0) {
    return memoryCategories;
  }
  if (typeof window !== 'undefined') {
    try {
      const stored = sessionStorage.getItem('mahaveer_categories');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          memoryCategories = parsed;
          return parsed;
        }
      }
    } catch {}
  }
  return INITIAL_CATEGORIES;
}

export function setClientCategories(categories: ICategory[]) {
  if (Array.isArray(categories) && categories.length > 0) {
    memoryCategories = categories;
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('mahaveer_categories', JSON.stringify(categories));
      } catch {}
    }
  }
}
