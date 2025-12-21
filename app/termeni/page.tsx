import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Termeni și condiții",
  description: "Termeni și condiții de utilizare pentru callatispress.ro",
};

export default function TermeniPage() {
  const updated = "decembrie 2025";

  return (
    <main className="bg-white text-gray-900 dark:bg-[#0b131a] dark:text-white">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            Termeni și condiții
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-white/60">
            Ultima actualizare: {updated}
          </p>
        </header>

        <article className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-extrabold">
          <p>
            Prin accesarea și utilizarea site-ului{" "}
            <strong>callatispress.ro</strong> („Site-ul”), confirmați că ați
            citit, înțeles și acceptat acești Termeni și Condiții. Dacă nu
            sunteți de acord cu ei, vă rugăm să nu utilizați Site-ul.
          </p>

          <h2>1. Despre Site</h2>
          <p>
            <strong>Callatis Press</strong> este o platformă online de
            informare. Conținutul publicat are caracter informativ și
            jurnalistic.
          </p>
          <p>
            Administratorul Site-ului („Operatorul”) poate modifica oricând
            structura, conținutul sau funcționalitățile Site-ului, fără
            notificare prealabilă.
          </p>

          <h2>2. Acces și utilizare</h2>
          <p>
            Accesul la Site este, în general, gratuit. Este interzisă utilizarea
            Site-ului în mod abuziv, inclusiv (fără limitare):
          </p>
          <ul>
            <li>încercări de acces neautorizat la sisteme/conturi;</li>
            <li>încărcarea sau distribuirea de conținut malițios;</li>
            <li>
              perturbarea funcționării Site-ului ori a serviciilor asociate.
            </li>
          </ul>
          <p>
            Operatorul își rezervă dreptul de a restricționa accesul
            utilizatorilor care încalcă acești termeni.
          </p>

          <h2>3. Drepturi de autor și proprietate intelectuală</h2>
          <p>
            Textele, imaginile, materialele audio-video, elementele grafice,
            logo-ul și identitatea vizuală publicate pe Site sunt protejate de
            legislația privind drepturile de autor și de alte norme aplicabile.
          </p>
          <p>
            Este permisă preluarea de fragmente scurte din articole, cu
            respectarea cumulativă a următoarelor condiții:
          </p>
          <ul>
            <li>
              menționarea vizibilă a sursei: <strong>Callatis Press</strong> /{" "}
              <strong>callatispress.ro</strong>;
            </li>
            <li>includerea unui link activ către articolul original;</li>
            <li>
              păstrarea sensului materialului și evitarea scoaterii din context.
            </li>
          </ul>
          <p>
            Reproducerea integrală sau utilizarea în scop comercial/publicitar a
            conținutului necesită acordul prealabil al Operatorului.
          </p>

          <h2>4. Conținut furnizat de terți</h2>
          <p>
            Site-ul poate include opinii, declarații sau materiale furnizate de
            terți (de ex. comunicate, declarații publice, citate).
            Responsabilitatea pentru aceste materiale aparține autorilor lor, în
            măsura permisă de lege.
          </p>

          <h2>5. Acuratețe și limitarea răspunderii</h2>
          <p>
            Operatorul depune eforturi rezonabile pentru acuratețea
            informațiilor, însă nu poate garanta că toate informațiile sunt
            complete, actuale sau lipsite de erori în orice moment.
          </p>
          <p>
            Utilizarea informațiilor se face pe propria răspundere. Site-ul nu
            oferă consultanță juridică, medicală, financiară sau de altă natură.
          </p>

          <h2>6. Linkuri către site-uri externe</h2>
          <p>
            Site-ul poate conține linkuri către pagini externe. Operatorul nu
            controlează și nu își asumă răspunderea pentru conținutul sau
            politicile acelor site-uri.
          </p>

          <h2>7. Trimiterea de informații către redacție</h2>
          <p>
            Dacă trimiteți către Callatis Press informații, texte, fotografii
            sau materiale video („Materiale”), confirmați că aveți dreptul să le
            furnizați și că nu încălcați drepturile altor persoane.
          </p>
          <p>
            Permiteți folosirea Materialelor în scop editorial (cu menționarea
            sursei dacă este cazul). Dacă doriți condiții speciale (credit,
            anonimizare, embargo etc.), menționați explicit în mesaj.
          </p>

          <h2>8. Comentarii și conduită</h2>
          <p>
            Dacă Site-ul permite comentarii sau interacțiuni, este interzis
            conținutul ilegal, defăimător, discriminatoriu, amenințător, obscen
            sau instigator la ură, ori orice conținut care încalcă drepturi de
            autor sau drepturi de confidențialitate.
          </p>
          <p>
            Operatorul poate modera sau elimina conținutul care încalcă aceste
            reguli.
          </p>

          <h2>9. Cookie-uri</h2>
          <p>
            Site-ul poate utiliza cookie-uri și tehnologii similare pentru
            funcționare, analiză și îmbunătățirea experienței. Puteți controla
            cookie-urile din setările browserului. Pentru detalii, consultați{" "}
            <Link href="/confidentialitate">Politica de confidențialitate</Link>
            .
          </p>

          <h2>10. Modificarea Termenilor</h2>
          <p>
            Operatorul poate actualiza oricând acești Termeni. Versiunea
            actualizată va fi publicată pe această pagină, iar utilizarea în
            continuare a Site-ului reprezintă acceptarea modificărilor.
          </p>

          <h2>11. Contact</h2>
          <p>
            Pentru solicitări legate de conținut, drepturi de autor sau aspecte
            administrative, folosiți datele de contact publicate pe Site (de ex.
            în footer sau într-o pagină de contact).
          </p>
        </article>
      </div>
    </main>
  );
}
