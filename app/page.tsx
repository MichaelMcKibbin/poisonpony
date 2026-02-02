import Link from 'next/link';
import { getAllEvents, getTopEvents, getCategories } from '@/lib/events';
import Countdown from '@/components/countdown';
import EventFilters from '@/components/event-filters';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Countdown Timers - Track Time to Important Events',
  description: 'Live countdown timers for important events, holidays, and special occasions. Track time remaining in years, days, hours, minutes, and seconds.',
  openGraph: {
    title: 'Countdown Timers - Track Time to Important Events',
    description: 'Live countdown timers for important events, holidays, and special occasions.',
    type: 'website',
  },
};

export default function Home() {
  const topEvents = getTopEvents(10);
  const allEvents = getAllEvents();
  const categories = getCategories();

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            ⏰ Countdown Timers
          </h1>
          <p className="text-xl text-gray-300">
            Track time to your favorite events and holidays
          </p>
        </div>

        {/* Top 10 Events */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">🔥 Popular Timers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topEvents.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.slug}`}
                className="bg-white/10 backdrop-blur-md rounded-lg p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 border border-white/20"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-300">{event.description}</p>
                  </div>
                  <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                    {event.category}
                  </span>
                </div>
                <Countdown targetDate={event.startsAtUtc} size="small" />
              </Link>
            ))}
          </div>
        </section>

        {/* All Events with Filters */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-6">📅 All Events</h2>
          <EventFilters events={allEvents} categories={categories} />
        </section>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-400 text-sm">
          <p>All times are converted to your local timezone</p>
        </footer>
      </div>
    </main>
  );
}
