"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowDownToLine, Pencil, Trash2, Send } from "lucide-react";

// Typ pre jednu faktúru
interface Faktura {
  id: number;
  cisloFaktury: string;
  odberatelMeno: string;
  datumSplatnosti?: string;
  polozky?: FakturaPolozka[];
  stav?: "Zaplatené" | "Nezaplatené" | "Po splatnosti" | string;
}

interface FakturaPolozka {
  celkom?: number;
  cena?: number;
  pocet?: number;
  // môžeš pridať ďalšie polia podľa backendu
}

// NAVBAR komponent
function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-20 bg-white/20 backdrop-blur-md border-b border-white/30 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="text-2xl font-extrabold text-white drop-shadow tracking-tight">
          <Link href="/">dokumenti.sk</Link>
        </div>
        <div className="flex gap-4">
          <Link href="/"><button className="px-4 py-1 rounded-xl text-white hover:bg-white/30 transition">Home</button></Link>
          <Link href="/upload"><button className="px-4 py-1 rounded-xl text-white hover:bg-white/30 transition">Nahrať</button></Link>
          <Link href="/generator"><button className="px-4 py-1 rounded-xl text-white hover:bg-white/30 transition">Vytvoriť</button></Link>
          <Link href="/dashboard"><button className="px-4 py-1 rounded-xl text-white hover:bg-white/30 transition">Dashboard</button></Link>
          <Link href="https://univerzalkalkulacka.sk/" target="_blank"><button className="px-4 py-1 rounded-xl text-white hover:bg-white/30 transition">Kalkulačka</button></Link>
        </div>
      </div>
    </nav>
  );
}

const STAVY: Record<string, string> = {
  "Zaplatené": "text-green-600 font-semibold",
  "Nezaplatené": "text-yellow-500 font-semibold",
  "Po splatnosti": "text-red-600 font-semibold",
};

const FakturyPage = () => {
  const [faktury, setFaktury] = useState<Faktura[]>([]);
  const [search, setSearch] = useState("");
  const [stav, setStav] = useState("Všetky stavy");
  const [loading, setLoading] = useState(false);

  // Načítanie faktúr z backendu
  const fetchFaktury = async () => {
    setLoading(true);
    try {
      const res = await axios.get<Faktura[]>("/api/faktury");
      setFaktury(res.data);
    } catch {
      setFaktury([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFaktury();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Vyhľadávanie a filtrovanie
  const filteredFaktury = faktury.filter((f) => {
    const matchSearch =
      f.cisloFaktury?.toLowerCase().includes(search.toLowerCase()) ||
      f.odberatelMeno?.toLowerCase().includes(search.toLowerCase());
    const matchStav =
      stav === "Všetky stavy" || (f.stav || "Nezaplatené") === stav;
    return matchSearch && matchStav;
  });

  // Formát dátumu
  function formatDate(dateStr?: string) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("sk-SK");
  }

  // SUMA faktúry
  function sumaFaktury(polozky: FakturaPolozka[] = []) {
    return polozky.reduce((sum, p) => sum + (p.celkom ?? ((p.cena ?? 0) * (p.pocet ?? 1))), 0).toFixed(2);
  }

  // DELETE faktúry (voliteľné)
  async function deleteFaktura(id: number) {
    if (!confirm("Naozaj zmazať túto faktúru?")) return;
    await axios.delete(`/api/faktury/${id}`);
    fetchFaktury();
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-center">
      <Navbar />
      {/* Hero pozadie */}
      <div
        className="absolute inset-0 bg-cover bg-center z-[-2]"
        style={{ backgroundImage: "url('/images/faktura.png')" }}
      />
      {/* Overlay pre lepšiu čitateľnosť */}
      <div className="absolute inset-0 bg-black/40 z-[-1]" />

      <div className="flex flex-col items-center justify-center min-h-screen relative z-10 pt-32 pb-10">
        <div className="bg-white/20 backdrop-blur-md border border-white/30 shadow-xl rounded-2xl px-8 py-10 max-w-6xl w-full mt-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white drop-shadow-lg">
            Vydané faktúry
          </h1>
          {/* Filter a stav faktúr */}
          <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">
            <input
              type="text"
              placeholder="Vyhľadajte faktúru"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="p-2 border border-white/30 rounded-lg bg-white/50 focus:bg-white/80 text-black w-full md:w-auto"
            />
            <select
              className="p-2 border border-white/30 rounded-lg bg-white/50 focus:bg-white/80 text-black w-full md:w-auto"
              value={stav}
              onChange={e => setStav(e.target.value)}
            >
              <option>Všetky stavy</option>
              <option>Zaplatené</option>
              <option>Nezaplatené</option>
              <option>Po splatnosti</option>
            </select>
          </div>
          {/* Zoznam faktúr */}
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-left border-collapse rounded-xl overflow-hidden bg-white/60">
              <thead>
                <tr className="bg-white/40">
                  <th className="px-4 py-2 font-semibold">Číslo faktúry</th>
                  <th className="px-4 py-2 font-semibold">Odberateľ</th>
                  <th className="px-4 py-2 font-semibold">Splatnosť</th>
                  <th className="px-4 py-2 font-semibold">Čiastka</th>
                  <th className="px-4 py-2 font-semibold">Stav</th>
                  <th className="px-4 py-2 font-semibold">Akcie</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center p-8">Načítavam...</td></tr>
                ) : filteredFaktury.length === 0 ? (
                  <tr><td colSpan={6} className="text-center p-8">Žiadne faktúry</td></tr>
                ) : filteredFaktury.map((f) => (
                  <tr key={f.id} className="hover:bg-white/80 transition">
                    <td className="px-4 py-2">
                      <Link href={`/faktury/${f.id}`}>
                        <span className="text-blue-600 font-semibold underline cursor-pointer">{f.cisloFaktury}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-2">{f.odberatelMeno}</td>
                    <td className="px-4 py-2">{formatDate(f.datumSplatnosti)}</td>
                    <td className="px-4 py-2">{sumaFaktury(f.polozky ?? [])} €</td>
                    <td className={`px-4 py-2 ${STAVY[f.stav ?? "Nezaplatené"] ?? ""}`}>
                      {f.stav || "Nezaplatené"}
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <Link href={`/faktury/${f.id}`}>
                        <button title="Zobraziť detail" className="hover:text-blue-700">
                          <Pencil className="inline w-5 h-5" />
                        </button>
                      </Link>
                      <a href={`/api/faktury/${f.id}/pdf`} title="Stiahnuť PDF">
                        <ArrowDownToLine className="inline w-5 h-5 text-green-700 hover:text-green-900" />
                      </a>
                      <button title="Odoslať email" className="hover:text-orange-600" onClick={() => alert("Odoslanie e-mailu TODO!")}>
                        <Send className="inline w-5 h-5" />
                      </button>
                      <button title="Zmazať" className="hover:text-red-700" onClick={() => deleteFaktura(f.id)}>
                        <Trash2 className="inline w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Tlačidlo na pridanie novej faktúry */}
          <div className="mt-8 text-center">
            <Link href="/faktury/vytvorit">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl shadow-lg transition">
                Vytvoriť novú faktúru
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FakturyPage;
