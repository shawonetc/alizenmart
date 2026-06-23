import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://speedbazar.com';
  
  // Base URLs
  const routes = [
    '',
    '/featured',
    '/flash-sale',
    '/categories',
    '/track-order',
    '/login',
    '/register',
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Categories list
  const staticCategories = [
    'gadgets',
    'smart-electronics',
    'home-lifestyle',
    'beauty-personal',
    'healthy-food',
    'fashion',
    'mom-baby',
    'home-kitchen',
    'appliances',
    'fitness-health',
    'smart-watch',
    'religious',
    'peripherals',
    'smart-furniture',
    'books',
    'others'
  ];

  const categoryRoutes = staticCategories.map((slug) => ({
    url: `${siteUrl}/category/${slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Fetch products from Supabase
  let productRoutes: any[] = [];
  try {
    const { data: products } = await supabase
      .from('products')
      .select('title, updated_at')
      .order('created_at', { ascending: false });

    const generateSlug = (str: string) => {
      return str
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\u0980-\u09FF-]+/g, '')
        .replace(/-+/g, '-')
        .replace(/(^-|-$)+/g, '');
    };

    if (products && products.length > 0) {
      productRoutes = products.map((product) => {
        const productSlug = generateSlug(product.title);
        return {
          url: `${siteUrl}/product-details/${encodeURIComponent(productSlug)}`,
          lastModified: product.updated_at ? new Date(product.updated_at).toISOString() : new Date().toISOString(),
          changeFrequency: 'daily' as const,
          priority: 0.6,
        };
      });
    }
  } catch (err) {
    console.error('Error generating product sitemap routes:', err);
  }

  return [...routes, ...categoryRoutes, ...productRoutes];
}
