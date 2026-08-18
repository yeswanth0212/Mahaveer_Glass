# Mahaveer Glass & Plywood Hardware - Official Business Website

Production-ready, full-stack responsive web application for **Mahaveer Glass & Plywood Hardware**, located in Old Pallavaram, Chennai - 600 117.

Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Lucide Icons**, **Mongoose / MongoDB** (with seamless persistent fallback), **Bcryptjs**, and **JWT Authentication**.

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
The `.env` file is pre-configured with default values:
```env
MONGODB_URI=mongodb://localhost:27017/mahaveer_db
JWT_SECRET=YOUR_SECRET_HERE
ADMIN_EMAIL=ADMIN_EMAIL_REDACTED
ADMIN_PASSWORD=YOUR_PASSWORD_HERE
NEXT_PUBLIC_DEFAULT_WHATSAPP=917871457430
```

*Note: If MongoDB is not running locally, the application automatically uses a persistent local JSON store (`data/db_fallback.json`) so all store data, price edits, products, and enquiries run out-of-the-box without requiring MongoDB setup.*

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
- **Product Detail (`/products/[id]`)**: Full specifications, available finish variants (Antique / S.S / Brass), direct WhatsApp enquiry generator, call button, and order form.
- **About Us (`/about`)**: Factual store overview highlighting local service and non-fabricated points.
- **Gallery (`/gallery`)**: Masonry image gallery with category filters and lightbox view.
- **Contact Page (`/contact`)**: Store address, 4 clickable `tel:` buttons, online enquiry submission form, and embedded Google Maps for Old Pallavaram, Chennai.

---

## 3. Private Owner Admin Panel

Access at: `http://localhost:3000/admin`

> **Note**: The public navigation bar contains zero links to `/admin`.

### Default Login Credentials:
- **Email**: `ADMIN_EMAIL_REDACTED`
- **Password**: see .env file

### Protected Admin Routes:
- `/admin` - Admin Login Screen
- `/admin/dashboard` - Overview metric cards (Total Products, Categories, Enquiries, Gallery Photos)
- `/admin/dashboard/products` - CRUD modal & table (Add/Edit product prices, descriptions, variants, stock status)
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
