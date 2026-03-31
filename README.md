# White-Label WhatsApp Catalog & Ordering System 🚀

A high-performance, mobile-first "White Label" web application designed for business owners to create a digital product catalog in minutes. Customers can seamlessly browse products, manage their cart, and send final orders directly to the business owner's WhatsApp number natively in **Brazilian Real (R$)**.

This project was built with a strong focus on premium UI/UX, multi-language support, and native Dark Mode handling—making it an ideal starter kit for modern e-commerce catalogs.

## ✨ Key Features

- **🛍️ Customer View & Storefront**: 
  - Dynamic product catalog with grid/list responsive wrappers.
  - Multi-image swipeable Product Carousel for details.
  - Sticky interactive generic "View Cart" checkout footer.

- **🎛️ Secure Admin Dashboard**:
  - Live configuration portal to customize the brand (Business Name, Logo, Color, WhatsApp Number).
  - Multi-tenant architecture secured by **Supabase Authentication**.
  - Simple inventory management to add, edit, and safely delete products with multiple images.
  - Drag-and-drop Hero Carousel Slide Manager using `@dnd-kit/sortable` with Image Uploads.

- **📈 Business Role Limits**:
  - Subscriptions govern catalog capabilities. Integrates a flexible `plan` schema enforcing product restrictions:
    - **Start (Free)**: Limit of 5 products.
    - **Standard**: Limit of 20 products.
    - **Business Pro**: Unlimited products.

- **🌍 Internationalization (i18n)**:
  - Natively supports **English**, **Português (PT-BR)**, and **Español**.
  - Includes an intuitive globe dropdown for customers to toggle storefront language locally. The Admin Frontend is also fully localized.

- **🌓 True Dark & Light Mode Theme**:
  - Out-of-the-box support for beautiful, responsive dark-mode styling utilizing Vite + Tailwind CSS v4's native `@custom-variant dark`.
  - Accessible theme toggles integrated directly into navigation headers.

- **📱 WhatsApp Order Integration**:
  - Fully automated processing to construct WhatsApp URLs carrying formatted line items, cart totals, and delivery addresses directly into the merchant's DMs.

- **☁️ Cloud Database & Storage**:
  - Fully integrated with **Supabase PostgreSQL**. Uses Row Level Security (RLS) to ensure multi-tenant data isolation.
  - Automatic Supabase bucket storage for handling and serving product and carousel images.

---

## 💻 Tech Stack

- **Framework**: React (TypeScript)
- **Bundler**: Vite
- **Styling**: Tailwind CSS v4 
- **Database & Auth**: Supabase (PostgreSQL, Storage, Auth)
- **Routing/State**: React Context API & React Router DOM
- **Drag & Drop**: dnd-kit
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Localization**: i18next & react-i18next

---

## ⚙️ Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

Ensure you have **Node.js** (v18+) and **npm** installed. You will also need a **Supabase** project.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/whatsapp-store-frontend.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd whatsapp-store-frontend
   ```

3. **Install the dependencies:**
   ```bash
   npm install
   ```

4. **Environment Setup:**
   Create a `.env` file in the root directory and add your Supabase connection strings:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   Apply the provided `supabase_schema.sql` and `hero_schema.sql` files inside your Supabase SQL Editor to generate the tables and policies.

### Running the App Locally

To start the Vite development server with Hot-Module Replacement (HMR):
```bash
npm run dev
```
Navigate to `http://localhost:5173` in your browser.

### Building for Production

To create an optimized production build:
```bash
npm run build
```
This command compiles and type-checks everything into the `dist/` directory, which can be deployed to any static host (Vercel, Netlify, etc.).

---

## 🏗️ How It Works

1. **The Architecture**: Global application state is managed across all views using React Context (`src/contexts/`). The App hooks into cloud data from Supabase and utilizes React Router to swap between the storefront and the `/admin/` dashboard.
2. **Setup & Auth**: The app gates the Admin Dashboard using session tokens. New users can sign up and establish their store configuration (`start` plan by default).
3. **Cart & Checkout Flow**: The Context API retains Cart modifications silently and broadcasts signals to toast notifications. When proceeding to checkout, `whatsapp.ts` translates the cart array into a heavily formatted, URL-safe JavaScript template payload using Brazilian currency formatting (R$).

---
*Built autonomously via Google Deepmind Antigravity framework workflow logic.*
