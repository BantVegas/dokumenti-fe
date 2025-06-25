"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// NAVBAR komponent priamo v tejto stránke:
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

// FOOTER komponent priamo v tejto stránke:
function Footer() {
  return (
    <footer className="relative z-10 text-center text-white/80 py-6 text-sm">
      &copy; {new Date().getFullYear()} dokumenti.sk – Všetky práva vyhradené
    </footer>
  );
}

export default function OnasPage() {
  return (
    <main
      className="relative min-h-screen bg-cover bg-center flex flex-col justify-between"
      style={{ backgroundImage: "url('/images/faktura.png')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 z-0" />

      {/* NAVBAR */}
      <div className="relative z-20">
        <Navbar />
      </div>

      {/* OBSAH */}
      <div className="flex-grow flex items-center justify-center relative z-10">
        <section className="w-full max-w-5xl px-8 py-14 md:py-20 rounded-3xl shadow-2xl bg-white/25 backdrop-blur-xl text-white flex flex-col gap-5 mt-8 mb-10">
          <h1 className="text-5xl font-extrabold mb-2 drop-shadow-lg">O nás</h1>
          <p className="text-lg">
            <strong>dokumenti.sk</strong> vznikol s víziou sprístupniť právne služby na Slovensku každému. Chceme, aby právo bolo bežnou súčasťou života – dostupné, zrozumiteľné a moderné.
          </p>
          <p className="text-lg">
            Sme tím vývojárov, právnikov, dizajnérov a AI nadšencov, ktorých spája túžba zmeniť spôsob, ako ľudia pracujú s dokumentami. Staviame most medzi svetom paragrafov a digitálnou budúcnosťou.
          </p>
          <p>
            <span className="font-semibold text-xl">Prečo to robíme?</span>
            <br />
            Z vlastnej skúsenosti vieme, že tradičný právny servis je drahý, pomalý a často neprístupný. Preto sme vybudovali platformu, kde si každý môže vytvoriť zmluvu, splnomocnenie, výpoveď, faktúru či iný dokument – rýchlo, online, na mieru. Naša AI analyzuje vaše dokumenty, upozorní na riziká a odporučí úpravy.
          </p>
          <p>
            <span className="font-semibold text-xl">Čomu veríme?</span>
            <ul className="list-disc list-inside ml-5 mt-2 space-y-1">
              <li><strong>Transparentnosť</strong> – žiadne skryté poplatky ani drobné písmená.</li>
              <li><strong>Dostupnosť</strong> – služby pre jednotlivcov, podnikateľov aj firmy.</li>
              <li><strong>Inovácia</strong> – najnovšie AI a automatizácia pre všetkých.</li>
              <li><strong>Bezpečnosť</strong> – dôraz na ochranu dát a GDPR.</li>
              <li><strong>Vzdelávanie</strong> – blogy, tipy a jednoduché vysvetlenia legislatívy.</li>
            </ul>
          </p>
          <p>
            <span className="font-semibold text-xl">Naša vízia a plány</span>
            <br />
            Postupne rozširujeme platformu o online právne konzultácie, AI chat s právnikom, nové šablóny (hypotéky, startupy, rodinné právo), automatickú aktualizáciu dokumentov podľa legislatívy, digitálny podpis aj integráciu s úradmi.
          </p>
          <p>
            <strong>Spájame právo a technológie, aby ste sa mohli sústrediť na život, podnikanie a slobodu.</strong>
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-6">
            <div>
              <div className="text-lg font-bold">Martin Varga</div>
              <div className="text-sm text-white/80">Zakladateľ &amp; vývojár</div>
            </div>
            <div>
              <div className="text-lg font-bold">Mgr. Jana Nováková</div>
              <div className="text-sm text-white/80">Právna špecialistka</div>
            </div>
            <div>
              <div className="text-lg font-bold">Tím dokumenti.sk</div>
              <div className="text-sm text-white/80">…a ďalší odborníci</div>
            </div>
          </div>
          <p className="text-center font-semibold mt-8 text-xl drop-shadow-sm">
            Sme <span className="text-white font-black">dokumenti.sk</span> – právo jednoducho, dostupne a bezpečne.<br />Ďakujeme, že nám veríte!
          </p>
        </section>
      </div>

      {/* FOOTER */}
      <div className="relative z-20">
        <Footer />
      </div>
    </main>
  );
}

