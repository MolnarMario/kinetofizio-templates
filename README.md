# Șabloane pentru studiouri de kinetoterapie și fizioterapie

Trei site-uri de prezentare pe o singură pagină, gândite pentru studiourile care vor site făcut de Mario. Ca la site-ul Danielei Rusev, nu au build și nici framework: fiecare variantă e un `index.html` cu CSS și JS inline, plus un folder `img/`.

Toate datele de contact, echipa, prețurile și recenziile sunt de exemplu. Se înlocuiesc cu datele studioului înainte de orice publicare.

## Structura

- `index.html` din rădăcină e pagina de prezentare pentru client: cele trei variante, cu captură de ecran, fonturi și culori. Are `noindex` și nu se urcă pe site-ul clientului.
- `prezentare/` are capturile folosite de pagina de mai sus.
- `varianta-1-axa/`, `varianta-2-elan/`, `varianta-3-respiro/` sunt variantele. Pentru un client se copiază un singur folder, iar conținutul lui ajunge în `public_html`.

## Variantele

### 1. Axa, clinică

Pentru o clinică cu mai mulți terapeuți și aparatură. Fundal deschis, bleumarin-petrol cu verde-teal, Hanken Grotesk. Colțul pozei din hero are o riglă de goniometru (0° la 90°), desenată în SVG.

În plus față de secțiunile de bază:

- **Unde te doare?** O siluetă văzută din spate, cu 8 zone (gât, umăr, spate, lombar, cot și încheietură, șold, genunchi, gleznă). La clic apar afecțiunile frecvente, terapiile și un link care completează zona în formular. Conținutul fiecărei zone e în HTML (`article[data-zone]`), deci îl vede și Google. Punctele de pe siluetă au poziția în `style="left:..;top:.."`, în procente din desen.
- Cardul de program din hero arată ziua de azi și orele, citite din tabelul de program de la contact.
- Echipă cu un profil mare (fondatorul, cu poză) și trei membri cu inițiale, pentru studiourile care nu au poze cu toată echipa.

### 2. Elan, sport

Pentru recuperare sportivă. Bleumarin, albastru cobalt și verde-lime, Archivo condensat pentru titluri, colțuri drepte și poza din hero tăiată în diagonală.

În plus:

- **Sporturi** cu accidentările tipice fiecăruia.
- **Etapele recuperării**: patru taburi (Protecție, Mobilitate, Forță, Revenire) pe exemplul ligamentului încrucișat, fiecare cu ce lucrăm și criteriile de trecere la etapa următoare. Taburile merg și din săgețile tastaturii. Exemplul se poate schimba cu altă recuperare (umăr, gleznă) dacă studioul preferă.
- **Pachete** (evaluare, 10 ședințe, revenire la sport) și lista de ședințe individuale. Butoanele pachetelor completează alegerea în formular.

### 3. Respiro, studio

Pentru un studio mic, cu un singur terapeut, pilates terapeutic, copii și seniori. Crem, verde de pădure și salvie, Newsreader cu Figtree. O linie ondulată subțire ("respirația") apare în hero și la pașii primei ședințe. Textul e la persoana întâi ("îți răspund", "scrie-mi").

În plus:

- **Scrisoare de bun venit** de la terapeut, cu poză și formare.
- **Orarul claselor** pe zile. Pe calculator se vede toată săptămâna, pe telefon câte o zi, cu butoane Lu–Sâ. Ziua de azi e marcată.
- **Voucher cadou**, cu link de WhatsApp.
- **Trei exerciții pentru pauza de la birou**, ca mostră de conținut util.

## Ce au toate

Header fix cu meniu pe telefon, secțiunea curentă subliniată în meniu, servicii, prima vizită, echipă, tarife, recenzii, întrebări frecvente (`<details>`), programare, hartă și subsol cu datele firmei. Pe telefon apare jos o bară cu Sună și WhatsApp după ce treci de hero; dispare la secțiunea de contact și în subsol.

Formularul de programare nu trimite nimic pe server. Compune mesajul și îl deschide în WhatsApp (`wa.me`) sau în aplicația de e-mail (`mailto:`). Dacă un client vrea mesajele direct pe e-mail, pe Hostico se poate pune un mic script PHP în loc.

Fiecare pagină are meta pentru Google și rețele sociale, `og.jpg` de 1200×630 și date structurate de tip `Physiotherapy` (schema.org), cu adresă și program.

## Ce se înlocuiește

Valorile de exemplu sunt identice în toate variantele, așa că merg cu Find & Replace în tot folderul:

| Exemplu | Ce pui |
|---|---|
| `Nume Studio` | numele studioului (apare și în `Nume Studio SRL`) |
| `0700 000 000` | telefonul, cum se afișează |
| `+40700000000` | telefonul în linkurile `tel:` și în date structurate |
| `40700000000` | numărul de WhatsApp, fără `+` |
| `contact@numestudio.ro` | e-mailul |
| `numestudio.ro` | domeniul (canonical, og:url, og:image, date structurate) |
| `Strada Exemplu nr. 10` | adresa, apoi sectorul și orașul din jurul ei |
| `Nume Prenume` | numele terapeuților |
| `NP` | inițialele din pătratele echipei (Axa, Elan) |
| `Universitatea Exemplu` | facultatea terapeutului |
| `Asigurator 1`, `Asigurator 2` | abonamentele medicale acceptate (Axa) sau se scoate fraza |
| `CUI RO00000000`, `J40/0000/2020`, `0000/2020` | datele firmei și autorizația sanitară, în subsol |

Apoi, de mână:

1. **Program.** Tabelul de la contact (`data-days`: 0 = duminică, 1 = luni…) și `openingHoursSpecification` din JSON-LD. Cardul din hero (Axa) și evidențierea zilei se iau automat din tabel.
2. **Prețuri.** Toate sunt orientative, puse doar ca să arate pagina plină.
3. **Recenzii.** Citatele, nota și numărul de recenzii sunt inventate și marcate cu un comentariu `EXEMPLU` în HTML. Se pun recenzii reale de pe Google, doar cu acordul autorilor, iar linkul "Citește-le pe Google" trebuie să ducă la profilul studioului.
4. **Hartă.** `iframe.map` arată acum Bucureștiul. Se înlocuiește cu embed-ul din Google Maps al studioului (Distribuie, Încorporează o hartă).
5. **Fotografii.** Se înlocuiesc cu poze reale ale studioului și ale echipei. Fișierele au două mărimi, `-800.webp` și `-1600.webp`, plus `og.jpg`. Dacă se schimbă proporțiile pozei, se actualizează și `width`/`height` din `<img>`.
6. **Cifrele din hero** (ani de practică, recenzii) și textele "Despre" trebuie confirmate cu clientul.
7. **Orarul** (Respiro) și **etapele recuperării** (Elan) se adaptează la ce face studioul de fapt.
8. **Favicon.** Fiecare variantă are un semn simplu, în SVG inline. Se schimbă cu logo-ul clientului.

## De verificat înainte de lansare

- Se scoate `<meta name="robots" content="noindex">` din `<head>`. E acolo ca demo-ul de pe GitHub Pages să nu apară în Google cu date de exemplu.
- Terapeuții au autorizație de liberă practică de la Colegiul Fizioterapeuților din România (colegiulfizioterapeutilor.ro). Textele din site spun asta, deci trebuie să fie adevărat pentru toată echipa. Asistentul de balneofizioterapie din Axa e alt statut, se verifică titlul exact.
- Autorizația sanitară de funcționare și datele firmei din subsol.
- Paginile de politică de confidențialitate și de cookie-uri. Linkurile din subsol și din formular sunt acum `#`.
- Google Maps și Google Fonts se încarcă de la Google. Dacă clientul vrea să evite bannerul de cookie-uri, fonturile se pot găzdui local, iar harta se poate încărca doar la clic.
- Linkul ANPC SAL din subsol rămâne. Platforma europeană SOL s-a închis în iulie 2025, așa că nu mai e nevoie de ea.
- Textul folosește "tu". Dacă studioul preferă "dumneavoastră" (de exemplu pentru pacienți în vârstă), se schimbă peste tot.
- Serviciile cu formare specială (unde de șoc, pilates terapeutic, recuperare după naștere, scolioză) rămân doar dacă studioul le face și are pregătirea pentru ele.

## Fotografii de exemplu

Toate sunt de pe Wikimedia Commons, în domeniul public sau CC0, deci se pot folosi fără atribuire. Sunt doar ca să arate șablonul și se înlocuiesc cu poze reale.

| Fișier | Licență | Sursă |
|---|---|---|
| kinesio-taping | domeniu public | [Kinesio taping.jpg](https://commons.wikimedia.org/wiki/File:Kinesio_taping.jpg) |
| banda-elastica | domeniu public | [Spangdahlem physical therapy (7270860)](https://commons.wikimedia.org/wiki/File:Spangdahlem_physical_therapy_rehabilitates_Airmen_after_injury_(7270860).jpg) |
| echilibru | domeniu public | [Spangdahlem physical therapy (7270858)](https://commons.wikimedia.org/wiki/File:Spangdahlem_physical_therapy_rehabilitates_Airmen_after_injury_(7270858).jpg) |
| aparatura | domeniu public | [Physical therapy clinic receives new equipment](https://commons.wikimedia.org/wiki/File:Physical_therapy_clinic_receives_new_equipment_130103-F-ES880-430.jpg) |
| terapeut-1 | domeniu public | [Massage Therapists, DPLA 93a17c00](https://commons.wikimedia.org/wiki/File:Massage_Therapists_-_DPLA_-_93a17c00e9d2977f205972ab30c67a44.jpg) |
| terapeut-2 | domeniu public | [Massage Therapists, DPLA 1bf87375](https://commons.wikimedia.org/wiki/File:Massage_Therapists_-_DPLA_-_1bf8737575440a05d0e7a637d53a5548.jpg) |
| alergare-lac | CC0 | [Sports2.jpg](https://commons.wikimedia.org/wiki/File:Sports2.jpg) |
| sprint-oras | CC0 | [Sprinting in Vienna](https://commons.wikimedia.org/wiki/File:Sprinting_in_Vienna_(Unsplash).jpg) |
| yoga-plaja | CC0 | [Yoga in the beach](https://commons.wikimedia.org/wiki/File:Yoga_in_the_beach_(Unsplash).jpg) |
| yoga-parc | CC0 | [Hatha Yoga, Halasana](https://commons.wikimedia.org/wiki/File:Hatha_Yoga,_Halasana,_Zhengzhou,_China.JPG) |

## Clienți

Un client nou se face cu skill-ul general `client-site` (`~/.claude/skills/client-site/SKILL.md`, pe calculatorul lui Mario): `/client-site <link Google Maps> <link Facebook>`. Ce e specific acestor șabloane (culorile fiecărei variante, pozele, ce folosește JavaScriptul, lista de confirmat pentru o clinică) e în `.client-site/profile.md`, iar `.client-site/profile.json` e pentru scripturi. KineticFit e exemplul complet, în `.client-site/examples/kineticfit/`.

Paginile clienților nu stau în acest repo. Fiecare client are repo-ul lui, `MolnarMario/<slug>`, publicat la `https://thebarbellengineer.com/<slug>/`, de exemplu https://thebarbellengineer.com/kineticfit/. Adresa nu trece prin `kinetofizio-templates/`, așa că un client care șterge din ea ajunge pe site-ul lui Mario, nu la șabloane. Pe calculatorul lui Mario, repo-urile clienților sunt clonate în `clients/<slug>/`, un folder pe care acest repo îl ignoră. Sursele datelor și lista de confirmat pentru fiecare client sunt în README-ul repo-ului lui.

Primii doi clienți, KineticFit și FizioTerapia Plus, au fost publicați la început aici. Folderele `kineticfit/` și `fizioterapiaplus/` au rămas doar cu pagini care trimit la adresa nouă, ca linkurile deja trimise să meargă în continuare.

## Publicare

Demo-ul e pe GitHub Pages, din ramura `main`: http://thebarbellengineer.com/kinetofizio-templates/. Domeniul vine de la site-ul de utilizator al contului MolnarMario, care are domeniu propriu, așa că adresa `molnarmario.github.io/kinetofizio-templates/` redirecționează acolo. Fișierul `.nojekyll` oprește procesarea Jekyll, ca paginile să fie servite exact cum sunt.

Pentru un client, la fel ca la site-ul Danielei: fișierele variantei alese se urcă în `public_html`. Pentru fiecare client merită adăugate `.htaccess` (HTTPS, fără www, cache pentru poze), `robots.txt` și `sitemap.xml`, după modelul din repo-ul `daniela-rusev-psihoterapeut`.

Testat în Chrome la 1440 px și 390 px lățime.
