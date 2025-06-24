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

  const [dodavatel, setDodavatel] = useState<Dodavatel>(initialDodavatel);
  const [odberatel, setOdberatel] = useState<Odberatel>(initialOdberatel);

  const [polozky, setPolozky] = useState<Polozka[]>([{ ...defaultPolozka }]);
  const suma = polozky.reduce((sum, p) => sum + (p.cena * p.pocet), 0);

  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Autofill podľa IČO
  const autofillByIco = async (ico: string, typ: "dodavatel"|"odberatel") => {
    if (!ico || ico.length < 8) return;
    try {
      const res = await axios.get(`/api/ico/${ico}`);
      if (res.data) {
        if (typ === "dodavatel") setDodavatel(d => ({ ...d, ...res.data }));
        else setOdberatel(o => ({ ...o, ...res.data }));
      }
    } catch {
      // error ignorovaný
    }
  };

  // Validácia
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

  // Odoslanie na backend (Vystaviť/Odoslať + Stiahnuť PDF)
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
      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `faktura-${cisloFaktury || "dokumenti"}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      alert("Faktúra bola úspešne vystavená a stiahnutá!");
    } catch (_err) {
      alert("Chyba pri vystavení faktúry.");
    }
    setIsLoading(false);
  };

  // Export do PDF na klientovi (vizuálny export)
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

  // Správa položiek (BEZ any!)
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
          {/* ... tvoj pôvodný JSX kód – všetky inputy, textarea, atď. NECHAJ TAK! */}
          {/* Zmeny sú LEN v handlePolozkaChange vyššie */}
          {/* ... */}
          {/* Poznámka: Pridaj do inputov onChange takto: */}
          {/* 
          <input
            ... ďalšie props ...
            onChange={e => handlePolozkaChange(i, "cena", Number(e.target.value) || 0)}
          />
          */}
          {/* ... */}
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
