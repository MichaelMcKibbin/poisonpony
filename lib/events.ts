import eventsData from '@/data/events.json';

export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  startsAtUtc: string;
  category: string;
  tags: string[];
  image: string;
}

export function getAllEvents(): Event[] {
  return eventsData as Event[];
}

export function getEventBySlug(slug: string): Event | undefined {
  return eventsData.find((event) => event.slug === slug) as Event | undefined;
}

export function getEventsByCategory(category: string): Event[] {
  return eventsData.filter((event) => event.category === category) as Event[];
}

export function getCategories(): string[] {
  const categories = new Set(eventsData.map((event) => event.category));
  return Array.from(categories).sort();
}

export function getTopEvents(count: number = 10): Event[] {
  // For now, return a random selection
  // In the future, this can be based on view statistics
  const shuffled = [...eventsData].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, eventsData.length)) as Event[];
}

export function searchEvents(query: string): Event[] {
  const lowerQuery = query.toLowerCase();
  return eventsData.filter((event) =>
    event.title.toLowerCase().includes(lowerQuery) ||
    event.description.toLowerCase().includes(lowerQuery) ||
    event.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  ) as Event[];
}
