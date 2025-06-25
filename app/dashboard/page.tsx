"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type AnalysisItem = {
  id: number;
  typ: string;
  zhodnotenie: string;
  rizika: string;
  odporucania: string;
  zaver: string;
  jazyk: string;
  createdAt: string;
};

export default function DashboardPage() {
  const [history, setHistory] = useState<AnalysisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
  const [generatingId, setGeneratingId] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://api.dokumenti.sk/api/analysis")
      .then((res) => res.json())
      .then((data) => {
        setHistory(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Chyba pri načítaní histórie:", err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: number) => {
    await fetch(`https://api.dokumenti.sk/api/analysis/${id}`, { method: "DELETE" });
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleGenerateResponse = async (item: AnalysisItem) => {
    setGeneratingId(item.id);
    setSelectedResponse(null);
    try {
      const res = await fetch("https://api.dokumenti.sk/api/analysis/response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error("Chyba zo servera");
      const data = await res.json();
      setSelectedResponse(data.odpoved);
    } catch {
      setSelectedResponse("⚠️ Nepodarilo sa získať právnu odpoveď.");
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center"
      style={{ backgroundImage: "url('/dashboard.jpg')" }}
    >
      {/* Navbar */}
      <nav className="bg-white/20 backdrop-blur-md text-white px-4 py-3 shadow-md flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="text-xl font-bold tracking-wide">dokumenti.sk</div>
        <div className="flex flex-wrap gap-2 mt-1 sm:mt-0">
          <Link href="/" className="glass-card px-4 py-2 rounded-xl text-base font-semibold transition hover:scale-105">
            Domov
          </Link>
          <Link href="/upload" className="glass-card px-4 py-2 rounded-xl text-base font-semibold transition hover:scale-105">
            Nahrať
          </Link>
          <Link href="/faktury" className="glass-card px-4 py-2 rounded-xl text-base font-semibold transition hover:scale-105">
            Faktúry
          </Link>
          <Link href="/kalkulacka" className="glass-card px-4 py-2 rounded-xl text-base font-semibold transition hover:scale-105">
            Kalkulačka
          </Link>
        </div>
      </nav>

      <main className="flex-grow flex items-center justify-center px-2 sm:px-4 py-8 sm:py-12">
        <div className="glass-card p-4 sm:p-8 max-w-7xl w-full text-white shadow-xl rounded-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white text-center">História AI analýz</h2>

          {loading && <p className="text-white/70 text-center">Načítavam...</p>}

          {!loading && history.length === 0 && (
            <p className="text-white/60 text-center">Zatiaľ nemáš uložené žiadne analýzy.</p>
          )}

          {history.length > 0 && (
            <div className="overflow-x-auto mt-4">
              <table className="min-w-[700px] w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-white/10 text-white">
                    <th className="px-2 py-2 text-left">Typ</th>
                    <th className="px-2 py-2 text-left min-w-[120px]">Zhodnotenie</th>
                    <th className="px-2 py-2 text-left min-w-[90px]">Riziká</th>
                    <th className="px-2 py-2 text-left min-w-[110px]">Odporúčania</th>
                    <th className="px-2 py-2 text-left">Záver</th>
                    <th className="px-2 py-2 text-left">Jazyk</th>
                    <th className="px-2 py-2 text-left min-w-[120px]">Dátum</th>
                    <th className="px-2 py-2 text-left">Akcia</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-white/15 hover:bg-white/10 transition"
                    >
                      <td className="px-2 py-2 align-top">{item.typ}</td>
                      <td className="px-2 py-2 align-top">{item.zhodnotenie}</td>
                      <td className="px-2 py-2 align-top">{item.rizika}</td>
                      <td className="px-2 py-2 align-top">{item.odporucania}</td>
                      <td className="px-2 py-2 align-top">{item.zaver}</td>
                      <td className="px-2 py-2 align-top">{item.jazyk}</td>
                      <td className="px-2 py-2 align-top whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleString("sk-SK")}
                      </td>
                      <td className="px-2 py-2 space-y-2 min-w-[110px]">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg w-full text-xs sm:text-sm"
                        >
                          Vymazať
                        </button>
                        <button
                          onClick={() => handleGenerateResponse(item)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg w-full mt-1 text-xs sm:text-sm"
                          disabled={generatingId === item.id}
                        >
                          {generatingId === item.id ? "Generujem..." : "Odpovedať"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedResponse && (
            <div className="mt-6 bg-white/20 text-white p-4 sm:p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-2">💬 Návrh právnej odpovede:</h3>
              <p className="whitespace-pre-wrap text-base">{selectedResponse}</p>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white/10 backdrop-blur-md text-white text-center py-4 text-sm">
        &copy; {new Date().getFullYear()} dokumenti.sk – Všetky práva vyhradené
      </footer>
    </div>
  );
}



