'use client';

import { useState } from 'react';
import Image from 'next/image';

interface EventImageProps {
  src: string;
  alt: string;
  priority?: boolean;
}

export default function EventImage({ src, alt, priority = false }: EventImageProps) {
  const [imageError, setImageError] = useState(false);

  if (imageError || !src) {
    return null; // Don't render anything if image is missing
  }

  return (
    <div className="max-w-4xl mx-auto mb-8 rounded-lg overflow-hidden shadow-2xl">
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={630}
        priority={priority}
        className="w-full h-auto object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  );
}
