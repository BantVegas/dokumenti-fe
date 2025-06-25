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
      <nav className="bg-white/10 backdrop-blur-md text-white p-4 shadow-md flex items-center justify-between">
        <div className="text-lg font-semibold">dokumenti.sk</div>
        <div className="flex space-x-4">
          <Link href="/" className="glass-card px-3 py-1 transition-all duration-200 hover:translate-y-[-2px] hover:scale-[1.02]">
            Home
          </Link>
          <Link href="/upload" className="glass-card px-3 py-1 transition-all duration-200 hover:translate-y-[-2px] hover:scale-[1.02]">
            Nahráť
          </Link>
          <Link href="/faktura" className="glass-card px-3 py-1 transition-all duration-200 hover:translate-y-[-2px] hover:scale-[1.02]">
            Faktúra
          </Link>
          <Link href="/kalkulacka" className="glass-card px-3 py-1 transition-all duration-200 hover:translate-y-[-2px] hover:scale-[1.02]">
            Kalkulačka
          </Link>
        </div>
      </nav>

      <main className="flex-grow flex items-center justify-center px-4 py-10">
        <div className="glass-card p-10 max-w-7xl w-full text-white transition-all duration-200 hover:translate-y-[-4px] hover:scale-[1.03]">
          <h2 className="text-2xl font-bold mb-6">História AI analýz</h2>

          {loading && <p className="text-white/70">Načítavam...</p>}

          {!loading && history.length === 0 && (
            <p className="text-white/60">Zatiaľ nemáš uložené žiadne analýzy.</p>
          )}

          {history.length > 0 && (
            <div className="overflow-x-auto mt-4">
              <table className="table-auto w-full border-collapse text-sm">
                <thead className="glass-card text-white transition-all duration-200 hover:translate-y-[-4px] hover:scale-[1.03]">
                  <tr>
                    <th className="px-4 py-2 text-left">Typ</th>
                    <th className="px-4 py-2 text-left">Zhodnotenie</th>
                    <th className="px-4 py-2 text-left">Riziká</th>
                    <th className="px-4 py-2 text-left">Odporúčania</th>
                    <th className="px-4 py-2 text-left">Záver</th>
                    <th className="px-4 py-2 text-left">Jazyk</th>
                    <th className="px-4 py-2 text-left">Dátum</th>
                    <th className="px-4 py-2 text-left">Akcia</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-white/20 hover:bg-white/5"
                    >
                      <td className="px-4 py-2">{item.typ}</td>
                      <td className="px-4 py-2">{item.zhodnotenie}</td>
                      <td className="px-4 py-2">{item.rizika}</td>
                      <td className="px-4 py-2">{item.odporucania}</td>
                      <td className="px-4 py-2">{item.zaver}</td>
                      <td className="px-4 py-2">{item.jazyk}</td>
                      <td className="px-4 py-2">
                        {new Date(item.createdAt).toLocaleString("sk-SK")}
                      </td>
                      <td className="px-4 py-2 space-y-2">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded w-full"
                        >
                          Vymazať
                        </button>
                        <button
                          onClick={() => handleGenerateResponse(item)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded w-full"
                          disabled={generatingId === item.id}
                        >
                          {generatingId === item.id ? "Generujem..." : "Odpovedať"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {selectedResponse && (
                <div className="mt-6 bg-white/20 text-white p-6 rounded-xl">
                  <h3 className="text-lg font-semibold mb-2">
                    💬 Návrh právnej odpovede:
                  </h3>
                  <p className="whitespace-pre-wrap">{selectedResponse}</p>
                </div>
              )}
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



