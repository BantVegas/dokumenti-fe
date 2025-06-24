"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Upload, Folder, FileSignature, Calculator } from "lucide-react";

export default function Home() {
  const pathname = usePathname();

  return (
    <main
      className="min-h-screen flex flex-col justify-between bg-cover bg-center"
      style={{ backgroundImage: "url('/hero.jpg')" }}
    >
      {/* NAVBAR */}
      <header className="flex justify-between items-center px-6 py-4 bg-white/20 backdrop-blur-md border-b border-white/30 text-white">
        <h1 className="text-2xl font-bold">
          <Link href="/">dokumenti.sk</Link>
        </h1>
        <nav className="flex gap-6 text-sm font-medium">
          {[
            { href: "/about", label: "O nás" },
            { href: "/blog", label: "Blog" },
            { href: "/cennik", label: "Cenník" },
            { href: "/login", label: "Prihlásenie" },
          ].map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`relative pb-1 transition-colors duration-200 ${
                  isActive
                    ? "text-blue-500 font-semibold after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-blue-500 after:rounded"
                    : "text-white hover:text-yellow-300 hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:h-[2px] hover:after:w-full hover:after:bg-yellow-300 hover:after:rounded"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* HERO TEXT */}
      <div className="text-gray-900 text-center mt-16 px-4">
        <h2 className="text-5xl font-extrabold mb-4">dokumenti.sk</h2>
        <p className="text-lg">Vytváraj, nahrávaj a podpisuj dokumenty online s ľahkosťou</p>
      </div>

      {/* HLAVNÉ BOXY */}
      <div className="flex flex-col items-center gap-6 mt-16 px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Vytvoriť */}
          <div className="glass-card p-6 w-80 transition-all duration-300 hover:translate-y-[-4px] hover:scale-[1.03] text-gray-900">
            <div className="flex items-center gap-2 mb-2 font-bold text-lg">
              <FileText className="w-5 h-5 text-orange-400" /> Vytvoriť dokument
            </div>
            <p className="text-sm mb-4">Vyber šablónu ako životopis, splnomocnenie či žiadosť a vygeneruj dokument jednoducho.</p>
            <Link href="/generator">
              <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-xl w-full">Vytvoriť</button>
            </Link>
          </div>

          {/* Nahrať */}
          <div className="glass-card p-6 w-80 transition-all duration-300 hover:translate-y-[-4px] hover:scale-[1.03] text-gray-900">
            <div className="flex items-center gap-2 mb-2 font-bold text-lg">
              <Upload className="w-5 h-5 text-blue-400" /> Nahrať dokument
            </div>
            <p className="text-sm mb-4">Nahraj vlastný dokument vo formáte PDF alebo DOCX a nechaj ho AI analyzovať alebo podpíš.</p>
            <Link href="/upload">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl w-full">Nahrať</button>
            </Link>
          </div>

          {/* Spravovať */}
          <div className="glass-card p-6 w-80 transition-all duration-300 hover:translate-y-[-4px] hover:scale-[1.03] text-gray-900">
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
        <div className="flex flex-col md:flex-row gap-4 mt-2">
          {/* Faktúry */}
          <div className="glass-card p-6 text-center w-80 transition-all duration-300 hover:translate-y-[-4px] hover:scale-[1.03] text-gray-900 flex flex-col justify-between">
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
            className="glass-card p-6 text-center w-80 transition-all duration-300 hover:translate-y-[-4px] hover:scale-[1.03] text-gray-900 flex flex-col justify-between"
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
      <footer className="text-gray-900/70 text-sm text-center mt-16 mb-6">
        &copy; 2025 dokumenti.sk – Všetky práva vyhradené
      </footer>
    </main>
  );
}
