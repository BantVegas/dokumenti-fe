"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Navbar (presne ten istý ako pri O nás)
function Navbar() {
  const pathname = usePathname();
  const navLinks = [
    { href: "/", label: "Domov" },
    { href: "/onas", label: "O nás" },
    { href: "/blog", label: "Blog" },
    { href: "/cennik", label: "Cenník" },
    { href: "/login", label: "Prihlásenie" },
  ];
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white/20 backdrop-blur-md border-b border-white/30 text-white">
      <h1 className="text-2xl font-bold">
        <Link href="/">dokumenti.sk</Link>
      </h1>
      <nav className="flex gap-6 text-sm font-medium">
        {navLinks.map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`relative pb-1 transition-colors duration-200 ${
                isActive
                  ? "text-blue-400 font-semibold after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-blue-400 after:rounded"
                  : "text-white hover:text-yellow-300"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 text-center text-white/80 py-6 text-sm">
      &copy; {new Date().getFullYear()} dokumenti.sk – Všetky práva vyhradené
      <div className="mt-1 opacity-60">
      </div>
    </footer>
  );
}

export default function BlogPage() {
  return (
    <main
      className="relative min-h-screen bg-cover bg-center flex flex-col justify-between"
      style={{ backgroundImage: "url('/images/faktura.png')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 z-0" />

      {/* Navbar */}
      <div className="relative z-20">
        <Navbar />
      </div>

      {/* Obsah */}
      <div className="flex-grow flex items-center justify-center relative z-10">
        <section className="w-full max-w-5xl px-8 py-14 md:py-20 rounded-3xl shadow-2xl bg-white/25 backdrop-blur-xl text-white flex flex-col gap-6 mt-8 mb-10">
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">Blog</h1>

          <article>
            <h2 className="text-2xl font-bold mb-2">
              Prečo digitalizovať právne dokumenty a čo vám to prinesie?
            </h2>
            <p className="text-gray-200 text-sm mb-4">Publikované: 25. jún 2025</p>

            <p className="mb-4 text-lg">
              Digitalizácia prenikla do všetkých oblastí života – a právne služby nie sú výnimkou.
              Kým v minulosti bolo potrebné navštíviť právnika kvôli jednoduchému dokumentu, dnes ho
              môžete vytvoriť a analyzovať online, z pohodlia domova.
            </p>

            <p className="mb-4 text-lg">
              Služby ako <strong>dokumenti.sk</strong> prinášajú výhody ako:
            </p>

            <ul className="list-disc list-inside mb-4 space-y-1 pl-4">
              <li>Okamžité generovanie dokumentu podľa aktuálnych zákonov</li>
              <li>AI kontrola rizík a odporúčaní priamo v dokumente</li>
              <li>Bezpečné a anonymné spracovanie údajov</li>
              <li>Šetrenie času aj financií</li>
            </ul>

            <p className="mb-4 text-lg">
              Technológie nám umožňujú získať právnu pomoc rýchlejšie, bez stresu a lacnejšie. AI
              nevytláča právnikov – práve naopak, dopĺňa ich. Bežné dokumenty zvládne generovať a
              kontrolovať automatizovaný systém, zatiaľ čo právnik sa môže venovať komplexným prípadom.
            </p>

            <p className="mb-4 text-lg">
              Ak ešte stále váhate, či digitalizovať svoju zmluvnú dokumentáciu – začnite s jednoduchým
              dokumentom na <strong>dokumenti.sk</strong> a presvedčte sa sami, aké jednoduché a
              efektívne to je.
            </p>

            <p className="italic text-white/80">Budúcnosť je digitálna. A právna pomoc tiež.</p>
          </article>
        </section>
      </div>

      {/* Footer */}
      <div className="relative z-20">
        <Footer />
      </div>
    </main>
  );
}
