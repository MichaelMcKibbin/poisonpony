import { MetadataRoute } from 'next';
import { getAllEvents } from '@/lib/events';

export default function sitemap(): MetadataRoute.Sitemap {
  const events = getAllEvents();
  const baseUrl = 'https://yoursite.com'; // Replace with your actual domain

  // Main pages
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];

  // Event detail pages
  const eventRoutes: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${baseUrl}/events/${event.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...routes, ...eventRoutes];
}
