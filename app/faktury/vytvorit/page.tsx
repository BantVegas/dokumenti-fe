"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Typy
interface Polozka {
  pocet: number;
  mj: string;
  popis: string;
  cena: number;
}
interface Dodavatel {
  meno: string;
  ico: string;
  dic: string;
  icdph: string;
  ulica: string;
  mesto: string;
  psc: string;
  krajina: string;
  email: string;
  telefon: string;
  iban: string;
  cisloUctu: string;
  swift: string;
}
interface Odberatel {
  meno: string;
  ico: string;
  dic: string;
  icdph: string;
  ulica: string;
  mesto: string;
  psc: string;
  krajina: string;
}

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
          <Link href="https://univerzalkalkulacka.sk/" target="_blank"><button className="px-4 py-1 rounded-xl text-white hover:bg-white/30 transition">Kalkulačka</button></Link>
        </div>
      </div>
    </nav>
  );
}

const defaultPolozka: Polozka = { pocet: 1, mj: "ks", popis: "", cena: 0 };
const MJ_OPTIONS = ["ks", "hod", "kg", "l", "bal", "vlastné"];

const initialDodavatel: Dodavatel = {
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
  iban: "",
  cisloUctu: "",
  swift: "",
};
const initialOdberatel: Odberatel = {
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
  const fakturaRef = useRef<HTMLDivElement>(null);

  // State
  const [druhFaktury, setDruhFaktury] = useState("Bez DPH (nie som platiteľ DPH)");
  const [cisloFaktury, setCisloFaktury] = useState("");
  const [datumVydania, setDatumVydania] = useState("");
  const [datumDodania, setDatumDodania] = useState("");
  const [splatnost, setSplatnost] = useState("7 dní");
  const [formaUhrady, setFormaUhrady] = useState("Bankový prevod");
  const [poznamka, setPoznamka] = useState("");
  const [pravidelna, setPravidelna] = useState(false);

  const [dodavatel, setDodavatel] = useState<Dodavatel>(initialDodavatel);
  const [odberatel, setOdberatel] = useState<Odberatel>(initialOdberatel);

  const [polozky, setPolozky] = useState<Polozka[]>([{ ...defaultPolozka }]);
  const suma = polozky.reduce((sum, p) => sum + (p.cena * p.pocet), 0);

  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Autofill podľa IČO
  const autofillByIco = async (ico: string, typ: "dodavatel"|"odberatel") => {
    if (!ico || ico.length !== 8 || !/^\d+$/.test(ico)) return;
    try {
      const res = await axios.get(`/api/ico/${ico}`);
      if (res.data) {
        if (typ === "dodavatel") setDodavatel(d => ({ ...d, ...res.data }));
        else setOdberatel(o => ({ ...o, ...res.data }));
      }
    } catch {/* ignorujeme */}
  };

  // VALIDÁCIA
  function validate() {
    const e: { [k: string]: string } = {};
    if (!cisloFaktury) e.cisloFaktury = "Zadajte číslo faktúry";
    if (!datumVydania) e.datumVydania = "Zadajte dátum vystavenia";
    if (!dodavatel.meno) e.dodavatelMeno = "Zadajte meno/názov dodávateľa";
    if (!dodavatel.iban) e.dodavatelIban = "Zadajte IBAN";
    if (!odberatel.meno) e.odberatelMeno = "Zadajte meno/názov odberateľa";
    if (polozky.some(p => !p.popis || !p.cena)) e.polozky = "Všetky položky musia mať popis a cenu";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const fakturaData = {
        druhFaktury,
        cisloFaktury,
        datumVydania,
        datumDodania,
        splatnost,
        formaUhrady,
        poznamka,
        pravidelna,
        suma,
        polozky,
        // Dodávateľ flat
        dodavatelMeno: dodavatel.meno,
        dodavatelIco: dodavatel.ico,
        dodavatelDic: dodavatel.dic,
        dodavatelIcdph: dodavatel.icdph,
        dodavatelUlica: dodavatel.ulica,
        dodavatelMesto: dodavatel.mesto,
        dodavatelPsc: dodavatel.psc,
        dodavatelKrajina: dodavatel.krajina,
        dodavatelEmail: dodavatel.email,
        dodavatelTelefon: dodavatel.telefon,
        dodavatelIban: dodavatel.iban,
        dodavatelCisloUctu: dodavatel.cisloUctu,
        dodavatelSwift: dodavatel.swift,
        // Odberateľ flat
        odberatelMeno: odberatel.meno,
        odberatelIco: odberatel.ico,
        odberatelDic: odberatel.dic,
        odberatelIcdph: odberatel.icdph,
        odberatelUlica: odberatel.ulica,
        odberatelMesto: odberatel.mesto,
        odberatelPsc: odberatel.psc,
        odberatelKrajina: odberatel.krajina,
      };

      const response = await axios.post(
        "/api/invoice",
        fakturaData,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `faktura-${cisloFaktury || "dokumenti"}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      alert("Faktúra bola úspešne vystavená a stiahnutá!");
    } catch {
      alert("Chyba pri vystavení faktúry.");
    }
    setIsLoading(false);
  };

  // Export do PDF na klientovi
  const handleExportPDF = async () => {
    if (fakturaRef.current) {
      const canvas = await html2canvas(fakturaRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, (canvas.height * pageWidth) / canvas.width);
      pdf.save(`faktura-${cisloFaktury || "dokumenti"}.pdf`);
    }
  };

  // Položky
  const handlePolozkaChange = (
    idx: number,
    field: keyof Polozka,
    value: string | number
  ) => {
    setPolozky((prev) => prev.map((p, i) =>
      i === idx ? { ...p, [field]: value } : p
    ));
  };
  const handleAddPolozka = () => setPolozky([...polozky, { ...defaultPolozka }]);
  const handleRemovePolozka = (idx: number) =>
    setPolozky((prev) => prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev);

  // Autofill dodavatel
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
    iban: "SK68 1100 0000 0026 2950 8006",
    cisloUctu: "2629508006/1100",
    swift: "TATRSKBX",
  });

  // Handler pre autofill odberatela podľa IČO
  const handleAutofillOdberatel = () => {
    if (odberatel.ico && odberatel.ico.length === 8 && /^\d+$/.test(odberatel.ico)) {
      autofillByIco(odberatel.ico, "odberatel");
    } else {
      alert("Najprv zadajte platné 8-miestne IČO odberateľa (iba čísla).");
    }
  };

  // Autofill aj po opustení inputu
  const handleOdberatelIcoBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const ico = e.target.value;
    if (ico && ico.length === 8 && /^\d+$/.test(ico)) {
      autofillByIco(ico, "odberatel");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center">
      <Navbar />
      <div className="absolute inset-0 bg-cover bg-center z-[-2]" style={{ backgroundImage: "url('/images/faktura.png')" }} />
      <div className="absolute inset-0 bg-black/60 z-[-1]" />

      <div className="w-full flex justify-center items-center min-h-screen pt-24 pb-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/20 backdrop-blur-md border border-white/30 shadow-2xl rounded-2xl px-6 py-10 z-10"
        >
          {/* ĽAVÝ STĹPEC */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Základné údaje faktúry</h2>
            <label className="block text-white mb-1 font-semibold">Druh faktúry</label>
            <select className="w-full p-2 rounded-lg mb-3 bg-white/80" value={druhFaktury} onChange={e => setDruhFaktury(e.target.value)}>
              <option>Bez DPH (nie som platiteľ DPH)</option>
              <option>S DPH</option>
              <option>Zálohová faktúra</option>
            </select>
            <label className="block text-white mb-1 font-semibold">Číslo faktúry</label>
            <input className="w-full p-2 rounded-lg mb-3 bg-white/80" value={cisloFaktury} onChange={e => setCisloFaktury(e.target.value)} />
            {errors.cisloFaktury && <div className="text-red-500 text-sm mb-2">{errors.cisloFaktury}</div>}

            <label className="block text-white mb-1 font-semibold">Dátum vystavenia</label>
            <input type="date" className="w-full p-2 rounded-lg mb-3 bg-white/80" value={datumVydania} onChange={e => setDatumVydania(e.target.value)} />
            {errors.datumVydania && <div className="text-red-500 text-sm mb-2">{errors.datumVydania}</div>}

            <label className="block text-white mb-1 font-semibold">Dátum dodania</label>
            <input type="date" className="w-full p-2 rounded-lg mb-3 bg-white/80" value={datumDodania} onChange={e => setDatumDodania(e.target.value)} />

            <label className="block text-white mb-1 font-semibold">Splatnosť</label>
            <input className="w-full p-2 rounded-lg mb-3 bg-white/80" value={splatnost} onChange={e => setSplatnost(e.target.value)} />

            <label className="block text-white mb-1 font-semibold">Forma úhrady</label>
            <input className="w-full p-2 rounded-lg mb-3 bg-white/80" value={formaUhrady} onChange={e => setFormaUhrady(e.target.value)} />

            <label className="block text-white mb-1 font-semibold">Poznámka</label>
            <input className="w-full p-2 rounded-lg mb-3 bg-white/80" value={poznamka} onChange={e => setPoznamka(e.target.value)} />

            <div className="flex items-center gap-2 mb-4">
              <input type="checkbox" checked={pravidelna} onChange={e => setPravidelna(e.target.checked)} />
              <span className="text-white">Pravidelná faktúra</span>
            </div>
          </div>

          {/* PRAVÝ STĹPEC */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xl font-bold text-white">Dodávateľ</h2>
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-bold shadow"
                onClick={autofillDodavatel}
              >
                Auto vyplniť dodávateľa
              </button>
            </div>
            <input className="w-full p-2 rounded-lg mb-2 bg-white/80" placeholder="Meno / Názov" value={dodavatel.meno} onChange={e => setDodavatel(d => ({ ...d, meno: e.target.value }))} />
            <input className="w-full p-2 rounded-lg mb-2 bg-white/80" placeholder="IČO" value={dodavatel.ico} onBlur={e => autofillByIco(e.target.value, "dodavatel")} onChange={e => setDodavatel(d => ({ ...d, ico: e.target.value }))} />
            <input className="w-full p-2 rounded-lg mb-2 bg-white/80" placeholder="DIČ" value={dodavatel.dic} onChange={e => setDodavatel(d => ({ ...d, dic: e.target.value }))} />
            <input className="w-full p-2 rounded-lg mb-2 bg-white/80" placeholder="IČ DPH" value={dodavatel.icdph} onChange={e => setDodavatel(d => ({ ...d, icdph: e.target.value }))} />
            <input className="w-full p-2 rounded-lg mb-2 bg-white/80" placeholder="Ulica" value={dodavatel.ulica} onChange={e => setDodavatel(d => ({ ...d, ulica: e.target.value }))} />
            <input className="w-full p-2 rounded-lg mb-2 bg-white/80" placeholder="Mesto" value={dodavatel.mesto} onChange={e => setDodavatel(d => ({ ...d, mesto: e.target.value }))} />
            <input className="w-full p-2 rounded-lg mb-2 bg-white/80" placeholder="PSČ" value={dodavatel.psc} onChange={e => setDodavatel(d => ({ ...d, psc: e.target.value }))} />
            <input className="w-full p-2 rounded-lg mb-2 bg-white/80" placeholder="Krajina" value={dodavatel.krajina} onChange={e => setDodavatel(d => ({ ...d, krajina: e.target.value }))} />
            <input className="w-full p-2 rounded-lg mb-2 bg-white/80" placeholder="E-mail" value={dodavatel.email} onChange={e => setDodavatel(d => ({ ...d, email: e.target.value }))} />
            <input className="w-full p-2 rounded-lg mb-2 bg-white/80" placeholder="Telefón" value={dodavatel.telefon} onChange={e => setDodavatel(d => ({ ...d, telefon: e.target.value }))} />

            {/* Nové polia */}
            <input className="w-full p-2 rounded-lg mb-2 bg-white/80" placeholder="IBAN" value={dodavatel.iban} onChange={e => setDodavatel(d => ({ ...d, iban: e.target.value }))} />
            <input className="w-full p-2 rounded-lg mb-2 bg-white/80" placeholder="Číslo účtu" value={dodavatel.cisloUctu} onChange={e => setDodavatel(d => ({ ...d, cisloUctu: e.target.value }))} />
            <input className="w-full p-2 rounded-lg mb-4 bg-white/80" placeholder="SWIFT/BIC" value={dodavatel.swift} onChange={e => setDodavatel(d => ({ ...d, swift: e.target.value }))} />

            {errors.dodavatelMeno && <div className="text-red-500 text-sm mb-2">{errors.dodavatelMeno}</div>}
            {errors.dodavatelIban && <div className="text-red-500 text-sm mb-2">{errors.dodavatelIban}</div>}

            <div className="flex items-center justify-between mb-1 mt-6">
              <h2 className="text-xl font-bold text-white">Odberateľ</h2>
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-bold shadow"
                onClick={handleAutofillOdberatel}
              >
                Auto vyplniť podľa IČO
              </button>
            </div>
            <input className="w-full p-2 rounded-lg mb-2 bg-white/80" placeholder="Meno / Názov" value={odberatel.meno} onChange={e => setOdberatel(o => ({ ...o, meno: e.target.value }))} />
            <input className="w-full p-2 rounded-lg mb-2 bg-white/80" placeholder="IČO" value={odberatel.ico} onChange={e => setOdberatel(o => ({ ...o, ico: e.target.value }))} onBlur={handleOdberatelIcoBlur} />
            <input className="w-full p-2 rounded-lg mb-2 bg-white/80" placeholder="DIČ" value={odberatel.dic} onChange={e => setOdberatel(o => ({ ...o, dic: e.target.value }))} />
            <input className="w-full p-2 rounded-lg mb-2 bg-white/80" placeholder="IČ DPH" value={odberatel.icdph} onChange={e => setOdberatel(o => ({ ...o, icdph: e.target.value }))} />
            <input className="w-full p-2 rounded-lg mb-2 bg-white/80" placeholder="Ulica" value={odberatel.ulica} onChange={e => setOdberatel(o => ({ ...o, ulica: e.target.value }))} />
            <input className="w-full p-2 rounded-lg mb-2 bg-white/80" placeholder="Mesto" value={odberatel.mesto} onChange={e => setOdberatel(o => ({ ...o, mesto: e.target.value }))} />
            <input className="w-full p-2 rounded-lg mb-2 bg-white/80" placeholder="PSČ" value={odberatel.psc} onChange={e => setOdberatel(o => ({ ...o, psc: e.target.value }))} />
            <input className="w-full p-2 rounded-lg mb-2 bg-white/80" placeholder="Krajina" value={odberatel.krajina} onChange={e => setOdberatel(o => ({ ...o, krajina: e.target.value }))} />
            {errors.odberatelMeno && <div className="text-red-500 text-sm mb-2">{errors.odberatelMeno}</div>}
          </div>

          {/* POLOŽKY */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold text-white mb-2">Položky faktúry</h2>
            {errors.polozky && <div className="text-red-500 text-sm mb-2">{errors.polozky}</div>}
            <div className="overflow-x-auto">
              <table className="w-full mb-2 bg-white/80 rounded-xl">
                <thead>
                  <tr>
                    <th className="p-2">Počet</th>
                    <th className="p-2">MJ</th>
                    <th className="p-2">Popis</th>
                    <th className="p-2">Cena/ks</th>
                    <th className="p-2">Celkovo</th>
                    <th className="p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {polozky.map((p, i) => (
                    <tr key={i}>
                      <td>
                        <input
                          type="number"
                          min={1}
                          className="w-16 p-1 rounded"
                          value={p.pocet}
                          onChange={e => handlePolozkaChange(i, "pocet", Number(e.target.value))}
                        />
                      </td>
                      <td>
                        <select
                          className="w-20 p-1 rounded"
                          value={MJ_OPTIONS.includes(p.mj) ? p.mj : "vlastné"}
                          onChange={e => {
                            const val = e.target.value;
                            if (val === "vlastné") return;
                            handlePolozkaChange(i, "mj", val);
                          }}
                        >
                          {MJ_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
                        </select>
                        {p.mj === "vlastné" || !MJ_OPTIONS.includes(p.mj) ? (
                          <input
                            className="w-16 ml-2 p-1 rounded border"
                            placeholder="MJ"
                            value={p.mj}
                            onChange={e => handlePolozkaChange(i, "mj", e.target.value)}
                          />
                        ) : null}
                      </td>
                      <td>
                        <input
                          className="w-full p-1 rounded"
                          value={p.popis}
                          onChange={e => handlePolozkaChange(i, "popis", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          min={0}
                          className="w-20 p-1 rounded"
                          value={p.cena}
                          onChange={e => handlePolozkaChange(i, "cena", Number(e.target.value))}
                        />
                      </td>
                      <td>{(p.cena * p.pocet).toFixed(2)} €</td>
                      <td>
                        <button type="button" className="text-red-500 text-lg" onClick={() => handleRemovePolozka(i)} disabled={polozky.length === 1}>✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button type="button" className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-1 mb-3" onClick={handleAddPolozka}>Pridať položku</button>
            </div>
            <div ref={fakturaRef} className="mt-2 mb-2 px-4 py-3 rounded-xl bg-white/70 shadow">
              <div className="text-right font-bold text-xl">Celkom: {suma.toFixed(2)} €</div>
            </div>
          </div>

          {/* AKCIE */}
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

      {/* MODAL Náhľad faktúry */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-2xl w-full relative">
            <button className="absolute top-2 right-2 text-2xl" onClick={() => setShowPreview(false)}>✕</button>
            <h1 className="font-bold text-xl mb-2">FAKTÚRA č. {cisloFaktury}</h1>
            <div className="mb-2 text-sm">Dodávateľ: {dodavatel.meno} | {dodavatel.ico} | {dodavatel.ulica}, {dodavatel.mesto}</div>
            <div className="mb-2 text-sm">IBAN: {dodavatel.iban} | Číslo účtu: {dodavatel.cisloUctu} | SWIFT/BIC: {dodavatel.swift}</div>
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

