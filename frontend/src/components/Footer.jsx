import React from 'react';

const Footer = () => (
  <footer className="bg-[#131722] border-t border-gray-800 px-6 py-6 mt-8">
    <div className="max-w-7xl mx-auto text-xs text-gray-400">
      <div className="flex flex-wrap justify-between gap-4">
        <div>
          <p className="text-white font-semibold text-sm">EcoLive</p>
          <p className="mt-1">Track, launch &amp; trade tokens</p>
        </div>
        <div className="flex flex-wrap gap-6">
          <div>
            <p className="text-white font-medium">Products</p>
            <div className="space-y-1 mt-1">
              <a href="#">Swap</a>
              <a href="#">Launch</a>
              <a href="#">Liquidity</a>
            </div>
          </div>
          <div>
            <p className="text-white font-medium">Docs</p>
            <div className="space-y-1 mt-1">
              <a href="#">API</a>
              <a href="#">GitHub</a>
            </div>
          </div>
          <div>
            <p className="text-white font-medium">Community</p>
            <div className="space-y-1 mt-1">
              <a href="#">Twitter</a>
              <a href="#">Discord</a>
              <a href="#">Telegram</a>
            </div>
          </div>
          <div>
            <p className="text-white font-medium">Legal</p>
            <div className="space-y-1 mt-1">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </div>
          </div>
        </div>
      </div>
      <p className="text-center mt-4 text-[10px] text-gray-500">© 2026 EcoLive — All rights reserved.</p>
    </div>
  </footer>
);

export default React.memo(Footer);