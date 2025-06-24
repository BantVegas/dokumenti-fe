"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";

export default function SplnomocneniePage() {
  // Zladené názvy fieldov presne podľa SplnomocnenieRequest DTO v Java
  const [formData, setFormData] = useState({
    meno: "",
    priezvisko: "",
    datumNarodenia: "",
    rodneCislo: "",
    adresa: "",
    splnomocnenecMeno: "",
    splnomocnenecDatumNarodenia: "",
    splnomocnenecAdresa: "",
    ucel: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/generate/splnomocnenie",
        formData,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "splnomocnenie.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      alert("Chyba pri generovaní PDF");
    }
  };

  const handlePrintTemplate = () => {
    window.open("/templates/splnomocnenie-template.pdf", "_blank");
  };

  return (
    <main
      className="min-h-screen flex flex-col justify-between bg-cover bg-center"
      style={{ backgroundImage: "url('/images/splnomocnenie-hero.png')" }}
    >
      <div className="flex-grow flex items-center justify-center p-6">
        <motion.div
          className="bg-white/30 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl max-w-2xl w-full p-10 text-gray-900"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xl font-bold mb-6">Splnomocnenie</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="meno"
                placeholder="Meno splnomocniteľa"
                value={formData.meno}
                onChange={handleChange}
                className="px-4 py-2 border rounded-lg"
                required
              />
              <input
                name="priezvisko"
                placeholder="Priezvisko splnomocniteľa"
                value={formData.priezvisko}
                onChange={handleChange}
                className="px-4 py-2 border rounded-lg"
                required
              />
              <input
                name="datumNarodenia"
                placeholder="Dátum narodenia splnomocniteľa"
                value={formData.datumNarodenia}
                onChange={handleChange}
                className="px-4 py-2 border rounded-lg"
                required
              />
              <input
                name="rodneCislo"
                placeholder="Rodné číslo splnomocniteľa"
                value={formData.rodneCislo}
                onChange={handleChange}
                className="px-4 py-2 border rounded-lg"
                required
              />
              <input
                name="adresa"
                placeholder="Adresa splnomocniteľa"
                value={formData.adresa}
                onChange={handleChange}
                className="px-4 py-2 border rounded-lg"
                required
              />
              <input
                name="splnomocnenecMeno"
                placeholder="Meno splnomocnenca"
                value={formData.splnomocnenecMeno}
                onChange={handleChange}
                className="px-4 py-2 border rounded-lg"
                required
              />
              <input
                name="splnomocnenecDatumNarodenia"
                placeholder="Dátum narodenia splnomocnenca"
                value={formData.splnomocnenecDatumNarodenia}
                onChange={handleChange}
                className="px-4 py-2 border rounded-lg"
                required
              />
              <input
                name="splnomocnenecAdresa"
                placeholder="Adresa splnomocnenca"
                value={formData.splnomocnenecAdresa}
                onChange={handleChange}
                className="px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <textarea
              name="ucel"
              placeholder="Účel splnomocnenia (napr. prepis auta)"
              value={formData.ucel}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg min-h-[60px] resize-y"
              required
            />
            <div className="flex gap-4">
              <Button type="submit" className="flex-1 bg-blue-600 text-white rounded-lg py-2">
                Vygenerovať PDF
              </Button>
              <Button type="button" variant="outline" onClick={handlePrintTemplate} className="flex-1">
                Vytlačiť šablónu
              </Button>
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



