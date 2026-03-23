-- Supabase Schema for White-Label Product Catalog

-- 1. Create `stores` table
CREATE TABLE public.stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  business_name TEXT NOT NULL,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#FF5C00',
  phone_number TEXT,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create `products` table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  image_urls TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Policies for Stores
-- Anyone can read stores
CREATE POLICY "Public can read stores" ON public.stores
  FOR SELECT USING (true);

-- Authenticated users can insert their own store
CREATE POLICY "Users can insert their own store" ON public.stores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own store
CREATE POLICY "Users can update their own store" ON public.stores
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own store
CREATE POLICY "Users can delete their own store" ON public.stores
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for Products
-- Anyone can read products
CREATE POLICY "Public can read products" ON public.products
  FOR SELECT USING (true);

-- Authenticated users can insert products for their store
CREATE POLICY "Users can insert products to their store" ON public.products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.stores 
      WHERE id = store_id AND user_id = auth.uid()
    )
  );

-- Users can update products for their store
CREATE POLICY "Users can update products of their store" ON public.products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.stores 
      WHERE id = store_id AND user_id = auth.uid()
    )
  );

-- Users can delete products for their store
CREATE POLICY "Users can delete products of their store" ON public.products
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.stores 
      WHERE id = store_id AND user_id = auth.uid()
    )
  );
