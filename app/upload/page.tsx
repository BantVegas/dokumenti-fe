"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Header from "@/components/ui/Header";
import AnalysisResultModal from "@/components/AnalysisResultModal";

// Typovanie výsledku analýzy
interface AnalysisResult {
  typ: string;
  zhodnotenie: string;
  rizika: string;
  odporucania: string;
  zaver: string;
  jazyk: string;
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Drag & Drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  // Upload handler (bez any, bez warningov)
  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://api.dokumenti.sk/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      setResult({
        typ: data.document_type,
        zhodnotenie: data.legal_evaluation,
        rizika: data.risks,
        odporucania: data.recommendations,
        zaver: data.conclusion,
        jazyk: data.language,
      });
      setShowModal(true);
    } catch {
      setResult({
        typ: "Chyba",
        zhodnotenie: "Nepodarilo sa nahrať dokument alebo spracovať odpoveď.",
        rizika: "",
        odporucania: "",
        zaver: "",
        jazyk: "sk",
      });
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  // File change handler - správne typovanie
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  return (
    <>
      <Header />

      <main
        className="relative min-h-screen bg-cover bg-center flex flex-col justify-between"
        style={{ backgroundImage: "url('/upload.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/40 z-0" />

        <div className="relative z-10 flex-grow flex flex-col items-center justify-center p-6">
          <motion.div
            className="glass-card max-w-xl w-full p-10 text-gray-900 transition-all duration-200 hover:translate-y-[-4px] hover:scale-[1.03]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <UploadCloud className="w-6 h-6 text-green-600" />
              <h1 className="text-2xl font-extrabold">Nahrať dokument</h1>
            </div>

            <div className="glass-card p-4 mb-6 text-sm text-gray-800 transition-all duration-200 hover:translate-y-[-4px] hover:scale-[1.03]">
              <div className="flex items-center gap-2 font-semibold mb-2">
                <Info className="w-4 h-4 text-blue-500" /> Ako to funguje?
              </div>
              <ul className="list-disc list-inside space-y-1">
                <li>Nahraj právny dokument vo formáte PDF alebo DOCX.</li>
                <li>
                  AI vykoná právnu analýzu a zistí riziká, nedostatky, zhrnutie a
                  navrhne riešenie.
                </li>
                <li>Výsledok si môžeš uložiť alebo vytlačiť ako PDF.</li>
                <li>
                  <strong>Odporúčame nahrávať jeden list (stránku) samostatne.</strong>
                </li>
              </ul>
            </div>

            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-600 mb-4 hover:bg-white/40 transition cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              {file ? (
                <p className="text-green-800 font-semibold">{file.name}</p>
              ) : (
                <>
                  Pretiahni sem súbor PDF alebo DOCX
                  <br />
                  alebo klikni na tlačidlo nižšie
                </>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={handleFileChange}
            />

            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-base rounded-xl shadow-md transition-all duration-300"
              onClick={handleUpload}
              disabled={!file || loading}
            >
              {loading ? "Nahrávam..." : "Spustiť analýzu"}
            </Button>
          </motion.div>
        </div>

        {showModal && result && (
          <AnalysisResultModal data={result} onClose={() => setShowModal(false)} />
        )}

        <footer className="relative z-10 text-center text-white/80 py-4 text-sm">
          &copy; 2025 dokumenti.sk – Všetky práva vyhradené
        </footer>
      </main>
    </>
  );
}

