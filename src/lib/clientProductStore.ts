import { IProduct, ICategory } from './types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from './seedData';

// In-memory instant client cache
let memoryProducts: IProduct[] | null = null;
let memoryCategories: ICategory[] | null = null;

export function getClientProducts(): IProduct[] {
  if (memoryProducts !== null) {
    return memoryProducts;
  }
  if (typeof window !== 'undefined') {
    try {
      const stored = sessionStorage.getItem('mahaveer_products');
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          memoryProducts = parsed;
          return parsed;
        }
      }
    } catch {}
  }
  return [];
}

export function setClientProducts(products: IProduct[]) {
  if (Array.isArray(products)) {
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
  return null;
}

export function getClientCategories(): ICategory[] {
  if (memoryCategories !== null) {
    return memoryCategories;
  }
  if (typeof window !== 'undefined') {
    try {
      const stored = sessionStorage.getItem('mahaveer_categories');
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          memoryCategories = parsed;
          return parsed;
        }
      }
    } catch {}
  }
  return INITIAL_CATEGORIES;
}

export function setClientCategories(categories: ICategory[]) {
  if (Array.isArray(categories)) {
    memoryCategories = categories;
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('mahaveer_categories', JSON.stringify(categories));
      } catch {}
    }
  }
}
