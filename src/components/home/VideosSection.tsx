'use client';

import { useState } from 'react';
import Image from 'next/image';

const YOUTUBE_CHANNEL = 'https://www.youtube.com/@amwcarrierpoint368/videos';

const videos = [
  {
    id: '2MEGhu80gZU',
    title: 'AVICENNA INTERNATIONAL MEDICAL UNIVERSITY Seniors Speak',
  },
  {
    id: 'VpLk3ymEEjY',
    title: 'FMGE/MCI PREPARATION CLASS OF ANATOMY@AIMU',
  },
  {
    id: 'xLZ-lDIPNUY',
    title: 'Hostel Life & Indian Food at AMW Partner Universities',
  },
];

export function VideosSection() {
  const [playingId, setPlayingId] = useState<string | null>(null);

  return (
    <section className="bg-white py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <span className="inline-block text-xs font-semibold text-orange uppercase tracking-wider mb-2">Watch Before You Decide</span>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-navy">
            Real Videos from <span className="text-teal-600">Real Students</span>
          </h2>
          <p className="mt-3 text-[15px] text-text-body max-w-2xl mx-auto">
            Hear directly from AMW students studying abroad – their first impressions, hostel life, clinical training, and honest advice for NEET aspirants.
          </p>
        </div>

        {/* 3-card grid — same as country cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {videos.map((video) => (
            <div key={video.id} className="rounded-xl border border-border bg-white overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              {/* Thumbnail / Player */}
              <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                {playingId === video.id ? (
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <button
                    onClick={() => setPlayingId(video.id)}
                    className="relative w-full h-full group cursor-pointer block"
                    aria-label={`Play video: ${video.title}`}
                  >
                    <Image
                      src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                      alt={video.title}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-navy/60 group-hover:bg-navy/50 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-orange rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </button>
                )}
              </div>
              {/* Title & link */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-[13px] font-bold text-navy leading-snug line-clamp-2 mb-3">{video.title}</h3>
                <div className="mt-auto">
                  <a
                    href={`https://www.youtube.com/watch?v=${video.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-2 rounded-full bg-orange text-white text-[13px] font-bold hover:bg-orange-hover transition-colors"
                  >
                    Watch on YouTube
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-8 sm:mt-10">
          <a
            href={YOUTUBE_CHANNEL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center h-10 sm:h-11 px-7 rounded-full border-2 border-navy text-navy text-[13px] sm:text-sm font-bold hover:bg-navy hover:text-white transition-colors"
          >
            View All Videos on YouTube →
          </a>
        </div>
      </div>
    </section>
  );
}