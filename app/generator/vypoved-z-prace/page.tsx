"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";

export default function VypovedPage() {
  const [formData, setFormData] = useState({
    meno: "",
    priezvisko: "",
    adresa: "",
    rodneCislo: "",
    zamestnavatel: "",
    datumNastupu: "",
    datumVypovede: "",
    dovod: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://api.dokumenti.sk/api/generate/vypoved", formData, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "vypoved.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Chyba pri generovaní:", error);
    }
  };

  const handlePrintTemplate = () => {
    window.open("/templates/vypoved-template.pdf", "_blank");
  };

  return (
    <main
      className="min-h-screen flex flex-col justify-between bg-cover bg-center"
      style={{ backgroundImage: "url('/images/vypoved-hero.png')" }}
    >
      <div className="flex-grow flex items-center justify-center p-6">
        <motion.div
          className="bg-white/30 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl max-w-2xl w-full p-10 text-gray-900"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xl font-bold mb-6">Výpoveď z práce</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="meno" placeholder="Meno" value={formData.meno} onChange={handleChange} className="px-4 py-2 border rounded-lg" required />
              <input name="priezvisko" placeholder="Priezvisko" value={formData.priezvisko} onChange={handleChange} className="px-4 py-2 border rounded-lg" required />
              <input name="adresa" placeholder="Adresa" value={formData.adresa} onChange={handleChange} className="px-4 py-2 border rounded-lg" required />
              <input name="rodneCislo" placeholder="Rodné číslo" value={formData.rodneCislo} onChange={handleChange} className="px-4 py-2 border rounded-lg" required />
              <input name="zamestnavatel" placeholder="Zamestnávateľ" value={formData.zamestnavatel} onChange={handleChange} className="px-4 py-2 border rounded-lg" required />
              <input name="datumNastupu" placeholder="Dátum nástupu" value={formData.datumNastupu} onChange={handleChange} className="px-4 py-2 border rounded-lg" required />
              <input name="datumVypovede" placeholder="Dátum výpovede" value={formData.datumVypovede} onChange={handleChange} className="px-4 py-2 border rounded-lg" required />
            </div>
            <input name="dovod" placeholder="Dôvod výpovede" value={formData.dovod} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
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
