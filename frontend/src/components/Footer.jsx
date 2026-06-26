import React from 'react';
import { Twitter, Github, Disc, Send } from 'lucide-react';

const Footer = () => (
  <footer className="bg-[#0b0e14] border-t border-gray-800 px-6 py-3 mt-4">
    <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-xs text-gray-500">
      <div className="flex items-center gap-4">
        <span className="text-white font-bold text-sm">EcoLive</span>
        <span>© 2026 All rights reserved</span>
      </div>
      <div className="flex items-center gap-4">
        <a href="#" className="hover:text-white transition"><Twitter size={14} /></a>
        <a href="#" className="hover:text-white transition"><Github size={14} /></a>
        <a href="#" className="hover:text-white transition"><Disc size={14} /></a>
        <a href="#" className="hover:text-white transition"><Send size={14} /></a>
        <span className="text-gray-600">|</span>
        <a href="#" className="hover:text-white transition">Privacy</a>
        <a href="#" className="hover:text-white transition">Terms</a>
        <a href="#" className="hover:text-white transition">Docs</a>
      </div>
    </div>
  </footer>
);

export default React.memo(Footer);