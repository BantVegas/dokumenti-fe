"use client";

import { FilePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/Header";

export default function GeneratorPage() {
  const router = useRouter();

  const documents = [
    { label: "Životopis", path: "zivotopis" },
    { label: "Splnomocnenie", path: "splnomocnenie" },
    { label: "Nájomná zmluva", path: "najomna-zmluva" },
    { label: "Výpoveď z práce", path: "vypoved-z-prace" },
    { label: "Kúpna zmluva", path: "kupna-zmluva" },
    { label: "Pracovná zmluva", path: "pracovna-zmluva" },
  ];

  const handleNavigate = (path: string) => {
    router.push(`/generator/${path}`);
  };

  return (
    <>
      <Header />

      <main
        className="relative min-h-screen bg-cover bg-center flex flex-col justify-between"
        style={{ backgroundImage: "url('/generator.jpg')" }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 z-0" />

        <div className="relative z-10 flex-grow flex items-center justify-center p-6">
          <div className="bg-white/30 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl max-w-xl w-full p-10 text-gray-900 text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <FilePlus className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-extrabold">Vytvoriť dokument</h1>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {documents.map(({ label, path }) => (
                <button
                  key={path}
                  className="bg-black text-white py-2 px-4 rounded-lg shadow hover:bg-gray-800 transition-all"
                  onClick={() => handleNavigate(path)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <footer className="relative z-10 text-center text-white/80 py-4 text-sm">
          &copy; 2025 dokumenti.sk – Všetky práva vyhradené
        </footer>
      </main>
    </>
  );
} 