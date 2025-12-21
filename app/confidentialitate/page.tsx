import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politica de confidențialitate",
  description:
    "Politica de confidențialitate și cookie-uri pentru callatispress.ro",
};

export default function ConfidentialitatePage() {
  const updated = "decembrie 2025";

  return (
    <main className="bg-white text-gray-900 dark:bg-[#0b131a] dark:text-white">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            Politica de confidențialitate
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-white/60">
            Ultima actualizare: {updated}
          </p>
        </header>

        <article className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-extrabold">
          <p>
            Această politică explică modul în care{" "}
            <strong>Callatis Press</strong> („Operatorul”) poate colecta și
            folosi datele atunci când utilizați site-ul{" "}
            <strong>callatispress.ro</strong>.
          </p>

          <h2>1. Ce date putem colecta</h2>
          <ul>
            <li>
              date de navigare (ex: pagini vizitate, tip dispozitiv, browser);
            </li>
            <li>adresă IP și informații tehnice similare;</li>
            <li>
              date furnizate voluntar (de ex. prin mesaje trimise redacției).
            </li>
          </ul>

          <h2>2. Scopurile prelucrării</h2>
          <ul>
            <li>
              furnizarea și îmbunătățirea conținutului și funcțiilor site-ului;
            </li>
            <li>securitate și prevenirea abuzurilor;</li>
            <li>răspuns la solicitări sau mesaje primite.</li>
          </ul>

          <h2>3. Cookie-uri</h2>
          <p>
            Site-ul poate utiliza cookie-uri pentru funcționare și pentru
            îmbunătățirea experienței. Puteți controla cookie-urile din setările
            browserului. Refuzul cookie-urilor poate afecta anumite funcții.
          </p>

          <h2>4. Partajare către terți</h2>
          <p>
            Datele pot fi partajate către furnizori tehnici (de ex. hosting,
            analiză) doar în măsura necesară funcționării site-ului și cu
            respectarea obligațiilor legale.
          </p>

          <h2>5. Perioada de stocare</h2>
          <p>
            Păstrăm datele doar atât cât este necesar pentru scopurile
            menționate sau cât impune legislația aplicabilă.
          </p>

          <h2>6. Drepturile utilizatorilor</h2>
          <p>
            În funcție de situație, puteți avea dreptul de acces, rectificare,
            ștergere, restricționare, opoziție și portabilitate, conform
            legislației aplicabile.
          </p>
          <p>
            De asemenea, puteți depune o plângere la autoritatea competentă:
            <strong> ANSPDCP</strong> (dataprotection.ro).
          </p>

          <h2>7. Modificări ale politicii</h2>
          <p>
            Putem actualiza această politică. Versiunea curentă este publicată
            pe această pagină.
          </p>

          <p>
            Înapoi la <Link href="/termeni">Termeni și condiții</Link>.
          </p>
        </article>
      </div>
    </main>
  );
}
