'use client';

import { useEffect, useState } from 'react';

interface TimeRemaining {
  years: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

function calculateTimeRemaining(targetDate: string): TimeRemaining {
  const now = Date.now();
  const target = Date.parse(targetDate);
  const diffMs = target - now;

  if (diffMs <= 0) {
    return { years: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const years = Math.floor(days / 365);

  return {
    years,
    days: days % 365,
    hours: hours % 24,
    minutes: minutes % 60,
    seconds: seconds % 60,
    isPast: false,
  };
}

interface CountdownProps {
  targetDate: string;
  size?: 'small' | 'large';
}

export default function Countdown({ targetDate, size = 'large' }: CountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() =>
    calculateTimeRemaining(targetDate)
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  // Avoid hydration mismatch by showing placeholder until mounted
  if (!mounted) {
    return (
      <div className={size === 'large' ? 'text-center py-8' : 'text-sm'}>
        <div className="text-gray-400">Loading countdown...</div>
      </div>
    );
  }

  if (timeRemaining.isPast) {
    return (
      <div className={size === 'large' ? 'text-center py-8' : 'text-sm'}>
        <div className="text-red-500 font-semibold">This event has passed!</div>
      </div>
    );
  }

  const isSmall = size === 'small';
  const containerClass = isSmall
    ? 'flex gap-2 text-xs'
    : 'grid grid-cols-2 sm:grid-cols-5 gap-4';
  const unitClass = isSmall
    ? 'flex gap-1'
    : 'bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-4 shadow-lg';
  const valueClass = isSmall ? 'font-bold' : 'text-4xl font-bold text-white';
  const labelClass = isSmall ? 'text-gray-600' : 'text-sm text-blue-100 mt-1';

  return (
    <div className={containerClass}>
      {timeRemaining.years > 0 && (
        <div className={unitClass}>
          <div className={valueClass}>{timeRemaining.years}</div>
          <div className={labelClass}>{timeRemaining.years === 1 ? 'Year' : 'Years'}</div>
        </div>
      )}
      <div className={unitClass}>
        <div className={valueClass}>{timeRemaining.days}</div>
        <div className={labelClass}>{timeRemaining.days === 1 ? 'Day' : 'Days'}</div>
      </div>
      <div className={unitClass}>
        <div className={valueClass}>{timeRemaining.hours}</div>
        <div className={labelClass}>{timeRemaining.hours === 1 ? 'Hour' : 'Hours'}</div>
      </div>
      <div className={unitClass}>
        <div className={valueClass}>{timeRemaining.minutes}</div>
        <div className={labelClass}>{timeRemaining.minutes === 1 ? 'Minute' : 'Minutes'}</div>
      </div>
      <div className={unitClass}>
        <div className={valueClass}>{timeRemaining.seconds}</div>
        <div className={labelClass}>{timeRemaining.seconds === 1 ? 'Second' : 'Seconds'}</div>
      </div>
    </div>
  );
}
