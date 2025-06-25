"use client";
console.log("✅ Kupna zmluva page.tsx loaded");

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

export default function KupnaZmluvaPage() {
  const [formData, setFormData] = useState({
    predavajuciMeno: "",
    predavajuciAdresa: "",
    kupujuciMeno: "",
    kupujuciAdresa: "",
    predmetZmluvy: "",         // zmenené!
    cena: "",
    datum: "",
    miestoOdovzdania: ""       // pridané!
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://api.dokumenti.sk/api/generate/kupna-zmluva", formData, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "kupna-zmluva.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Chyba pri generovaní:", error);
    }
  };

  const handlePrintTemplate = () => {
    window.open("/templates/kupna-zmluva-template.pdf", "_blank");
  };

  return (
    <main
      className="min-h-screen flex flex-col justify-between bg-cover bg-center"
      style={{ backgroundImage: "url('/images/kupna-zmluva-hero.png')" }}
    >
      <div className="flex-grow flex items-center justify-center p-6">
        <motion.div
          className="bg-white/30 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl max-w-2xl w-full p-10 text-gray-900"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xl font-bold mb-6">Kúpna zmluva</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="predavajuciMeno" placeholder="Meno predávajúceho" value={formData.predavajuciMeno} onChange={handleChange} className="px-4 py-2 border rounded-lg" required />
              <input name="predavajuciAdresa" placeholder="Adresa predávajúceho" value={formData.predavajuciAdresa} onChange={handleChange} className="px-4 py-2 border rounded-lg" required />
              <input name="kupujuciMeno" placeholder="Meno kupujúceho" value={formData.kupujuciMeno} onChange={handleChange} className="px-4 py-2 border rounded-lg" required />
              <input name="kupujuciAdresa" placeholder="Adresa kupujúceho" value={formData.kupujuciAdresa} onChange={handleChange} className="px-4 py-2 border rounded-lg" required />
              <input name="predmetZmluvy" placeholder="Predmet kúpy (napr. auto)" value={formData.predmetZmluvy} onChange={handleChange} className="px-4 py-2 border rounded-lg" required />
              <input name="cena" placeholder="Cena v €" value={formData.cena} onChange={handleChange} className="px-4 py-2 border rounded-lg" required />
              <input name="datum" placeholder="Dátum podpisu" value={formData.datum} onChange={handleChange} className="px-4 py-2 border rounded-lg" required />
              <input name="miestoOdovzdania" placeholder="Miesto odovzdania" value={formData.miestoOdovzdania} onChange={handleChange} className="px-4 py-2 border rounded-lg" required />
            </div>
            <div className="flex gap-4">
              <Button type="submit" className="flex-1 bg-blue-600 text-white rounded-lg py-2">Vygenerovať PDF</Button>
              <Button type="button" variant="outline" onClick={handlePrintTemplate} className="flex-1">Vytlačiť šablónu</Button>
            </div>
          </form>
        </motion.div>
      </div>
      <footer className="text-center text-white/80 py-4 text-sm">
        &copy; 2025 dokumenti.sk – Všetky práva vyhradené
      </footer>
    </main>
  );
}
