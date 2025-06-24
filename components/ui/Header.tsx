"use client";

import { useState } from "react";
import { Menu, X, FileText } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-white/30 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2 text-xl font-bold text-gray-800">
          <FileText className="w-6 h-6 text-gray-700" />
          <span>dokumenti.sk</span>
        </div>

        {/* Desktop navigácia */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-800">
          <Link href="/" className="hover:text-blue-600 transition">Home</Link>
          <Link href="#about" className="hover:text-blue-600 transition">O nás</Link>
          <Link href="#blog" className="hover:text-blue-600 transition">Blog</Link>
          <Link href="#pricing" className="hover:text-blue-600 transition">Cenník</Link>
          <Link href="#login" className="hover:text-blue-600 transition">Prihlásenie</Link>
        </nav>

        {/* Hamburger menu */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobilné menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-4 flex flex-col space-y-2 bg-white/80 backdrop-blur-md">
          <Link href="/" className="text-gray-800 hover:text-blue-600">Home</Link>
          <Link href="#about" className="text-gray-800 hover:text-blue-600">O nás</Link>
          <Link href="#blog" className="text-gray-800 hover:text-blue-600">Blog</Link>
          <Link href="#pricing" className="text-gray-800 hover:text-blue-600">Cenník</Link>
          <Link href="#login" className="text-gray-800 hover:text-blue-600">Prihlásenie</Link>
        </div>
      )}
    </header>
  );
}

