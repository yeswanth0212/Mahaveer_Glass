import { IProduct, IProductVariant } from './types';

export interface ComputedPricing {
  variantName: string;
  variantId?: string;
  basePrice: number; // MRP / Original Price
  sellingPrice: number; // Final Discounted Price
  discountAmount: number; // ₹ savings
  discountPercentage: number; // % savings
  hasDiscount: boolean;
  inStock: boolean;
  selectedVariant?: IProductVariant;
}

/**
 * Computes base price, selling price, and discount calculations
 * for a product or its specific selected variant.
 */
export function computeProductPricing(
  product: IProduct,
  selectedVariantIdOrName?: string
): ComputedPricing {
  const variants = product.variantsData || [];

  // 1. If product has variant records in variantsData
  if (variants.length > 0) {
    let matched = variants.find(
      (v) => v.id === selectedVariantIdOrName || v.name.toLowerCase() === (selectedVariantIdOrName || '').toLowerCase()
    );

    // Default to the first available variant if none matched
    if (!matched) {
      matched = variants.find((v) => v.inStock !== false) || variants[0];
    }

    if (matched) {
      const base = Number(matched.basePrice) > 0 ? Number(matched.basePrice) : Number(matched.sellingPrice || product.price || 0);
      const selling = Number(matched.sellingPrice) > 0 ? Number(matched.sellingPrice) : (Number(matched.basePrice) || Number(product.price) || 0);
      const discountAmt = Math.max(0, base - selling);
      const discountPct = base > 0 && discountAmt > 0 ? Math.round((discountAmt / base) * 100) : 0;

      return {
        variantName: matched.name,
        variantId: matched.id,
        basePrice: base,
        sellingPrice: selling,
        discountAmount: discountAmt,
        discountPercentage: discountPct,
        hasDiscount: discountAmt > 0,
        inStock: matched.inStock !== false,
        selectedVariant: matched,
      };
    }
  }

  // 2. Legacy / Single Product Calculation
  const base = Number(product.basePrice) > 0
    ? Number(product.basePrice)
    : Math.round(Number(product.price || 0) * 1.25); // 20% store discount fallback if no explicit MRP is set

  const selling = Number(product.price || 0);
  const discountAmt = Math.max(0, base - selling);
  const discountPct = base > 0 && discountAmt > 0 ? Math.round((discountAmt / base) * 100) : 0;

  return {
    variantName: selectedVariantIdOrName || product.typeVariant || '',
    basePrice: base,
    sellingPrice: selling,
    discountAmount: discountAmt,
    discountPercentage: discountPct,
    hasDiscount: discountAmt > 0,
    inStock: product.available !== false && product.availability !== 'Out of Stock',
  };
}

/**
 * Computes price ranges and maximum discount percentage for catalog badges.
 */
export function getVariantPriceRange(product: IProduct) {
  const variants = (product.variantsData || []).filter(v => v.inStock !== false);

  if (variants.length > 0) {
    const prices = variants.map(v => Number(v.sellingPrice || v.basePrice || 0));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    let maxDiscount = 0;
    variants.forEach(v => {
      const base = Number(v.basePrice || 0);
      const selling = Number(v.sellingPrice || 0);
      if (base > selling && base > 0) {
        const pct = Math.round(((base - selling) / base) * 100);
        if (pct > maxDiscount) maxDiscount = pct;
      }
    });

    return {
      hasVariants: true,
      variantCount: variants.length,
      minPrice,
      maxPrice,
      maxDiscountPercentage: maxDiscount,
      isRange: minPrice !== maxPrice,
    };
  }

  const single = computeProductPricing(product);
  return {
    hasVariants: false,
    variantCount: 0,
    minPrice: single.sellingPrice,
    maxPrice: single.sellingPrice,
    maxDiscountPercentage: single.discountPercentage,
    isRange: false,
  };
}

/**
 * Builds formatted WhatsApp enquiry message with variant, quantity, price, and discount information.
 */
export function formatWhatsAppEnquiryUrl(options: {
  product: IProduct;
  selectedVariantName?: string;
  quantity?: number;
  businessWhatsApp?: string;
}): string {
  const { product, selectedVariantName, quantity = 1, businessWhatsApp = '917871457430' } = options;
  const pricing = computeProductPricing(product, selectedVariantName);

  const cleanPhone = businessWhatsApp.replace(/[^0-9]/g, '') || '917871457430';

  const totalPrice = pricing.sellingPrice * quantity;
  const totalBase = pricing.basePrice * quantity;
  const totalSavings = pricing.discountAmount * quantity;

  let message = `Hello Mahaveer Glass & Plywood Hardware,\n`;
  message += `I would like to enquire about this product from your website:\n\n`;
  message += `📦 Product: ${product.name}\n`;
  message += `📂 Category: ${product.category}\n`;

  if (pricing.variantName) {
    message += `🏷️ Size / Variant: ${pricing.variantName}\n`;
  }

  if (quantity > 1) {
    message += `🔢 Quantity: ${quantity} unit(s)\n`;
    message += `💰 Unit Price: ₹${pricing.sellingPrice.toLocaleString('en-IN')}`;
    if (pricing.hasDiscount) {
      message += ` (MRP: ₹${pricing.basePrice.toLocaleString('en-IN')})`;
    }
    message += `\n`;
    message += `💵 Total Amount: ₹${totalPrice.toLocaleString('en-IN')}`;
    if (totalSavings > 0) {
      message += ` (You Save: ₹${totalSavings.toLocaleString('en-IN')} - ${pricing.discountPercentage}% OFF)`;
    }
    message += `\n`;
  } else {
    message += `💰 Store Price: ₹${pricing.sellingPrice.toLocaleString('en-IN')}\n`;
    if (pricing.hasDiscount) {
      message += `🔖 MRP: ₹${pricing.basePrice.toLocaleString('en-IN')} (${pricing.discountPercentage}% OFF - Save ₹${pricing.discountAmount.toLocaleString('en-IN')})\n`;
    }
  }

  message += `\nPlease confirm stock availability and store pickup / delivery options.`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
