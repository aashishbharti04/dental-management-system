import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/env';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const lastModified = new Date();
  return [
    { url: base, lastModified, changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/login`, lastModified, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${base}/register`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
