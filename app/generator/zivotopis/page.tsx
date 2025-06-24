"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";

export default function ZivotopisPage() {
  const [formData, setFormData] = useState({
    meno: "",
    priezvisko: "",
    datumNarodenia: "",
    adresa: "",
    telefon: "",
    email: "",
    vzdelanie: "",
    skusenosti: "",
    dovednosti: "",
    jazyk: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/generate/zivotopis", formData, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "zivotopis.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Chyba pri generovaní životopisu:", error);
    }
  };

  const handlePrintTemplate = () => {
    window.open("/templates/zivotopis-template.pdf", "_blank");
  };

  return (
    <main
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/images/zivotopis-hero.png')" }}
    >
      <motion.div
        className="bg-white/30 backdrop-blur-md border border-white/30 rounded-3xl shadow-2xl max-w-2xl w-full mx-4 p-8 text-gray-900"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Vytvorte si moderný životopis</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="meno" placeholder="Meno" value={formData.meno} onChange={handleChange} className="px-4 py-2 border rounded-lg" required />
            <input name="priezvisko" placeholder="Priezvisko" value={formData.priezvisko} onChange={handleChange} className="px-4 py-2 border rounded-lg" required />
            <input name="datumNarodenia" placeholder="Dátum narodenia" value={formData.datumNarodenia} onChange={handleChange} className="px-4 py-2 border rounded-lg" required />
            <input name="adresa" placeholder="Adresa" value={formData.adresa} onChange={handleChange} className="px-4 py-2 border rounded-lg" required />
            <input name="telefon" placeholder="Telefón" value={formData.telefon} onChange={handleChange} className="px-4 py-2 border rounded-lg" required />
            <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="px-4 py-2 border rounded-lg" required />
          </div>
          <textarea name="vzdelanie" placeholder="Vzdelanie" value={formData.vzdelanie} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
          <textarea name="skusenosti" placeholder="Pracovné skúsenosti" value={formData.skusenosti} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
          <textarea name="dovednosti" placeholder="Zručnosti a schopnosti" value={formData.dovednosti} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
          <input name="jazyk" placeholder="Jazyk dokumentu (napr. sk, en)" value={formData.jazyk} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />

          <div className="flex gap-4">
            <Button type="submit" className="flex-1 bg-blue-600 text-white rounded-lg py-2">Vygenerovať PDF</Button>
            <Button type="button" variant="outline" onClick={handlePrintTemplate} className="flex-1">Vytlačiť šablónu</Button>
          </div>
        </form>
      </motion.div>
    </main>
  );
}
