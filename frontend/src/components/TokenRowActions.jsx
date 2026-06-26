import React, { useState } from 'react';
import { Copy, ExternalLink, Share2, ShoppingCart, Star } from 'lucide-react';

const TokenRowActions = ({ token }) => {
  const [copied, setCopied] = useState(false);

  const copyAddress = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(token.pairAddress || token.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        onClick={(e) => e.stopPropagation()}
        className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition"
        title="Quick Buy"
      >
        <ShoppingCart size={14} />
      </button>
      <button
        onClick={copyAddress}
        className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition relative"
        title="Copy Address"
      >
        {copied ? <span className="text-green-400 text-[10px] absolute -top-4 left-1/2 -translate-x-1/2">Copied!</span> : null}
        <Copy size={14} />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); window.open(`https://dexscreener.com/${token.chain}/${token.pairAddress}`, '_blank'); }}
        className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition"
        title="Open Chart"
      >
        <ExternalLink size={14} />
      </button>
      <button
        onClick={(e) => e.stopPropagation()}
        className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition"
        title="Share"
      >
        <Share2 size={14} />
      </button>
    </div>
  );
};

export default React.memo(TokenRowActions);