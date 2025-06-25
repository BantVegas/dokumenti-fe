"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Upload, Folder, FileSignature, Calculator, Menu, X } from "lucide-react";

export default function Home() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/onas", label: "O nás" },
    { href: "/blog", label: "Blog" },
    { href: "/cennik", label: "Cenník" },
    { href: "/login", label: "Prihlásenie" },
  ];

  return (
    <main
      className="min-h-screen flex flex-col bg-cover bg-center"
      style={{ backgroundImage: "url('/hero.jpg')" }}
    >
      {/* NAVBAR */}
      <header className="relative z-30 flex items-center justify-between px-4 sm:px-8 py-4 bg-white/20 backdrop-blur-md border-b border-white/30 text-white">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="w-6 h-6 text-white/80" />
          <Link href="/" className="hover:underline">dokumenti.sk</Link>
        </h1>

        {/* Desktop menu */}
        <nav className="hidden md:flex gap-6 text-base font-medium">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`relative pb-1 px-1 rounded transition-colors duration-200 ${
                  isActive
                    ? "text-blue-400 font-bold after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-blue-400 after:rounded"
                    : "text-white hover:text-yellow-300"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Hamburger button - mobile only */}
        <button
          className="md:hidden p-2 rounded focus:outline-none"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Otvoriť menu"
        >
          {menuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>

        {/* Mobile menu */}
        {menuOpen && (
          <nav className="absolute top-full left-0 w-full bg-white/90 text-gray-900 flex flex-col gap-2 py-4 px-6 rounded-b-2xl shadow-xl animate-in fade-in z-50">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`py-3 px-2 rounded text-lg font-medium ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "hover:bg-yellow-50 hover:text-yellow-700"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        )}
      </header>

      {/* HERO TEXT */}
      <div className="text-white text-center mt-16 px-4">
        <h2 className="text-5xl font-extrabold mb-4 drop-shadow-lg">dokumenti.sk</h2>
        <p className="text-lg font-medium drop-shadow">Vytváraj, nahrávaj a podpisuj dokumenty online s ľahkosťou</p>
      </div>

      {/* HLAVNÉ BOXY */}
      <div className="flex flex-col items-center gap-6 mt-12 sm:mt-16 px-2 sm:px-4">
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl">
          {/* Vytvoriť */}
          <div className="glass-card p-6 w-full md:w-80 transition-all duration-300 hover:translate-y-[-4px] hover:scale-[1.03] text-gray-900">
            <div className="flex items-center gap-2 mb-2 font-bold text-lg">
              <FileText className="w-5 h-5 text-orange-400" /> Vytvoriť dokument
            </div>
            <p className="text-sm mb-4">Vyber šablónu ako životopis, splnomocnenie či žiadosť a vygeneruj dokument jednoducho.</p>
            <Link href="/generator">
              <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-xl w-full">Vytvoriť</button>
            </Link>
          </div>

          {/* Nahrať */}
          <div className="glass-card p-6 w-full md:w-80 transition-all duration-300 hover:translate-y-[-4px] hover:scale-[1.03] text-gray-900">
            <div className="flex items-center gap-2 mb-2 font-bold text-lg">
              <Upload className="w-5 h-5 text-blue-400" /> Nahrať dokument
            </div>
            <p className="text-sm mb-4">Nahraj vlastný dokument vo formáte PDF alebo DOCX a nechaj ho AI analyzovať alebo podpíš.</p>
            <Link href="/upload">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl w-full">Nahrať</button>
            </Link>
          </div>

          {/* Spravovať */}
          <div className="glass-card p-6 w-full md:w-80 transition-all duration-300 hover:translate-y-[-4px] hover:scale-[1.03] text-gray-900">
            <div className="flex items-center gap-2 mb-2 font-bold text-lg">
              <Folder className="w-5 h-5 text-white" /> Spravovať dokumenty
            </div>
            <p className="text-sm mb-4">Zobraziť, upraviť alebo zmazať dokumenty, ktoré si vytvoril alebo nahral.</p>
            <Link href="/dashboard">
              <button className="bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-xl w-full">Dashboard</button>
            </Link>
          </div>
        </div>

        {/* Faktúry + Kalkulačka vedľa seba */}
        <div className="flex flex-col md:flex-row gap-4 w-full max-w-4xl mt-2">
          {/* Faktúry */}
          <div className="glass-card p-6 text-center w-full md:w-80 transition-all duration-300 hover:translate-y-[-4px] hover:scale-[1.03] text-gray-900 flex flex-col justify-between">
            <div className="flex justify-center items-center gap-2 mb-2 font-bold text-lg">
              <FileSignature className="w-5 h-5 text-amber-400" /> Faktúry
            </div>
            <p className="text-sm mb-4">Vytváraj faktúry jednoducho a exportuj ich do PDF s jedným klikom.</p>
            <Link href="/faktury">
              <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-xl w-full text-base">
                Prejsť na faktúry
              </button>
            </Link>
          </div>
          {/* Univerzálna kalkulačka */}
          <a
            href="https://univerzalkalkulacka.sk/"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card p-6 text-center w-full md:w-80 transition-all duration-300 hover:translate-y-[-4px] hover:scale-[1.03] text-gray-900 flex flex-col justify-between"
            style={{ textDecoration: "none" }}
          >
            <div className="flex justify-center items-center gap-2 mb-2 font-bold text-lg">
              <Calculator className="w-5 h-5 text-green-500" /> Univerzálna kalkulačka
            </div>
            <p className="text-sm mb-4">Otvoriť online kalkulačku pre dane, odvody, investície a viac. (nové okno)</p>
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-xl w-full text-base"
              type="button"
              tabIndex={-1}
            >
              Prejsť na kalkulačku
            </button>
          </a>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="text-gray-900/70 text-sm text-center mt-12 mb-4 sm:mb-6 px-2">
        &copy; 2025 dokumenti.sk – Všetky práva vyhradené
      </footer>
    </main>
  );
}
