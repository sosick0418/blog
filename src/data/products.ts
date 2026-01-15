// Product data - loaded from JSON for API integration
import productsData from './products.json';

export interface Product {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  description: string;
  affiliateUrl?: string;
  rating?: number;
  specs?: { label: string; value: string }[];
  pros?: string[];
  cons?: string[];
  content?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Type assertion for JSON import
export const products: Product[] = productsData as Product[];

// Helper functions
export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => slugify(p.name) === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(p => p.category === category);
}

export function slugify(name: string): string {
  return name
    .replace(/[+]/g, '-')           // Replace + with -
    .replace(/[^\w\s가-힣-]/g, '')   // Remove special chars except Korean
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/-+/g, '-')            // Replace multiple - with single -
    .replace(/^-|-$/g, '')          // Remove leading/trailing -
    .toLowerCase();
}

export function getAllSlugs(): string[] {
  return products.map(p => slugify(p.name));
}
