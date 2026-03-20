import { siteUrl } from '@/lib/api';

export default function robots() {
  const base = siteUrl();
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
