import { api, siteUrl } from '@/lib/api';

export default async function sitemap() {
  const base = siteUrl();
  const staticRoutes = ['', '/browse', '/post-property', '/brokers'];
  const staticUrls = staticRoutes.map((r) => ({ url: `${base}${r}`, lastModified: new Date() }));

  let propertyUrls = [];
  try {
    const data = await api('/api/website/properties?limit=200');
    propertyUrls = (data.properties || []).map((p) => ({
      url: `${base}/property/${p._id}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
    }));
  } catch {
    propertyUrls = [];
  }

  let brokerUrls = [];
  try {
    const data = await api('/api/website/brokers?limit=200');
    brokerUrls = (data.brokers || []).map((b) => ({
      url: `${base}/brokers/${b._id}`,
      lastModified: new Date(),
    }));
  } catch {
    brokerUrls = [];
  }

  return [...staticUrls, ...propertyUrls, ...brokerUrls];
}
