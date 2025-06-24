"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Navbar komponent
function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-20 bg-white/20 backdrop-blur-md border-b border-white/30 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="text-2xl font-extrabold text-white drop-shadow tracking-tight">
          <Link href="/">dokumenti.sk</Link>
        </div>
        <div className="flex gap-4">
          <Link href="/"><button className="px-4 py-1 rounded-xl text-white hover:bg-white/30 transition">Home</button></Link>
          <Link href="/upload"><button className="px-4 py-1 rounded-xl text-white hover:bg-white/30 transition">Nahrať</button></Link>
          <Link href="/generator"><button className="px-4 py-1 rounded-xl text-white hover:bg-white/30 transition">Vytvoriť</button></Link>
          <Link href="/dashboard"><button className="px-4 py-1 rounded-xl text-white hover:bg-white/30 transition">Dashboard</button></Link>
          <Link href="https://universalkalkulacka.sk/" target="_blank"><button className="px-4 py-1 rounded-xl text-white hover:bg-white/30 transition">Kalkulačka</button></Link>
        </div>
      </div>
    </nav>
  );
}

const defaultPolozka = { pocet: 1, mj: "ks", popis: "", cena: 0 };
const initialDodavatel = {
  meno: "",
  ico: "",
  dic: "",
  icdph: "",
  ulica: "",
  mesto: "",
  psc: "",
  krajina: "Slovensko",
  email: "",
  telefon: "",
};
const initialOdberatel = {
  meno: "",
  ico: "",
  dic: "",
  icdph: "",
  ulica: "",
  mesto: "",
  psc: "",
  krajina: "Slovensko",
};

export default function VytvoritFakturu() {
  // --- HOOKS ---
  const fakturaRef = useRef<HTMLDivElement>(null);

  const [druhFaktury, setDruhFaktury] = useState("Bez DPH (nie som platiteľ DPH)");
  const [cisloFaktury, setCisloFaktury] = useState("");
  const [datumVydania, setDatumVydania] = useState("");
  const [datumDodania, setDatumDodania] = useState("");
  const [splatnost, setSplatnost] = useState("7 dní");
  const [formaUhrady, setFormaUhrady] = useState("Bankový prevod");
  const [cisloUctu, setCisloUctu] = useState("");
  const [iban, setIban] = useState("");
  const [swift, setSwift] = useState("");
  const [poznamka, setPoznamka] = useState("");
  const [pravidelna, setPravidelna] = useState(false);

  const [dodavatel, setDodavatel] = useState(initialDodavatel);
  const [odberatel, setOdberatel] = useState(initialOdberatel);

  const [polozky, setPolozky] = useState([{ ...defaultPolozka }]);
  const suma = polozky.reduce((sum, p) => sum + (p.cena * p.pocet), 0);

  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // --- Autofill podľa IČO ---
  const autofillByIco = async (ico: string, typ: "dodavatel"|"odberatel") => {
    if (!ico || ico.length < 8) return;
    try {
      const res = await axios.get(`/api/ico/${ico}`);
      if (res.data) {
        if (typ === "dodavatel") setDodavatel(d => ({ ...d, ...res.data }));
        else setOdberatel(o => ({ ...o, ...res.data }));
      }
    } catch {}
  };

  // --- Validácia ---
  function validate() {
    const e: { [k: string]: string } = {};
    if (!cisloFaktury) e.cisloFaktury = "Zadajte číslo faktúry";
    if (!datumVydania) e.datumVydania = "Zadajte dátum vystavenia";
    if (!dodavatel.meno) e.dodavatelMeno = "Zadajte meno/názov dodávateľa";
    if (!odberatel.meno) e.odberatelMeno = "Zadajte meno/názov odberateľa";
    if (polozky.some(p => !p.popis || !p.cena)) e.polozky = "Všetky položky musia mať popis a cenu";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // --- Odoslanie na backend (Vystaviť/Odoslať + Stiahnuť PDF) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const response = await axios.post(
        "/api/invoice",
        {
          druhFaktury, cisloFaktury, datumVydania, datumDodania, splatnost, formaUhrady,
          cisloUctu, iban, swift, poznamka, pravidelna,
          dodavatel, odberatel, polozky, suma,
        },
        { responseType: "blob" }
      );
      // automaticky stiahni PDF
      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `faktura-${cisloFaktury || "dokumenti"}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      alert("Faktúra bola úspešne vystavená a stiahnutá!");
    } catch (err) {
      alert("Chyba pri vystavení faktúry.");
    }
    setIsLoading(false);
  };

  // --- Export do PDF na klientovi (vizuálny export) ---
  async function handleExportPDF() {
    if (fakturaRef.current) {
      const canvas = await html2canvas(fakturaRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, (canvas.height * pageWidth) / canvas.width);
      pdf.save(`faktura-${cisloFaktury || "dokumenti"}.pdf`);
    }
  }

  // --- Správa položiek ---
  const handlePolozkaChange = (idx: number, field: string, value: any) => {
    setPolozky((prev) => prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p)));
  };
  const handleAddPolozka = () => setPolozky([...polozky, { ...defaultPolozka }]);
  const handleRemovePolozka = (idx: number) =>
    setPolozky((prev) => prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev);

  // --- Autofill dodávateľa testovacie dáta ---
  const autofillDodavatel = () => setDodavatel({
    meno: "Martin Lukáč",
    ico: "37380982",
    dic: "1043839918",
    icdph: "",
    ulica: "Doležalova 3424/15C",
    mesto: "Bratislava - mestská časť Ružinov",
    psc: "82104",
    krajina: "Slovensko",
    email: "martin.lukac@email.sk",
    telefon: "+421 950 889 523",
  });

  return (
    <div className="relative min-h-screen flex flex-col items-center">
      <Navbar />
      {/* Hero pozadie */}
      <div
        className="absolute inset-0 bg-cover bg-center z-[-2]"
        style={{ backgroundImage: "url('/images/faktura.png')" }}
      />
      <div className="absolute inset-0 bg-black/60 z-[-1]" />

      <div className="w-full flex justify-center items-center min-h-screen pt-24 pb-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/20 backdrop-blur-md border border-white/30 shadow-2xl rounded-2xl px-6 py-10 z-10"
        >
          {/* --- Ľavý stĺpec --- */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Základné údaje faktúry</h2>
            <label className="block text-white mb-1 font-semibold">Druh faktúry</label>
            <select className="w-full p-2 rounded-lg mb-3 bg-white/80" value={druhFaktury} onChange={e => setDruhFaktury(e.target.value)}>
              <option>Bez DPH (nie som platiteľ DPH)</option>
              <option>S DPH</option>
              <option>Zálohová faktúra</option>
            </select>

            <label className="block text-white mb-1 font-semibold">Číslo faktúry / Variabilný symbol</label>
            <input className={`w-full p-2 rounded-lg mb-1 bg-white/80 ${errors.cisloFaktury ? "border-red-500" : ""}`} value={cisloFaktury} onChange={e => setCisloFaktury(e.target.value)} required />
            {errors.cisloFaktury && <p className="text-red-500 text-xs mb-2">{errors.cisloFaktury}</p>}

            <label className="block text-white mb-1 font-semibold">Dátum vystavenia</label>
            <input type="date" className={`w-full p-2 rounded-lg mb-1 bg-white/80 ${errors.datumVydania ? "border-red-500" : ""}`} value={datumVydania} onChange={e => setDatumVydania(e.target.value)} required />
            {errors.datumVydania && <p className="text-red-500 text-xs mb-2">{errors.datumVydania}</p>}

            <label className="block text-white mb-1 font-semibold">Dátum dodania</label>
            <input type="date" className="w-full p-2 rounded-lg mb-3 bg-white/80" value={datumDodania} onChange={e => setDatumDodania(e.target.value)} />

            <label className="block text-white mb-1 font-semibold">Splatnosť</label>
            <select className="w-full p-2 rounded-lg mb-3 bg-white/80" value={splatnost} onChange={e => setSplatnost(e.target.value)}>
              <option>7 dní</option>
              <option>14 dní</option>
              <option>21 dní</option>
              <option>30 dní</option>
            </select>

            <label className="block text-white mb-1 font-semibold">Forma úhrady</label>
            <select className="w-full p-2 rounded-lg mb-3 bg-white/80" value={formaUhrady} onChange={e => setFormaUhrady(e.target.value)}>
              <option>Bankový prevod</option>
              <option>Hotovosť</option>
              <option>Kartou</option>
            </select>

            <label className="block text-white mb-1 font-semibold">Číslo účtu</label>
            <input className="w-full p-2 rounded-lg mb-3 bg-white/80" value={cisloUctu} onChange={e => setCisloUctu(e.target.value)} />

            <label className="block text-white mb-1 font-semibold">IBAN</label>
            <input className="w-full p-2 rounded-lg mb-3 bg-white/80" value={iban} onChange={e => setIban(e.target.value)} />

            <label className="block text-white mb-1 font-semibold">SWIFT</label>
            <input className="w-full p-2 rounded-lg mb-3 bg-white/80" value={swift} onChange={e => setSwift(e.target.value)} />

            <label className="block text-white mb-1 font-semibold">Poznámka</label>
            <textarea className="w-full p-2 rounded-lg mb-3 bg-white/80" value={poznamka} onChange={e => setPoznamka(e.target.value)} rows={2} />

            <div className="flex items-center mt-2 mb-4">
              <input type="checkbox" checked={pravidelna} onChange={e => setPravidelna(e.target.checked)} className="mr-2" />
              <span className="text-white">Pravidelne fakturovať</span>
            </div>
          </div>

          {/* --- Pravý stĺpec --- */}
          <div>
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white mb-3">Informácie o vás (Dodávateľ)</h2>
                <button type="button" className="bg-blue-500 text-white px-3 py-1 rounded-xl text-xs hover:bg-blue-600" onClick={autofillDodavatel}>Vyplniť automaticky</button>
              </div>
              <input className={`w-full p-2 rounded-lg mb-2 bg-white/80 ${errors.dodavatelMeno ? "border-red-500" : ""}`} placeholder="Názov / Meno" value={dodavatel.meno} onChange={e => setDodavatel({ ...dodavatel, meno: e.target.value })} required />
              {errors.dodavatelMeno && <p className="text-red-500 text-xs mb-2">{errors.dodavatelMeno}</p>}
              <input className="w-full p-2 rounded-lg mb-2 bg-white/80" placeholder="IČO"
                value={dodavatel.ico}
                onChange={e => setDodavatel({ ...dodavatel, ico: e.target.value })}
                onBlur={e => autofillByIco(e.target.value, "dodavatel")}
              />
              <input className="w-full p-2 rounded-lg mb-2 bg-white/80" placeholder="DIČ" value={dodavatel.dic} onChange={e => setDodavatel({ ...dodavatel, dic: e.target.value })} />
              <input className="w-full p-2 rounded-lg mb-2 bg-white/80" placeholder="IČ DPH" value={dodavatel.icdph} onChange={e => setDodavatel({ ...dodavatel, icdph: e.target.value })} />
              <input className="w-full p-2 rounded-lg mb-2 bg-white/80" placeholder="Ulica" value={dodavatel.ulica} onChange={e => setDodavatel({ ...dodavatel, ulica: e.target.value })} />
              <input className="w-full p-2 rounded-lg mb-2 bg-white/80" placeholder="Mesto" value={dodavatel.mesto} onChange={e => setDodavatel({ ...dodavatel, mesto: e.target.value })} />
              <input className="w-full p-2 rounded-lg mb-2 bg-white/80" placeholder="PSČ" value={dodavatel.psc} onChange={e => setDodavatel({ ...dodavatel, psc: e.target.value })} />
              <input className="w-full p-2 rounded-lg mb-2 bg-white/80" placeholder="Krajina" value={dodavatel.krajina} onChange={e => setDodavatel({ ...dodavatel, krajina: e.target.value })} />
              <input className="w-full p-2 rounded-lg mb-2 bg-white/80" placeholder="Email" value={dodavatel.email} onChange={e => setDodavatel({ ...dodavatel, email: e.target.value })} />
              <input className="w-full p-2 rounded-lg mb-2 bg-white/80" placeholder="Telefón" value={dodavatel.telefon} onChange={e => setDodavatel({ ...dodavatel, telefon: e.target.value })} />
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-3">Odberateľ (Zákazník)</h2>
              <input className={`w-full p-2 rounded-lg mb-2 bg-white/80 ${errors.odberatelMeno ? "border-red-500" : ""}`} placeholder="Názov / Meno" value={odberatel.meno} onChange={e => setOdberatel({ ...odberatel, meno: e.target.value })} required />
              {errors.odberatelMeno && <p className="text-red-500 text-xs mb-2">{errors.odberatelMeno}</p>}
              <input className="w-full p-2 rounded-lg mb-2 bg-white/80" placeholder="IČO"
                value={odberatel.ico}
                onChange={e => setOdberatel({ ...odberatel, ico: e.target.value })}
                onBlur={e => autofillByIco(e.target.value, "odberatel")}
              />
              <input className="w-full p-2 rounded-lg mb-2 bg-white/80" placeholder="DIČ" value={odberatel.dic} onChange={e => setOdberatel({ ...odberatel, dic: e.target.value })} />
              <input className="w-full p-2 rounded-lg mb-2 bg-white/80" placeholder="IČ DPH" value={odberatel.icdph} onChange={e => setOdberatel({ ...odberatel, icdph: e.target.value })} />
              <input className="w-full p-2 rounded-lg mb-2 bg-white/80" placeholder="Ulica" value={odberatel.ulica} onChange={e => setOdberatel({ ...odberatel, ulica: e.target.value })} />
              <input className="w-full p-2 rounded-lg mb-2 bg-white/80" placeholder="Mesto" value={odberatel.mesto} onChange={e => setOdberatel({ ...odberatel, mesto: e.target.value })} />
              <input className="w-full p-2 rounded-lg mb-2 bg-white/80" placeholder="PSČ" value={odberatel.psc} onChange={e => setOdberatel({ ...odberatel, psc: e.target.value })} />
              <input className="w-full p-2 rounded-lg mb-2 bg-white/80" placeholder="Krajina" value={odberatel.krajina} onChange={e => setOdberatel({ ...odberatel, krajina: e.target.value })} />
            </div>
          </div>

          {/* --- Položky --- */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold text-white mb-2">Položky faktúry</h2>
            <div ref={fakturaRef}>
              <div className="overflow-x-auto rounded-xl bg-white/30 p-4 mb-4">
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th className="font-semibold">Počet</th>
                      <th className="font-semibold">M.J.</th>
                      <th className="font-semibold">Popis</th>
                      <th className="font-semibold">Cena</th>
                      <th className="font-semibold">Celkom</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {polozky.map((p, i) => (
                      <tr key={i}>
                        <td>
                          <input type="number" min="1" className="w-14 p-1 rounded bg-white/90" value={p.pocet} onChange={e => handlePolozkaChange(i, "pocet", Number(e.target.value) || 1)} />
                        </td>
                        <td>
                          <select className="p-1 rounded bg-white/90" value={p.mj} onChange={e => handlePolozkaChange(i, "mj", e.target.value)}>
                            <option>ks</option>
                            <option>hod</option>
                            <option>bal</option>
                          </select>
                        </td>
                        <td>
                          <input type="text" className={`p-1 rounded bg-white/90 w-40 ${errors.polozky ? "border-red-500" : ""}`} value={p.popis} onChange={e => handlePolozkaChange(i, "popis", e.target.value)} required />
                        </td>
                        <td>
                          <input type="number" min="0" step="0.01" className={`w-20 p-1 rounded bg-white/90 ${errors.polozky ? "border-red-500" : ""}`} value={p.cena} onChange={e => handlePolozkaChange(i, "cena", Number(e.target.value) || 0)} required />
                        </td>
                        <td>
                          {(p.cena * p.pocet).toFixed(2)} €
                        </td>
                        <td>
                          <button type="button" onClick={() => handleRemovePolozka(i)} className="text-red-600 font-bold px-2 py-1">✕</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {errors.polozky && <p className="text-red-500 text-xs">{errors.polozky}</p>}
                <button type="button" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-bold shadow transition mb-2 mt-2" onClick={handleAddPolozka}>
                  + Pridať položku
                </button>
                <div className="text-right font-bold text-lg text-white mt-2">
                  Celkom: {suma.toFixed(2)} €
                </div>
              </div>
            </div>
          </div>

          {/* --- Akcie --- */}
          <div className="md:col-span-2 flex flex-col md:flex-row gap-4 mt-8 justify-end">
            <button
              type="button"
              className="bg-gray-200 hover:bg-gray-300 rounded-xl px-6 py-2 font-bold"
              onClick={() => setShowPreview(true)}
            >
              Náhľad faktúry
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-2 font-bold shadow"
            >
              {isLoading ? "Vystavuje sa..." : "Vystaviť a odoslať"}
            </button>
            <button
              type="button"
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-8 py-2 font-bold shadow"
              onClick={handleExportPDF}
            >
              Stiahnuť PDF
            </button>
          </div>
        </form>
      </div>

      {/* --- MODAL Náhľad faktúry --- */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-2xl w-full relative">
            <button className="absolute top-2 right-2 text-2xl" onClick={() => setShowPreview(false)}>✕</button>
            <h1 className="font-bold text-xl mb-2">FAKTÚRA č. {cisloFaktury}</h1>
            <div className="mb-2 text-sm">Dodávateľ: {dodavatel.meno} | {dodavatel.ico} | {dodavatel.ulica}, {dodavatel.mesto}</div>
            <div className="mb-2 text-sm">Odberateľ: {odberatel.meno} | {odberatel.ico} | {odberatel.ulica}, {odberatel.mesto}</div>
            <div className="mb-2">Dátum vystavenia: {datumVydania} | Dátum dodania: {datumDodania} | Splatnosť: {splatnost}</div>
            <table className="w-full text-sm mt-4">
              <thead>
                <tr className="border-b">
                  <th>Počet</th>
                  <th>M.J.</th>
                  <th>Popis</th>
                  <th>Cena</th>
                  <th>Celkom</th>
                </tr>
              </thead>
              <tbody>
                {polozky.map((p, i) => (
                  <tr key={i} className="border-b">
                    <td>{p.pocet}</td>
                    <td>{p.mj}</td>
                    <td>{p.popis}</td>
                    <td>{p.cena} €</td>
                    <td>{(p.cena * p.pocet).toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-right font-bold text-lg mt-4">Celkom: {suma.toFixed(2)} €</div>
          </div>
        </div>
      )}
    </div>
  );
}
