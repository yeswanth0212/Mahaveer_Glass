# Mahaveer Glass & Plywood Hardware - Official Business Website

Production-ready, full-stack responsive web application for **Mahaveer Glass & Plywood Hardware**, located in Old Pallavaram, Chennai - 600 117.

Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Lucide Icons**, **Firebase / Firestore**, and **JWT Authentication**.

---

## 1. Quick Start Instructions

### Prerequisites
- Node.js (v18.x or later recommended)
- npm or yarn

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables (`.env`)
Create a `.env` file in the project root (never commit this file). Required variables:

```env
# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Admin Authentication (set your own strong values)
ADMIN_EMAIL=your-admin-email@example.com
ADMIN_PASSWORD=YourStrongPassword
JWT_SECRET=your-long-random-secret-key

# WhatsApp
NEXT_PUBLIC_DEFAULT_WHATSAPP=91XXXXXXXXXX
```

> ⚠️ **Never share or commit your `.env` file.** The `.gitignore` already excludes it.

### Step 3: Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 2. Public Customer Website Structure

Access at: `http://localhost:3000/`

- **Homepage (`/`)**: Hero section, 12 hardware product category cards, current price list table, Why Choose Us, and location CTA.
- **Product Catalog (`/products`)**: Searchable, filterable product catalog with category pills, sorting, and Indian currency formatting (`₹`).
- **Product Detail (`/products/[id]`)**: Full specifications, size/quantity variant selector with live pricing, direct WhatsApp enquiry generator, and call button.
- **About Us (`/about`)**: Factual store overview highlighting local service.
- **Gallery (`/gallery`)**: Masonry image gallery with category filters and lightbox view.
- **Contact Page (`/contact`)**: Store address, clickable `tel:` buttons, online enquiry submission form, and embedded Google Maps for Old Pallavaram, Chennai.

---

## 3. Private Owner Admin Panel

Access at: `http://localhost:3000/admin`

> **Note**: The public navigation bar contains zero links to `/admin`.  
> **Credentials** are stored in your `.env` file — never stored in this README.

### Protected Admin Routes:
- `/admin` - Admin Login Screen
- `/admin/dashboard` - Overview metric cards (Total Products, Categories, Enquiries, Gallery Photos)
- `/admin/dashboard/products` - CRUD with multi-variant pricing (base price, selling price, discount per size variant)
- `/admin/dashboard/categories` - Add & manage product categories
- `/admin/dashboard/enquiries` - View customer enquiries & change status (`New`, `Contacted`, `Completed`)
- `/admin/dashboard/gallery` - Upload & delete showroom photos
- `/admin/dashboard/business-info` - Update store phone numbers, address, and operating hours dynamically
- `/admin/dashboard/settings` - Security parameters & deployment notes

---

## 4. Production Build & Deployment

To generate an optimized production build:
```bash
npm run build
npm start
```
