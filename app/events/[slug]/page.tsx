import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllEvents, getEventBySlug } from '@/lib/events';
import Countdown from '@/components/countdown';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all events (SSG)
export async function generateStaticParams() {
  const events = getAllEvents();
  return events.map((event) => ({
    slug: event.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    return {
      title: 'Event Not Found',
    };
  }

  const eventDate = new Date(event.startsAtUtc);
  const eventDateString = eventDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return {
    title: `${event.title} Countdown Timer - ${eventDateString}`,
    description: `${event.description} Live countdown showing years, days, hours, minutes, and seconds remaining until ${event.title}.`,
    openGraph: {
      title: `${event.title} Countdown`,
      description: event.description,
      type: 'website',
      images: event.image ? [{ url: event.image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${event.title} Countdown`,
      description: event.description,
      images: event.image ? [event.image] : [],
    },
  };
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const eventDate = new Date(event.startsAtUtc);
  const eventDateString = eventDate.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  const utcDateString = eventDate.toUTCString();

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    startDate: event.startsAtUtc,
    url: `https://yoursite.com/events/${event.slug}`,
    image: event.image,
    eventStatus: 'https://schema.org/EventScheduled',
  };

  return (
    <>
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="container mx-auto px-4 py-12">
          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center text-blue-300 hover:text-blue-200 mb-8 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to All Timers
          </Link>

          {/* Event Header */}
          <div className="text-center mb-12">
            <div className="inline-block bg-blue-500 text-white text-sm px-4 py-1 rounded-full mb-4">
              {event.category}
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              {event.title}
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {event.description}
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="max-w-4xl mx-auto mb-12">
            <Countdown targetDate={event.startsAtUtc} size="large" />
          </div>

          {/* Event Details */}
          <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Event Details</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-1">Your Local Time</h3>
                <p className="text-lg text-white">{eventDateString}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-1">UTC Time</h3>
                <p className="text-lg text-white">{utcDateString}</p>
              </div>

              {event.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-purple-500/50 text-white text-sm px-3 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Share Section */}
          <div className="text-center mt-12">
            <p className="text-gray-400 text-sm">
              Share this countdown with your friends and family!
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
