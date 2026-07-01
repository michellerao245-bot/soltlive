// src/components/AdBanner.jsx
import React, { useState, useEffect } from 'react';
import { ExternalLink, Play, Pause, X } from 'lucide-react';

const AdBanner = ({ ad, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [show, setShow] = useState(true);

  // Auto-close after 10 seconds (optional)
  useEffect(() => {
    const timer = setTimeout(() => {
      // setShow(false); // Uncomment if you want auto-close
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="relative bg-[#1a1a2e] border border-gray-700/50 rounded-2xl overflow-hidden mb-4 group">
      {/* Close button */}
      <button
        onClick={() => { setShow(false); onClose?.(); }}
        className="absolute top-2 right-2 z-10 p-1.5 bg-black/50 hover:bg-red-500 rounded-full transition-colors opacity-0 group-hover:opacity-100"
      >
        <X size={16} className="text-white" />
      </button>

      <div className="flex flex-col md:flex-row items-stretch">
        {/* Left: Image/Video */}
        <div className="md:w-1/3 relative bg-[#0a0a16] flex items-center justify-center p-2">
          {ad.hasVideo && ad.videoPreview ? (
            <video
              src={ad.videoPreview}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-40 md:h-48 object-cover rounded-xl"
              onMouseEnter={() => setIsPlaying(true)}
              onMouseLeave={() => setIsPlaying(false)}
            />
          ) : ad.hasBanner && ad.bannerPreview ? (
            <img
              src={ad.bannerPreview}
              alt={ad.projectName}
              className="w-full h-40 md:h-48 object-cover rounded-xl"
            />
          ) : (
            <div className="w-full h-40 md:h-48 bg-gradient-to-r from-green-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
              <span className="text-gray-500 text-sm">No media</span>
            </div>
          )}
        </div>

        {/* Right: Content */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-white font-bold text-lg">{ad.projectName}</h3>
            <p className="text-gray-400 text-sm mt-1 line-clamp-2">{ad.description}</p>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              {ad.website && (
                <a
                  href={ad.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 text-sm flex items-center gap-1 transition-colors"
                >
                  Visit <ExternalLink size={14} />
                </a>
              )}
              {ad.telegram && (
                <a
                  href={`https://t.me/${ad.telegram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                >
                  Telegram
                </a>
              )}
              {ad.twitter && (
                <a
                  href={`https://twitter.com/${ad.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                >
                  Twitter
                </a>
              )}
            </div>
            <span className="text-xs text-gray-500">{ad.plan} Plan</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;