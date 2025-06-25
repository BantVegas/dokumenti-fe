"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

// Presný typ analýzy podľa uploadu
export interface AnalysisResultData {
  typ: string;
  zhodnotenie: string;
  rizika: string;
  odporucania: string;
  zaver: string;
  jazyk: string;
}

interface AnalysisResultModalProps {
  data: AnalysisResultData;
  onClose: () => void;
}

export default function AnalysisResultModal({
  data,
  onClose,
}: AnalysisResultModalProps) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    if (loading || saved) return;
    setLoading(true);
    try {
      const res = await fetch("http://api.dokumenti.sk/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error(`Server vrátil ${res.status}`);
      }
      setSaved(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } catch (err) {
      alert(
        "Chyba pri ukladaní analýzy: " +
          (err instanceof Error ? err.message : String(err))
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-8 space-y-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl font-bold"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-green-700 flex items-center gap-2">
          📄 Výsledok AI analýzy
        </h2>

        <div className="space-y-2 text-gray-800 text-sm">
          <p>
            <strong>🧾 Typ dokumentu:</strong> {data.typ}
          </p>
          <p>
            <strong>⚖️ Právne zhodnotenie:</strong>{" "}
            <span className="whitespace-pre-wrap">{data.zhodnotenie}</span>
          </p>
          <p>
            <strong>⚠️ Riziká:</strong>{" "}
            <span className="whitespace-pre-wrap">{data.rizika}</span>
          </p>
          <p>
            <strong>✅ Odporúčania:</strong>{" "}
            <span className="whitespace-pre-wrap">{data.odporucania}</span>
          </p>
          <p>
            <strong>📌 Záver:</strong>{" "}
            <span className="whitespace-pre-wrap">{data.zaver}</span>
          </p>
          <p>
            <strong>🌐 Jazyk:</strong> {data.jazyk}
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={handleSave}
            disabled={loading || saved}
            className={`py-2 px-4 rounded-lg font-semibold text-white ${
              saved
                ? "bg-gray-400 cursor-default"
                : loading
                ? "bg-green-500 hover:bg-green-600"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {saved ? "Uložené ✅" : loading ? "Ukladám…" : "Uložiť analýzu"}
          </button>
          <button
            onClick={onClose}
            className="py-2 px-4 rounded-lg bg-black hover:bg-gray-800 text-white font-semibold"
          >
            Zavrieť
          </button>
        </div>
      </div>
    </div>
  );
}
