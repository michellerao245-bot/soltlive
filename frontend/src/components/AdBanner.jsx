// src/components/AdBanner.jsx
import React, { useState, useEffect } from 'react';
import { ExternalLink, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdBanner = ({ ad, onClose }) => {
  const [show, setShow] = useState(true);
  const navigate = useNavigate();

  if (!show) return null;

  // Safe links verification
  const websiteUrl = ad?.website || ad?.link || "#";

  return (
    <div className="relative bg-[#131722] border border-gray-800 rounded-xl overflow-hidden mb-4 group">
      
      {/* Permanent Header with "Advertise Here" option */}
      <div className="flex items-center justify-between p-3 border-b border-gray-800/50 bg-[#1e232e]/30">
        <span className="text-[10px] uppercase tracking-wider text-yellow-400 font-semibold">
          Sponsored ⚡
        </span>
        <button 
          onClick={() => navigate("/advertise")}
          className="text-[11px] text-purple-400 hover:text-purple-300 font-medium transition flex items-center gap-1"
        >
          Advertise Here ↗
        </button>
      </div>

      {/* Close button (Optional - hidden on default view until hover) */}
      <button
        onClick={() => { setShow(false); onClose?.(); }}
        className="absolute top-10 right-2 z-10 p-1 bg-black/50 hover:bg-red-500 rounded-full transition-colors opacity-0 group-hover:opacity-100"
      >
        <X size={14} className="text-white" />
      </button>

      {/* Main Content Layout */}
      <div className="flex flex-col p-4 space-y-3">
        
        {/* Top Section: Media placeholder & Content */}
        <div className="flex items-start gap-3">
          {/* Media Box */}
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/20 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
            {ad?.hasBanner && ad?.bannerPreview ? (
              <img
                src={ad.bannerPreview}
                alt={ad.projectName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-500 text-[10px] font-medium uppercase text-center p-1">🚀 Solt</span>
            )}
          </div>

          {/* Texts info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-sm truncate">{ad?.projectName || "Promotion"}</h3>
            <p className="text-gray-400 text-xs mt-1 line-clamp-3 leading-relaxed">
              {ad?.description || "No description provided."}
            </p>
          </div>
        </div>

        {/* Bottom Section: Action Navigation Links */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-800/40">
          <div className="flex items-center gap-3">
            {websiteUrl !== "#" && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:text-green-300 text-xs flex items-center gap-1 font-semibold transition-colors bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20"
              >
                Visit Link <ExternalLink size={12} />
              </a>
            )}
            
            {ad?.telegram && (
              <a
                href={`https://t.me/${ad.telegram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-xs transition-colors"
              >
                Telegram
              </a>
            )}
          </div>
          
          <span className="text-[10px] text-gray-500 uppercase tracking-wider bg-gray-800/40 px-2 py-0.5 rounded">
            {ad?.plan || "Premium"} Plan
          </span>
        </div>

      </div>
    </div>
  );
};

export default AdBanner;