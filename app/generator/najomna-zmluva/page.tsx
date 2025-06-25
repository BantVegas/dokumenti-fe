"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

export default function NajomnaZmluvaPage() {
  const [formData, setFormData] = useState({
    prenajimatelMeno: "",
    prenajimatelAdresa: "",
    najomcaMeno: "",
    najomcaAdresa: "",
    predmetNajmu: "",
    adresaPredmetu: "",
    datumOd: "",
    datumDo: "",
    vyskaNajomneho: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://api.dokumenti.sk/api/generate/najomna-zmluva",
        formData,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "najomna-zmluva.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Chyba pri generovaní:", error);
    }
  };

  const handlePrintTemplate = () => {
    window.open("/templates/najomna-zmluva-template.pdf", "_blank");
  };

  return (
    <main
      className="min-h-screen flex flex-col justify-between bg-cover bg-center"
      style={{ backgroundImage: "url('/images/najomna-zmluva-hero.png')" }}
    >
      <div className="flex-grow flex items-center justify-center p-6">
        <motion.div
          className="bg-white/30 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl max-w-2xl w-full p-10 text-gray-900"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xl font-bold mb-6">Nájomná zmluva</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="prenajimatelMeno" placeholder="Meno prenajímateľa" value={formData.prenajimatelMeno} onChange={handleChange} className="px-4 py-2 border rounded-lg" required />
              <input name="prenajimatelAdresa" placeholder="Adresa prenajímateľa" value={formData.prenajimatelAdresa} onChange={handleChange} className="px-4 py-2 border rounded-lg" required />
              <input name="najomcaMeno" placeholder="Meno nájomcu" value={formData.najomcaMeno} onChange={handleChange} className="px-4 py-2 border rounded-lg" required />
              <input name="najomcaAdresa" placeholder="Adresa nájomcu" value={formData.najomcaAdresa} onChange={handleChange} className="px-4 py-2 border rounded-lg" required />
              <input name="predmetNajmu" placeholder="Predmet nájmu" value={formData.predmetNajmu} onChange={handleChange} className="px-4 py-2 border rounded-lg" required />
              <input name="adresaPredmetu" placeholder="Adresa predmetu nájmu" value={formData.adresaPredmetu} onChange={handleChange} className="px-4 py-2 border rounded-lg" required />
              <input name="datumOd" placeholder="Začiatok nájmu (dd.mm.rrrr)" value={formData.datumOd} onChange={handleChange} className="px-4 py-2 border rounded-lg" required />
              <input name="datumDo" placeholder="Koniec nájmu (dd.mm.rrrr)" value={formData.datumDo} onChange={handleChange} className="px-4 py-2 border rounded-lg" />
              <input name="vyskaNajomneho" placeholder="Mesačný nájom (€)" value={formData.vyskaNajomneho} onChange={handleChange} className="px-4 py-2 border rounded-lg" />
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
