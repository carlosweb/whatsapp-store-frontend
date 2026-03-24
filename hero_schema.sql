-- Schema for Hero Carousel Slides

-- 1. Create `hero_slides` table
CREATE TABLE public.hero_slides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  cta_text TEXT,
  cta_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Row Level Security (RLS) Policies for `hero_slides`
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

-- Anyone can read slides
CREATE POLICY "Public can read hero slides" ON public.hero_slides
  FOR SELECT USING (true);

-- Authenticated admins can insert slides for their store
CREATE POLICY "Users can insert hero slides to their store" ON public.hero_slides
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.stores 
      WHERE id = store_id AND user_id = auth.uid()
    )
  );

-- Admins can update slides for their store
CREATE POLICY "Users can update hero slides of their store" ON public.hero_slides
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.stores 
      WHERE id = store_id AND user_id = auth.uid()
    )
  );

-- Admins can delete slides for their store
CREATE POLICY "Users can delete hero slides of their store" ON public.hero_slides
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.stores 
      WHERE id = store_id AND user_id = auth.uid()
    )
  );

-- 3. Create Storage Bucket for Hero Images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('hero-images', 'hero-images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS for Storage Bucket `hero-images`
-- Public can read images
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'hero-images');

-- Auth users can upload images
CREATE POLICY "Auth users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'hero-images' AND auth.role() = 'authenticated'
  );

CREATE POLICY "Auth users can update images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'hero-images' AND auth.role() = 'authenticated'
  );

CREATE POLICY "Auth users can delete images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'hero-images' AND auth.role() = 'authenticated'
  );
