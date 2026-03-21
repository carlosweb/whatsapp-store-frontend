# White-Label WhatsApp Catalog & Ordering System 🚀

A high-performance, mobile-first "White Label" web application designed for business owners to create a digital product catalog in minutes. Customers can seamlessly browse products, manage their cart, and send final orders directly to the business owner's WhatsApp number.

This project was built with a strong focus on premium UI/UX, multi-language support, and native Dark Mode handling—making it an ideal starter kit for modern e-commerce catalogs.

## ✨ Key Features

- **🛍️ Customer View & Storefront**: 
  - Dynamic product catalog with grid/list responsive wrappers.
  - Multi-image swipeable Product Carousel for details.
  - Sticky interactive generic "View Cart" checkout footer.

- **🎛️ Admin Dashboard**:
  - Live configuration portal to customize the brand (Business Name, Logo, Color, WhatsApp Number).
  - Simple inventory management to add, edit, and safely delete products with multiple images.

- **🌍 Internationalization (i18n)**:
  - Natively supports **English**, **Português (PT-BR)**, and **Español**.
  - Includes an intuitive globe dropdown for customers to toggle storefront language locally without altering admin defaults.

- **🌓 True Dark & Light Mode Theme**:
  - Out-of-the-box support for beautiful, responsive dark-mode styling utilizing Vite + Tailwind CSS v4's native `@custom-variant dark`.
  - Accessible theme toggles integrated directly into navigation headers.

- **📱 WhatsApp Order Integration**:
  - Fully automated processing to construct WhatsApp URLs carrying formatted line items, cart totals, and delivery addresses directly into the merchant's DMs.

- **💾 Local Persistence**:
  - Zero-database dependency! All settings, cart items, language profiles, and products rely on robust `localStorage` Context APIs, enabling instant and free cloud deployments via Vercel/Netlify.

---

## 💻 Tech Stack

- **Framework**: React.js 18
- **Bundler**: Vite
- **Styling**: Tailwind CSS v4 
- **Routing/State**: React Context API & React Router DOM
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Localization**: i18next & react-i18next

---

## ⚙️ Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

Ensure you have **Node.js** (v18+) and **npm** installed.

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
This command compiles and lints everything into the `dist/` directory, which can be deployed to any static host.

---

## 🏗️ How It Works

1. **The Architecture**: Global application state is managed identically across all views inside `src/contexts/AppContext.jsx`. The application utilizes React Router to swap between the `/` path (Customer Store) and the `/admin` path (Business Dashboard) silently.
2. **First Run Setup**: The first time the app is launched—or when it's deployed fresh—the frontend will boot the Admin Wizard to dictate core store configurations.
3. **Cart & Checkout Flow**: The Context API retains Cart modifications silently and broadcasts signals to toast notifications. When proceeding to checkout, `whatsapp.js` translates the cart array into a heavily formatted, URL-safe JavaScript template payload.

---
*Built autonomously via Google Deepmind Antigravity framework workflow logic.*
