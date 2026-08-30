import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { IProduct, IProductVariant, ICategory, IEnquiry, IGalleryItem, IBusinessInfo } from './types';
import { INITIAL_BUSINESS_INFO, INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_GALLERY } from './seedData';

// Fast in-memory cache to make Vercel responses instant
let cachedProducts: IProduct[] | null = null;
let lastProductsFetch = 0;
let cachedCategories: ICategory[] | null = null;
let lastCategoriesFetch = 0;

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms))
  ]);
}

// Helper to normalize Firestore doc to product
function docToProduct(docSnap: any): IProduct {
  const data = docSnap.data();
  const variantsData: IProductVariant[] | undefined = Array.isArray(data.variantsData)
    ? data.variantsData.map((v: any, index: number) => ({
        id: v.id || `var-${index + 1}`,
        name: v.name || '',
        sku: v.sku || '',
        basePrice: Number(v.basePrice) || Number(v.sellingPrice) || 0,
        sellingPrice: Number(v.sellingPrice) || Number(v.basePrice) || 0,
        discountType: v.discountType || 'percentage',
        discountValue: Number(v.discountValue) || 0,
        inStock: v.inStock !== false,
        order: Number(v.order) || index,
      }))
    : undefined;

  // Sync variants string array
  const variants = variantsData && variantsData.length > 0
    ? variantsData.map(v => v.name)
    : (Array.isArray(data.variants) ? data.variants : []);

  const price = variantsData && variantsData.length > 0
    ? (variantsData.find(v => v.inStock !== false)?.sellingPrice || variantsData[0].sellingPrice || Number(data.price) || 0)
    : (Number(data.price) || 0);

  const basePrice = variantsData && variantsData.length > 0
    ? (variantsData.find(v => v.inStock !== false)?.basePrice || variantsData[0].basePrice || Number(data.basePrice) || price)
    : (Number(data.basePrice) || Math.round(price * 1.25));

  return {
    id: docSnap.id,
    _id: docSnap.id,
    name: data.name || '',
    category: data.category || '',
    price,
    basePrice,
    discountType: data.discountType || 'percentage',
    discountValue: Number(data.discountValue) || 0,
    priceDisplay: data.priceDisplay || `₹${price.toLocaleString('en-IN')}`,
    typeVariant: data.typeVariant || '',
    description: data.description || data.shortDescription || '',
    shortDescription: data.shortDescription || data.description || '',
    specifications: Array.isArray(data.specifications) ? data.specifications : [],
    variants,
    variantsData,
    image: data.image || data.imageUrl || '',
    imageUrl: data.imageUrl || data.image || '',
    images: Array.isArray(data.images) ? data.images : [data.image || data.imageUrl].filter(Boolean),
    available: data.available !== undefined ? Boolean(data.available) : true,
    availability: data.availability || (data.available === false ? 'Out of Stock' : 'In Stock'),
    featured: Boolean(data.featured),
    isPriceListItem: Boolean(data.isPriceListItem),
    createdAt: data.createdAt ? (typeof data.createdAt === 'string' ? data.createdAt : new Date(data.createdAt.toDate?.() || Date.now()).toISOString()) : new Date().toISOString(),
    updatedAt: data.updatedAt ? (typeof data.updatedAt === 'string' ? data.updatedAt : new Date(data.updatedAt.toDate?.() || Date.now()).toISOString()) : new Date().toISOString(),
  };
}

// ---------------- PRODUCTS ----------------
export async function getProductsFromFirestore(): Promise<IProduct[]> {
  const now = Date.now();
  if (cachedProducts !== null && (now - lastProductsFetch < 5000)) {
    return cachedProducts;
  }

  try {
    const colRef = collection(db, 'products');
    const snap = await withTimeout(getDocs(colRef), 8000, null);
    
    if (snap) {
      const items = snap.docs.map(docToProduct);
      cachedProducts = items;
      lastProductsFetch = now;
      return items;
    }

    return cachedProducts ?? [];
  } catch (error) {
    console.warn('Firestore getProducts warning:', error);
    return cachedProducts ?? [];
  }
}

export async function getProductByIdFromFirestore(id: string): Promise<IProduct | null> {
  if (cachedProducts && cachedProducts.length > 0) {
    const foundInCache = cachedProducts.find(p => p.id === id || p._id === id);
    if (foundInCache) return foundInCache;
  }

  try {
    const docRef = doc(db, 'products', id);
    const snap = await withTimeout(getDoc(docRef), 8000, null);
    if (snap && snap.exists()) {
      return docToProduct(snap);
    }

    // Try finding by id or _id in initial products fallback
    return INITIAL_PRODUCTS.find(p => p.id === id || p._id === id) || null;
  } catch (error) {
    return INITIAL_PRODUCTS.find(p => p.id === id || p._id === id) || null;
  }
}

export async function addProductToFirestore(data: Partial<IProduct>): Promise<IProduct> {
  cachedProducts = null; // Invalidate cache
  const colRef = collection(db, 'products');
  const now = new Date().toISOString();

  // Normalize variantsData
  const variantsData = Array.isArray(data.variantsData) && data.variantsData.length > 0
    ? data.variantsData.map((v, idx) => ({
        id: v.id || `var-${Date.now()}-${idx}`,
        name: v.name || '',
        sku: v.sku || '',
        basePrice: Number(v.basePrice) || Number(v.sellingPrice) || 0,
        sellingPrice: Number(v.sellingPrice) || Number(v.basePrice) || 0,
        discountType: v.discountType || 'percentage',
        discountValue: Number(v.discountValue) || 0,
        inStock: v.inStock !== false,
        order: Number(v.order) || idx,
      }))
    : [];

  const mainPrice = variantsData.length > 0
    ? (variantsData.find(v => v.inStock !== false)?.sellingPrice || variantsData[0].sellingPrice || Number(data.price) || 0)
    : (Number(data.price) || 0);

  const mainBasePrice = variantsData.length > 0
    ? (variantsData.find(v => v.inStock !== false)?.basePrice || variantsData[0].basePrice || Number(data.basePrice) || mainPrice)
    : (Number(data.basePrice) || Math.round(mainPrice * 1.25));

  const variantsList = variantsData.length > 0
    ? variantsData.map(v => v.name)
    : (data.variants || []);

  const docData = {
    name: data.name || '',
    category: data.category || '',
    price: mainPrice,
    basePrice: mainBasePrice,
    discountType: data.discountType || 'percentage',
    discountValue: Number(data.discountValue) || 0,
    priceDisplay: data.priceDisplay || `₹${mainPrice.toLocaleString('en-IN')}`,
    typeVariant: data.typeVariant || '',
    description: data.shortDescription || data.description || '',
    shortDescription: data.shortDescription || data.description || '',
    specifications: data.specifications || [],
    variants: variantsList,
    variantsData: variantsData.length > 0 ? variantsData : [],
    image: data.imageUrl || data.image || 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=80',
    imageUrl: data.imageUrl || data.image || 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=80',
    images: (data.images || [data.imageUrl || data.image]).filter((img): img is string => Boolean(img)),
    available: data.availability ? data.availability !== 'Out of Stock' : (data.available !== undefined ? data.available : true),
    availability: data.availability || 'In Stock',
    featured: Boolean(data.featured),
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await addDoc(colRef, docData);
  return { id: docRef.id, _id: docRef.id, ...docData };
}

export async function updateProductInFirestore(id: string, data: Partial<IProduct>): Promise<IProduct> {
  cachedProducts = null; // Invalidate cache
  const docRef = doc(db, 'products', id);
  const now = new Date().toISOString();
  const updateData: any = { updatedAt: now };

  if (data.name !== undefined) updateData.name = data.name;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.price !== undefined) {
    updateData.price = Number(data.price);
    updateData.priceDisplay = `₹${Number(data.price).toLocaleString('en-IN')}`;
  }
  if (data.basePrice !== undefined) updateData.basePrice = Number(data.basePrice);
  if (data.discountType !== undefined) updateData.discountType = data.discountType;
  if (data.discountValue !== undefined) updateData.discountValue = Number(data.discountValue);

  if (data.variantsData !== undefined) {
    const formatted = Array.isArray(data.variantsData)
      ? data.variantsData.map((v, idx) => ({
          id: v.id || `var-${Date.now()}-${idx}`,
          name: v.name || '',
          sku: v.sku || '',
          basePrice: Number(v.basePrice) || Number(v.sellingPrice) || 0,
          sellingPrice: Number(v.sellingPrice) || Number(v.basePrice) || 0,
          discountType: v.discountType || 'percentage',
          discountValue: Number(v.discountValue) || 0,
          inStock: v.inStock !== false,
          order: Number(v.order) || idx,
        }))
      : [];
    updateData.variantsData = formatted;
    updateData.variants = formatted.map(v => v.name);
    if (formatted.length > 0 && data.price === undefined) {
      const activeVar = formatted.find(v => v.inStock !== false) || formatted[0];
      updateData.price = activeVar.sellingPrice;
      updateData.basePrice = activeVar.basePrice;
      updateData.priceDisplay = `₹${activeVar.sellingPrice.toLocaleString('en-IN')}`;
    }
  } else if (data.variants !== undefined) {
    updateData.variants = data.variants;
  }

  if (data.typeVariant !== undefined) updateData.typeVariant = data.typeVariant;
  if (data.shortDescription !== undefined || data.description !== undefined) {
    const desc = data.shortDescription || data.description || '';
    updateData.description = desc;
    updateData.shortDescription = desc;
  }
  if (data.specifications !== undefined) updateData.specifications = data.specifications;
  if (data.imageUrl !== undefined || data.image !== undefined) {
    const img = data.imageUrl || data.image || '';
    updateData.image = img;
    updateData.imageUrl = img;
    updateData.images = [img];
  }
  if (data.availability !== undefined) {
    updateData.availability = data.availability;
    updateData.available = data.availability !== 'Out of Stock';
  }
  if (data.available !== undefined) {
    updateData.available = Boolean(data.available);
    updateData.availability = data.available ? 'In Stock' : 'Out of Stock';
  }
  if (data.featured !== undefined) updateData.featured = Boolean(data.featured);

  await updateDoc(docRef, updateData);
  const updatedSnap = await getDoc(docRef);
  return docToProduct(updatedSnap);
}

export async function deleteProductFromFirestore(id: string): Promise<boolean> {
  cachedProducts = null; // Invalidate cache
  const docRef = doc(db, 'products', id);
  await deleteDoc(docRef);
  return true;
}

// ---------------- CATEGORIES ----------------
export async function getCategoriesFromFirestore(): Promise<ICategory[]> {
  const now = Date.now();
  if (cachedCategories && (now - lastCategoriesFetch < 60000)) {
    return cachedCategories;
  }

  try {
    const fetchPromise = async () => {
      const colRef = collection(db, 'categories');
      const snap = await getDocs(colRef);
      if (snap.empty) {
        await seedFirestoreCategories();
        const newSnap = await getDocs(colRef);
        return newSnap.docs.map(d => ({ id: d.id, _id: d.id, ...d.data() } as ICategory));
      }
      return snap.docs.map(d => ({ id: d.id, _id: d.id, ...d.data() } as ICategory));
    };

    const result = await withTimeout(fetchPromise(), 1500, cachedCategories || INITIAL_CATEGORIES);
    cachedCategories = result;
    lastCategoriesFetch = now;
    return result;
  } catch (error) {
    return cachedCategories || INITIAL_CATEGORIES;
  }
}

export async function addCategoryToFirestore(data: Partial<ICategory>): Promise<ICategory> {
  cachedCategories = null;
  const colRef = collection(db, 'categories');
  const now = new Date().toISOString();
  const slug = data.slug || (data.name ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '');
  const docData = {
    name: data.name || '',
    slug,
    description: data.description || '',
    image: data.image || data.imageUrl || '',
    imageUrl: data.imageUrl || data.image || '',
    createdAt: now,
    updatedAt: now,
  };
  const docRef = await addDoc(colRef, docData);
  return { id: docRef.id, _id: docRef.id, ...docData };
}

// ---------------- ENQUIRIES ----------------
export async function getEnquiriesFromFirestore(): Promise<IEnquiry[]> {
  try {
    const colRef = collection(db, 'enquiries');
    const snap = await getDocs(colRef);
    const list = snap.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        _id: d.id,
        name: data.customerName || data.name || '',
        customerName: data.customerName || data.name || '',
        phone: data.phone || '',
        email: data.email || '',
        productId: data.productId || '',
        productName: data.productName || data.product || 'General Enquiry',
        product: data.product || data.productName || 'General Enquiry',
        message: data.message || '',
        status: data.status || 'New',
        date: data.date || data.createdAt || new Date().toLocaleDateString('en-IN'),
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
      } as IEnquiry;
    });
    return list;
  } catch (error) {
    return [];
  }
}

export async function addEnquiryToFirestore(data: Partial<IEnquiry>): Promise<IEnquiry> {
  const colRef = collection(db, 'enquiries');
  const now = new Date().toISOString();
  const formattedDate = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  const docData = {
    customerName: data.customerName || data.name || '',
    name: data.name || data.customerName || '',
    phone: data.phone || '',
    email: data.email || '',
    productId: data.productId || '',
    productName: data.productName || data.product || 'General Enquiry',
    product: data.product || data.productName || 'General Enquiry',
    message: data.message || '',
    status: data.status || 'New',
    date: formattedDate,
    createdAt: now,
    updatedAt: now,
  };
  const docRef = await addDoc(colRef, docData);
  return { id: docRef.id, _id: docRef.id, ...docData };
}

export async function updateEnquiryStatusInFirestore(id: string, status: 'New' | 'Contacted' | 'Completed'): Promise<boolean> {
  const docRef = doc(db, 'enquiries', id);
  await updateDoc(docRef, {
    status,
    updatedAt: new Date().toISOString()
  });
  return true;
}

// ---------------- GALLERY ----------------
export async function getGalleryFromFirestore(): Promise<IGalleryItem[]> {
  try {
    const colRef = collection(db, 'gallery');
    const snap = await getDocs(colRef);
    if (snap.empty) {
      await seedFirestoreGallery();
      const newSnap = await getDocs(colRef);
      return newSnap.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          _id: d.id,
          title: data.title || '',
          category: data.category || 'Store',
          image: data.image || data.imageUrl || '',
          imageUrl: data.imageUrl || data.image || '',
          description: data.description || '',
          date: data.date || data.createdAt || '',
        } as IGalleryItem;
      });
    }
    return snap.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        _id: d.id,
        title: data.title || '',
        category: data.category || 'Store',
        image: data.image || data.imageUrl || '',
        imageUrl: data.imageUrl || data.image || '',
        description: data.description || '',
        date: data.date || data.createdAt || '',
      } as IGalleryItem;
    });
  } catch (error) {
    return INITIAL_GALLERY;
  }
}

export async function addGalleryItemToFirestore(data: Partial<IGalleryItem>): Promise<IGalleryItem> {
  const colRef = collection(db, 'gallery');
  const now = new Date().toISOString();
  const dateStr = new Date().toISOString().split('T')[0];
  const docData = {
    title: data.title || '',
    category: data.category || 'Store',
    image: data.imageUrl || data.image || '',
    imageUrl: data.imageUrl || data.image || '',
    description: data.description || '',
    date: dateStr,
    createdAt: now,
    updatedAt: now,
  };
  const docRef = await addDoc(colRef, docData);
  return { id: docRef.id, _id: docRef.id, ...docData };
}

export async function deleteGalleryItemFromFirestore(id: string): Promise<boolean> {
  const docRef = doc(db, 'gallery', id);
  await deleteDoc(docRef);
  return true;
}

// ---------------- BUSINESS INFO ----------------
export async function getBusinessInfoFromFirestore(): Promise<IBusinessInfo> {
  try {
    const docRef = doc(db, 'business', 'main');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        storeName: data.storeName || data.name || INITIAL_BUSINESS_INFO.name,
        name: data.name || data.storeName || INITIAL_BUSINESS_INFO.name,
        address: data.address || INITIAL_BUSINESS_INFO.address,
        phones: Array.isArray(data.phones) ? data.phones : INITIAL_BUSINESS_INFO.phones,
        whatsapp: data.whatsapp || INITIAL_BUSINESS_INFO.whatsapp,
        email: data.email || INITIAL_BUSINESS_INFO.email,
        openingHours: data.openingHours || INITIAL_BUSINESS_INFO.openingHours,
        description: data.description || INITIAL_BUSINESS_INFO.description,
      };
    }
    await setDoc(docRef, {
      storeName: INITIAL_BUSINESS_INFO.name,
      name: INITIAL_BUSINESS_INFO.name,
      address: INITIAL_BUSINESS_INFO.address,
      phones: INITIAL_BUSINESS_INFO.phones,
      whatsapp: INITIAL_BUSINESS_INFO.whatsapp,
      email: INITIAL_BUSINESS_INFO.email,
      openingHours: INITIAL_BUSINESS_INFO.openingHours,
      description: INITIAL_BUSINESS_INFO.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return INITIAL_BUSINESS_INFO;
  } catch (error) {
    return INITIAL_BUSINESS_INFO;
  }
}

export async function updateBusinessInfoInFirestore(data: Partial<IBusinessInfo>): Promise<IBusinessInfo> {
  const docRef = doc(db, 'business', 'main');
  const now = new Date().toISOString();
  const updateData = {
    ...data,
    storeName: data.storeName || data.name,
    name: data.name || data.storeName,
    updatedAt: now,
  };
  await setDoc(docRef, updateData, { merge: true });
  return getBusinessInfoFromFirestore();
}

// ---------------- SEEDING HELPERS ----------------
export async function seedFirestoreProducts() {
  const colRef = collection(db, 'products');
  const now = new Date().toISOString();
  for (const item of INITIAL_PRODUCTS) {
    const docRef = doc(colRef, item.id);
    await setDoc(docRef, {
      name: item.name,
      category: item.category,
      price: item.price,
      basePrice: item.basePrice || Math.round(item.price * 1.25),
      discountType: item.discountType || 'percentage',
      discountValue: item.discountValue || 0,
      priceDisplay: item.priceDisplay || `₹${item.price.toLocaleString('en-IN')}`,
      typeVariant: item.typeVariant || '',
      description: item.shortDescription || '',
      shortDescription: item.shortDescription || '',
      specifications: item.specifications || [],
      variants: item.variants || [],
      variantsData: item.variantsData || [],
      image: item.imageUrl,
      imageUrl: item.imageUrl,
      images: [item.imageUrl],
      available: item.availability !== 'Out of Stock',
      availability: item.availability || 'In Stock',
      featured: true,
      isPriceListItem: Boolean(item.isPriceListItem),
      createdAt: now,
      updatedAt: now,
    });
  }
}

export async function seedFirestoreCategories() {
  const colRef = collection(db, 'categories');
  const now = new Date().toISOString();
  for (const item of INITIAL_CATEGORIES) {
    const docRef = doc(colRef, item.id);
    await setDoc(docRef, {
      name: item.name,
      slug: item.slug,
      description: item.description || '',
      image: '',
      imageUrl: '',
      createdAt: now,
      updatedAt: now,
    });
  }
}

export async function seedFirestoreGallery() {
  const colRef = collection(db, 'gallery');
  const now = new Date().toISOString();
  for (const item of INITIAL_GALLERY) {
    const docRef = doc(colRef, item.id);
    await setDoc(docRef, {
      title: item.title,
      category: item.category,
      image: item.imageUrl,
      imageUrl: item.imageUrl,
      description: item.title,
      date: item.date || now.split('T')[0],
      createdAt: now,
      updatedAt: now,
    });
  }
}
