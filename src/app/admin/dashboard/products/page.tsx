'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, Search, X, Check, AlertCircle, Package, Star, 
  Upload, Loader2, ArrowUp, ArrowDown, Tag, Percent, Layers, Sparkles, CheckCircle2
} from 'lucide-react';
import { IProduct, ICategory, IProductVariant } from '@/lib/types';
import { computeProductPricing, getVariantPriceRange } from '@/lib/pricingUtils';
import { setClientProducts, setClientCategories } from '@/lib/clientProductStore';

interface FormVariantState {
  id: string;
  name: string;
  sku: string;
  basePrice: string;
  sellingPrice: string;
  discountType: 'percentage' | 'flat';
  discountValue: string;
  inStock: boolean;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [hasVariants, setHasVariants] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Door Hardware',
    basePrice: '',
    price: '',
    discountType: 'percentage' as 'percentage' | 'flat',
    discountValue: '',
    typeVariant: '',
    shortDescription: '',
    specifications: '',
    imageUrl: '',
    availability: 'In Stock',
    available: true,
    featured: false
  });

  const [variantsList, setVariantsList] = useState<FormVariantState[]>([]);

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [resP, resC] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories')
      ]);
      if (resP.ok) {
        const prodData = await resP.json();
        if (Array.isArray(prodData)) {
          setProducts(prodData);
          setClientProducts(prodData);
        }
      }
      if (resC.ok) {
        const catData = await resC.json();
        if (Array.isArray(catData)) {
          setCategories(catData);
          setClientCategories(catData);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setHasVariants(false);
    setFormData({
      name: '',
      category: categories[0]?.name || 'Door Hardware',
      basePrice: '',
      price: '',
      discountType: 'percentage',
      discountValue: '',
      typeVariant: '',
      shortDescription: '',
      specifications: '',
      imageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=80',
      availability: 'In Stock',
      available: true,
      featured: false
    });
    setVariantsList([
      {
        id: `var-${Date.now()}-1`,
        name: '1 Litre',
        sku: '',
        basePrice: '500',
        sellingPrice: '400',
        discountType: 'percentage',
        discountValue: '20',
        inStock: true
      },
      {
        id: `var-${Date.now()}-2`,
        name: '2 Litre',
        sku: '',
        basePrice: '950',
        sellingPrice: '760',
        discountType: 'percentage',
        discountValue: '20',
        inStock: true
      }
    ]);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: IProduct) => {
    setEditingId(p.id || p._id || '');
    const productVariants = (p.variantsData && p.variantsData.length > 0)
      ? p.variantsData.map((v, i) => ({
          id: v.id || `var-${i}`,
          name: v.name,
          sku: v.sku || '',
          basePrice: v.basePrice ? v.basePrice.toString() : (v.sellingPrice ? v.sellingPrice.toString() : '0'),
          sellingPrice: v.sellingPrice ? v.sellingPrice.toString() : (v.basePrice ? v.basePrice.toString() : '0'),
          discountType: v.discountType || 'percentage',
          discountValue: v.discountValue !== undefined ? v.discountValue.toString() : '',
          inStock: v.inStock !== false,
        }))
      : (p.variants && p.variants.length > 0)
      ? p.variants.map((vName, i) => ({
          id: `var-${i}`,
          name: vName,
          sku: '',
          basePrice: p.basePrice ? p.basePrice.toString() : Math.round(p.price * 1.25).toString(),
          sellingPrice: p.price ? p.price.toString() : '0',
          discountType: 'percentage' as const,
          discountValue: p.discountValue ? p.discountValue.toString() : '20',
          inStock: true,
        }))
      : [];

    setHasVariants(productVariants.length > 0);
    setVariantsList(productVariants.length > 0 ? productVariants : [
      {
        id: `var-${Date.now()}-1`,
        name: 'Standard',
        sku: '',
        basePrice: p.basePrice ? p.basePrice.toString() : Math.round(p.price * 1.25).toString(),
        sellingPrice: p.price.toString(),
        discountType: 'percentage',
        discountValue: '20',
        inStock: true
      }
    ]);

    setFormData({
      name: p.name,
      category: p.category,
      basePrice: p.basePrice ? p.basePrice.toString() : Math.round(p.price * 1.25).toString(),
      price: p.price.toString(),
      discountType: p.discountType || 'percentage',
      discountValue: p.discountValue ? p.discountValue.toString() : '',
      typeVariant: p.typeVariant || '',
      shortDescription: p.shortDescription || p.description || '',
      specifications: p.specifications ? p.specifications.join(', ') : '',
      imageUrl: p.imageUrl || p.image || '',
      availability: p.availability || (p.available === false ? 'Out of Stock' : 'In Stock'),
      available: p.available !== undefined ? p.available : true,
      featured: Boolean(p.featured)
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  // Base price / selling price auto-calculation for single product
  const handleBasePriceChange = (val: string) => {
    const base = parseFloat(val);
    setFormData(prev => {
      let selling = prev.price;
      if (!isNaN(base) && base > 0) {
        if (prev.discountValue) {
          const disc = parseFloat(prev.discountValue);
          if (!isNaN(disc)) {
            if (prev.discountType === 'percentage') {
              selling = Math.max(0, Math.round(base - (base * disc / 100))).toString();
            } else {
              selling = Math.max(0, Math.round(base - disc)).toString();
            }
          }
        }
      }
      return { ...prev, basePrice: val, price: selling };
    });
  };

  const handleSellingPriceChange = (val: string) => {
    const selling = parseFloat(val);
    setFormData(prev => {
      const base = parseFloat(prev.basePrice);
      let discVal = prev.discountValue;
      if (!isNaN(base) && base > 0 && !isNaN(selling) && selling <= base) {
        const diff = base - selling;
        if (prev.discountType === 'percentage') {
          discVal = Math.round((diff / base) * 100).toString();
        } else {
          discVal = diff.toString();
        }
      }
      return { ...prev, price: val, discountValue: discVal };
    });
  };

  const handleDiscountValueChange = (val: string, type?: 'percentage' | 'flat') => {
    const discType = type || formData.discountType;
    const disc = parseFloat(val);
    setFormData(prev => {
      const base = parseFloat(prev.basePrice);
      let selling = prev.price;
      if (!isNaN(base) && base > 0 && !isNaN(disc)) {
        if (discType === 'percentage') {
          selling = Math.max(0, Math.round(base - (base * disc / 100))).toString();
        } else {
          selling = Math.max(0, Math.round(base - disc)).toString();
        }
      }
      return { ...prev, discountValue: val, discountType: discType, price: selling };
    });
  };

  // Variant operations
  const handleAddVariant = (namePreset = '') => {
    const nextIdx = variantsList.length + 1;
    setVariantsList(prev => [
      ...prev,
      {
        id: `var-${Date.now()}-${nextIdx}`,
        name: namePreset || `Variant ${nextIdx}`,
        sku: '',
        basePrice: formData.basePrice || '500',
        sellingPrice: formData.price || '400',
        discountType: 'percentage',
        discountValue: '20',
        inStock: true
      }
    ]);
  };

  const handleUpdateVariant = (index: number, field: keyof FormVariantState, value: any) => {
    setVariantsList(prev => {
      const next = [...prev];
      const target = { ...next[index], [field]: value };

      // Auto-calculate selling price or discount on variant
      if (field === 'basePrice' || field === 'discountValue' || field === 'discountType') {
        const base = parseFloat(field === 'basePrice' ? value : target.basePrice);
        const disc = parseFloat(field === 'discountValue' ? value : target.discountValue);
        const dType = field === 'discountType' ? value : target.discountType;

        if (!isNaN(base) && base > 0 && !isNaN(disc) && disc >= 0) {
          if (dType === 'percentage') {
            target.sellingPrice = Math.max(0, Math.round(base - (base * disc / 100))).toString();
          } else {
            target.sellingPrice = Math.max(0, Math.round(base - disc)).toString();
          }
        }
      } else if (field === 'sellingPrice') {
        const selling = parseFloat(value);
        const base = parseFloat(target.basePrice);
        if (!isNaN(base) && base > 0 && !isNaN(selling) && selling <= base) {
          const diff = base - selling;
          if (target.discountType === 'percentage') {
            target.discountValue = Math.round((diff / base) * 100).toString();
          } else {
            target.discountValue = diff.toString();
          }
        }
      }

      next[index] = target;
      return next;
    });
  };

  const handleRemoveVariant = (index: number) => {
    setVariantsList(prev => prev.filter((_, i) => i !== index));
  };

  const handleMoveVariant = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === variantsList.length - 1)) {
      return;
    }
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    setVariantsList(prev => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 900;
          const MAX_HEIGHT = 900;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          resolve(dataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadProgress(40);
    setErrorMsg('');

    try {
      const compressedDataUrl = await compressImage(file);
      setUploadProgress(100);
      setFormData(prev => ({ ...prev, imageUrl: compressedDataUrl }));
    } catch (err: any) {
      setErrorMsg('Failed to process image: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product? It will be removed from the public website immediately.')) {
      return;
    }
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProducts();
      } else {
        alert('Failed to delete product.');
      }
    } catch {
      alert('Error deleting product.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category) {
      setErrorMsg('Product Name and Category are required.');
      return;
    }

    if (!hasVariants && !formData.price) {
      setErrorMsg('Please specify a Price for this product.');
      return;
    }

    if (hasVariants && variantsList.length === 0) {
      setErrorMsg('Please add at least one variant or toggle off multi-variant pricing.');
      return;
    }

    setSaving(true);
    setErrorMsg('');

    // Prepare variantsData
    let preparedVariants: IProductVariant[] = [];
    let primarySellingPrice = Number(formData.price || 0);
    let primaryBasePrice = Number(formData.basePrice || primarySellingPrice);

    if (hasVariants && variantsList.length > 0) {
      preparedVariants = variantsList.map((v, i) => {
        const bp = Number(v.basePrice) || Number(v.sellingPrice) || 0;
        const sp = Number(v.sellingPrice) || bp;
        const dv = Number(v.discountValue) || (bp > sp && bp > 0 ? Math.round(((bp - sp) / bp) * 100) : 0);
        return {
          id: v.id || `var-${i + 1}`,
          name: v.name.trim() || `Variant ${i + 1}`,
          sku: v.sku.trim(),
          basePrice: bp,
          sellingPrice: sp,
          discountType: v.discountType || 'percentage',
          discountValue: dv,
          inStock: v.inStock !== false,
          order: i,
        };
      });

      const firstActive = preparedVariants.find(v => v.inStock) || preparedVariants[0];
      primarySellingPrice = firstActive.sellingPrice;
      primaryBasePrice = firstActive.basePrice;
    }

    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      price: primarySellingPrice,
      basePrice: primaryBasePrice,
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue) || 0,
      typeVariant: formData.typeVariant.trim(),
      shortDescription: formData.shortDescription.trim(),
      description: formData.shortDescription.trim(),
      imageUrl: formData.imageUrl,
      image: formData.imageUrl,
      availability: formData.availability,
      available: formData.available,
      featured: formData.featured,
      specifications: formData.specifications ? formData.specifications.split(',').map((s) => s.trim()).filter(Boolean) : [],
      variants: hasVariants ? preparedVariants.map(v => v.name) : (formData.typeVariant ? [formData.typeVariant] : []),
      variantsData: hasVariants ? preparedVariants : [],
    };

    try {
      const url = editingId ? `/api/products/${editingId}` : '/api/products';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchProducts();
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Failed saving product.');
      }
    } catch {
      setErrorMsg('Network error saving product.');
    } finally {
      setSaving(false);
    }
  };

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    const hasVariantMatch = (p.variantsData || []).some(v => v.name.toLowerCase().includes(q)) ||
      (p.variants || []).some(v => v.toLowerCase().includes(q));
    return (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      hasVariantMatch
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-800 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-100 flex items-center gap-2.5">
            <Package className="w-6 h-6 text-amber-500" />
            Product & Variant Pricing Management
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Configure quantity variants (1L, 2L, 5L), base prices (MRP), selling prices, and independent product discounts.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Product & Variants
        </button>
      </div>

      {/* Filter Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter by product, category, or variant..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-stone-100 text-xs focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="py-12 text-center text-stone-400 text-xs flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
          <span>Loading products from Firestore...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-stone-400 text-xs bg-stone-900 rounded-2xl border border-stone-800">
          No products found matching your search.
        </div>
      ) : (
        <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-stone-950 text-stone-400 uppercase tracking-wider border-b border-stone-800">
                <tr>
                  <th className="px-6 py-3.5">Product</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Pricing & MRP</th>
                  <th className="px-6 py-3.5">Quantity / Size Variants</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {filtered.map((p) => {
                  const range = getVariantPriceRange(p);
                  const single = computeProductPricing(p);
                  const hasCustomVariants = p.variantsData && p.variantsData.length > 0;

                  return (
                    <tr key={p.id || p._id} className="hover:bg-stone-850 transition-colors">
                      {/* Product details */}
                      <td className="px-6 py-4 flex items-center gap-3">
                        <img 
                          src={p.imageUrl || p.image} 
                          alt="" 
                          className="w-11 h-11 rounded-xl object-cover bg-stone-950 border border-stone-800 shrink-0" 
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-stone-100 text-xs truncate">{p.name}</p>
                            {p.featured && (
                              <span title="Featured Product">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                              </span>
                            )}
                          </div>
                          {p.typeVariant && <p className="text-[10px] text-amber-500 truncate">{p.typeVariant}</p>}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 font-medium text-stone-300">
                        {p.category}
                      </td>

                      {/* Pricing */}
                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          {hasCustomVariants && range.isRange ? (
                            <div>
                              <span className="font-black text-amber-400 text-sm">
                                ₹{range.minPrice.toLocaleString('en-IN')} - ₹{range.maxPrice.toLocaleString('en-IN')}
                              </span>
                              {range.maxDiscountPercentage > 0 && (
                                <span className="ml-2 px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] font-bold">
                                  Up to {range.maxDiscountPercentage}% OFF
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              {single.hasDiscount && (
                                <span className="text-stone-500 line-through text-[11px]">
                                  ₹{single.basePrice.toLocaleString('en-IN')}
                                </span>
                              )}
                              <span className="font-black text-amber-400 text-sm">
                                ₹{single.sellingPrice.toLocaleString('en-IN')}
                              </span>
                              {single.hasDiscount && (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] font-bold">
                                  {single.discountPercentage}% OFF
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Variants */}
                      <td className="px-6 py-4">
                        {hasCustomVariants ? (
                          <div className="flex flex-wrap gap-1.5 max-w-sm">
                            {p.variantsData!.map((v) => {
                              const disc = v.basePrice > v.sellingPrice && v.basePrice > 0
                                ? Math.round(((v.basePrice - v.sellingPrice) / v.basePrice) * 100)
                                : 0;
                              return (
                                <span 
                                  key={v.id || v.name}
                                  className={`px-2 py-0.5 rounded-lg border text-[10px] font-semibold flex items-center gap-1 ${
                                    v.inStock === false
                                      ? 'bg-stone-950 border-stone-800 text-stone-500 line-through'
                                      : 'bg-stone-950 border-amber-500/30 text-stone-300'
                                  }`}
                                >
                                  <span>{v.name}:</span>
                                  <strong className="text-amber-400">₹{v.sellingPrice}</strong>
                                  {disc > 0 && <span className="text-emerald-400 text-[9px]">({disc}% off)</span>}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-stone-500 text-[11px]">Single Standard Price</span>
                        )}
                      </td>

                      {/* Stock / Status */}
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${
                          p.available === false || p.availability === 'Out of Stock'
                            ? 'bg-rose-950 border-rose-800 text-rose-400'
                            : 'bg-emerald-950 border-emerald-800 text-emerald-400'
                        }`}>
                          {p.availability || (p.available === false ? 'Out of Stock' : 'In Stock')}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-2 bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-amber-400 rounded-xl transition-all cursor-pointer"
                          title="Edit Product, Variants & Discounts"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id || p._id || '')}
                          className="p-2 bg-rose-950/60 hover:bg-rose-600 hover:text-white text-rose-400 rounded-xl transition-all cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-stone-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-stone-100 flex items-center gap-2">
                  <Package className="w-5 h-5 text-amber-500" />
                  {editingId ? 'Edit Product & Variant Pricing' : 'Add New Hardware Product & Variants'}
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  Configure real-time pricing, size variants, discounts, and inventory.
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-1.5 text-stone-400 hover:text-stone-100 rounded-lg hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3.5 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-2xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              
              {/* Basic Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <span>1. Product General Information</span>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-stone-300 mb-1">Product Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Fevicol Marine Adhesive / 8 Mortise Lock CY"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-300 mb-1">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 focus:outline-none focus:border-amber-500"
                    >
                      {categories.map((c) => (
                        <option key={c.id || c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-stone-300 mb-1">Type / Finish Tag (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. CY - Antique / S.S / Brass"
                      value={formData.typeVariant}
                      onChange={(e) => setFormData({ ...formData, typeVariant: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-300 mb-1">Stock Availability</label>
                    <select
                      value={formData.availability}
                      onChange={(e: any) => setFormData({ 
                        ...formData, 
                        availability: e.target.value,
                        available: e.target.value !== 'Out of Stock'
                      })}
                      className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 focus:outline-none focus:border-amber-500"
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Limited Stock">Limited Stock</option>
                      <option value="On Order">On Order</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Pricing & Variants Section */}
              <div className="space-y-4 pt-4 border-t border-stone-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      <span>2. Pricing & Quantity / Size Variants</span>
                    </h3>
                    <p className="text-[11px] text-stone-400">
                      Choose whether this product has a single standard price or multiple quantity/size variants (1L, 2L, 5L, etc.).
                    </p>
                  </div>

                  {/* Multi-variant switch */}
                  <label className="flex items-center gap-2 cursor-pointer bg-stone-950 px-3.5 py-1.5 rounded-xl border border-stone-800 select-none">
                    <input
                      type="checkbox"
                      checked={hasVariants}
                      onChange={(e) => setHasVariants(e.target.checked)}
                      className="w-4 h-4 rounded bg-stone-900 border-stone-700 text-amber-500 focus:ring-0 cursor-pointer"
                    />
                    <span className="font-bold text-amber-400 text-xs">Enable Multi-Quantity / Size Variants</span>
                  </label>
                </div>

                {!hasVariants ? (
                  /* Single Product Pricing Form */
                  <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-bold text-stone-300 mb-1">Base Price / MRP (₹)</label>
                        <input
                          type="number"
                          placeholder="e.g. 500"
                          value={formData.basePrice}
                          onChange={(e) => handleBasePriceChange(e.target.value)}
                          className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-xl text-stone-100 focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-300 mb-1">Discount (% or Flat ₹)</label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder="e.g. 20"
                            value={formData.discountValue}
                            onChange={(e) => handleDiscountValueChange(e.target.value)}
                            className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-xl text-stone-100 focus:border-amber-500"
                          />
                          <select
                            value={formData.discountType}
                            onChange={(e: any) => handleDiscountValueChange(formData.discountValue, e.target.value)}
                            className="px-2 py-2 bg-stone-900 border border-stone-800 rounded-xl text-stone-200 text-xs"
                          >
                            <option value="percentage">%</option>
                            <option value="flat">₹</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-stone-300 mb-1">Final Selling Price (₹) *</label>
                        <input
                          type="number"
                          required
                          placeholder="e.g. 400"
                          value={formData.price}
                          onChange={(e) => handleSellingPriceChange(e.target.value)}
                          className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-xl text-amber-400 font-bold text-sm focus:border-amber-500"
                        />
                      </div>
                    </div>

                    {/* Auto calculation preview */}
                    {formData.basePrice && formData.price && (
                      <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs">
                        <span className="text-stone-300">
                          MRP: <strong className="text-stone-100">₹{formData.basePrice}</strong> → Selling: <strong className="text-amber-400">₹{formData.price}</strong>
                        </span>
                        <span className="font-bold text-emerald-400">
                          Customer Saves: ₹{Math.max(0, Number(formData.basePrice) - Number(formData.price))} 
                          {Number(formData.basePrice) > 0 && ` (${Math.round(((Number(formData.basePrice) - Number(formData.price)) / Number(formData.basePrice)) * 100)}% OFF)`}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Multi-Variant Manager Table */
                  <div className="space-y-3">
                    {/* Quick Preset Buttons */}
                    <div className="flex flex-wrap items-center gap-2 p-3 bg-stone-950 border border-stone-800 rounded-2xl">
                      <span className="text-stone-400 font-bold text-[11px] mr-1">Quick Add Presets:</span>
                      <button
                        type="button"
                        onClick={() => handleAddVariant('1 Litre')}
                        className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 rounded-lg text-[11px] font-semibold transition-colors"
                      >
                        + 1 Litre
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddVariant('2 Litre')}
                        className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 rounded-lg text-[11px] font-semibold transition-colors"
                      >
                        + 2 Litre
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddVariant('5 Litre')}
                        className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 rounded-lg text-[11px] font-semibold transition-colors"
                      >
                        + 5 Litre
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddVariant('500 ml')}
                        className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 rounded-lg text-[11px] font-semibold transition-colors"
                      >
                        + 500 ml
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddVariant('6 Inch')}
                        className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 rounded-lg text-[11px] font-semibold transition-colors"
                      >
                        + 6 Inch
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddVariant('8 Inch')}
                        className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 rounded-lg text-[11px] font-semibold transition-colors"
                      >
                        + 8 Inch
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddVariant('')}
                        className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg text-[11px] font-bold transition-all ml-auto"
                      >
                        + Custom Variant
                      </button>
                    </div>

                    {/* Variant List Table */}
                    <div className="bg-stone-950 border border-stone-800 rounded-2xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-stone-900 text-stone-400 uppercase text-[10px] font-bold border-b border-stone-800">
                            <tr>
                              <th className="px-3 py-2.5">Order</th>
                              <th className="px-3 py-2.5">Variant Name (e.g. 1L, 2L, 5L)</th>
                              <th className="px-3 py-2.5">Base Price (MRP ₹)</th>
                              <th className="px-3 py-2.5">Discount (% or ₹)</th>
                              <th className="px-3 py-2.5">Selling Price (₹)</th>
                              <th className="px-3 py-2.5 text-center">In Stock</th>
                              <th className="px-3 py-2.5 text-right">Delete</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-850">
                            {variantsList.map((v, idx) => {
                              const base = Number(v.basePrice) || 0;
                              const selling = Number(v.sellingPrice) || 0;
                              const diff = Math.max(0, base - selling);
                              const pct = base > 0 ? Math.round((diff / base) * 100) : 0;

                              return (
                                <tr key={v.id} className="hover:bg-stone-900/60">
                                  {/* Reorder Buttons */}
                                  <td className="px-3 py-2 whitespace-nowrap">
                                    <div className="flex items-center gap-1">
                                      <button
                                        type="button"
                                        disabled={idx === 0}
                                        onClick={() => handleMoveVariant(idx, 'up')}
                                        className="p-1 hover:bg-stone-800 text-stone-400 hover:text-stone-100 disabled:opacity-30 rounded"
                                        title="Move Variant Up"
                                      >
                                        <ArrowUp className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        type="button"
                                        disabled={idx === variantsList.length - 1}
                                        onClick={() => handleMoveVariant(idx, 'down')}
                                        className="p-1 hover:bg-stone-800 text-stone-400 hover:text-stone-100 disabled:opacity-30 rounded"
                                        title="Move Variant Down"
                                      >
                                        <ArrowDown className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>

                                  {/* Variant Name */}
                                  <td className="px-3 py-2">
                                    <input
                                      type="text"
                                      required
                                      placeholder="e.g. 1 Litre"
                                      value={v.name}
                                      onChange={(e) => handleUpdateVariant(idx, 'name', e.target.value)}
                                      className="w-full px-2.5 py-1.5 bg-stone-900 border border-stone-800 rounded-lg text-stone-100 font-bold focus:border-amber-500 text-xs"
                                    />
                                  </td>

                                  {/* Base Price */}
                                  <td className="px-3 py-2">
                                    <input
                                      type="number"
                                      placeholder="MRP"
                                      value={v.basePrice}
                                      onChange={(e) => handleUpdateVariant(idx, 'basePrice', e.target.value)}
                                      className="w-24 px-2.5 py-1.5 bg-stone-900 border border-stone-800 rounded-lg text-stone-300 focus:border-amber-500 text-xs"
                                    />
                                  </td>

                                  {/* Discount */}
                                  <td className="px-3 py-2">
                                    <div className="flex items-center gap-1.5">
                                      <input
                                        type="number"
                                        placeholder="Disc"
                                        value={v.discountValue}
                                        onChange={(e) => handleUpdateVariant(idx, 'discountValue', e.target.value)}
                                        className="w-16 px-2 py-1.5 bg-stone-900 border border-stone-800 rounded-lg text-stone-300 focus:border-amber-500 text-xs"
                                      />
                                      <select
                                        value={v.discountType}
                                        onChange={(e: any) => handleUpdateVariant(idx, 'discountType', e.target.value)}
                                        className="px-1.5 py-1.5 bg-stone-900 border border-stone-800 rounded-lg text-stone-300 text-[11px]"
                                      >
                                        <option value="percentage">%</option>
                                        <option value="flat">₹</option>
                                      </select>
                                    </div>
                                  </td>

                                  {/* Selling Price & Savings indicator */}
                                  <td className="px-3 py-2">
                                    <div className="space-y-0.5">
                                      <input
                                        type="number"
                                        required
                                        placeholder="Final"
                                        value={v.sellingPrice}
                                        onChange={(e) => handleUpdateVariant(idx, 'sellingPrice', e.target.value)}
                                        className="w-24 px-2.5 py-1.5 bg-stone-900 border border-stone-800 rounded-lg text-amber-400 font-bold focus:border-amber-500 text-xs"
                                      />
                                      {diff > 0 && (
                                        <p className="text-[10px] text-emerald-400 font-semibold">
                                          Save ₹{diff} ({pct}%)
                                        </p>
                                      )}
                                    </div>
                                  </td>

                                  {/* In Stock */}
                                  <td className="px-3 py-2 text-center">
                                    <input
                                      type="checkbox"
                                      checked={v.inStock}
                                      onChange={(e) => handleUpdateVariant(idx, 'inStock', e.target.checked)}
                                      className="w-4 h-4 rounded bg-stone-900 border-stone-700 text-amber-500 focus:ring-0 cursor-pointer"
                                    />
                                  </td>

                                  {/* Delete */}
                                  <td className="px-3 py-2 text-right">
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveVariant(idx)}
                                      className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded transition-colors"
                                      title="Remove Variant"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Media & Details */}
              <div className="space-y-4 pt-4 border-t border-stone-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  3. Image, Specifications & Highlights
                </h3>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-stone-300 font-semibold">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 rounded bg-stone-950 border-stone-800 text-amber-500 focus:ring-0 cursor-pointer"
                    />
                    Mark as Featured Product
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-stone-300 font-semibold">
                    <input
                      type="checkbox"
                      checked={formData.available}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        available: e.target.checked,
                        availability: e.target.checked ? 'In Stock' : 'Out of Stock'
                      })}
                      className="w-4 h-4 rounded bg-stone-950 border-stone-800 text-amber-500 focus:ring-0 cursor-pointer"
                    />
                    Product Visible & Available for Orders
                  </label>
                </div>

                {/* Product Image */}
                <div>
                  <label className="block font-bold text-stone-300 mb-1">Product Image</label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {formData.imageUrl && (
                      <img 
                        src={formData.imageUrl} 
                        alt="Preview" 
                        className="w-20 h-20 rounded-2xl object-cover border border-stone-800 bg-stone-950 shrink-0" 
                      />
                    )}
                    <div className="flex-1 w-full relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                        id="image-upload"
                      />
                      <label 
                        htmlFor="image-upload"
                        className={`flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${
                          uploadingImage ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-stone-700 bg-stone-950 hover:bg-stone-800 text-stone-400 hover:text-stone-300'
                        }`}
                      >
                        {uploadingImage ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Compressing & uploading image...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-5 h-5" />
                            <span>Click to upload & optimize product image</span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-300 mb-1">Short Description</label>
                  <textarea
                    rows={2}
                    placeholder="Product highlights, application, and finish details..."
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    className="w-full px-3.5 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 focus:outline-none focus:border-amber-500"
                  ></textarea>
                </div>

                <div>
                  <label className="block font-bold text-stone-300 mb-1">Specifications (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Material: Pure Brass, Warranty: 5 Years, Finish: Satin SS"
                    value={formData.specifications}
                    onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving to Firestore...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save Product & Pricing</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
