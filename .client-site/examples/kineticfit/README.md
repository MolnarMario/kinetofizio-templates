# Clinica KineticFit, Satu Mare: propunere de site

Pagina pentru client e la https://thebarbellengineer.com/kineticfit/. Are cele trei variante adaptate pentru Clinica KineticFit (Bulevardul Vasile Lucaciu 16, Satu Mare), cu taburi între ele. Varianta aleasă rămâne în adresă (`#axa`, `#elan`, `#respiro`), iar butonul Telefon arată pagina într-un cadru de 390 px. Lista "De confirmat" din bara de sus spune clientului ce mai trebuie trimis.

- `index.html` e pagina cu taburi.
- `axa/`, `elan/`, `respiro/` sunt variantele, fiecare cu `index.html` și `img/`. Pentru site-ul final se urcă un singur folder în `public_html`.

Variantele pornesc de la șabloanele din [kinetofizio-templates](https://github.com/MolnarMario/kinetofizio-templates) și sunt făcute cu skill-ul `client-site`. Toate paginile au `noindex` până la lansare.

## Surse

Datele vin din trei locuri, adunate în octombrie 2026:

- pagina de Facebook (facebook.com/clinicakineticfit): logo, coperta, telefonul 0757 580 831, e-mailul, echipa și anunțul de angajare;
- profilul de Google Maps: programul (luni–vineri, 12:00–20:00, doar cu programare), nota 5,0 din 17 recenzii, plata cu cardul și contactless, locurile și toaleta accesibile, pozele clinicii;
- vitrina clinicii, care se vede în poze: lista celor 15 terapii, de la Tecar la plan alimentar.

Culorile sunt luate din logo: verde #3d544e și auriu #c79e41, cu crem și negru. Axa folosește Poppins pentru titluri, ca pe coperta de Facebook. În Respiro, orarul claselor a devenit "Tehnicile, pe scurt", pentru că clinica nu ține clase, iar textul e la plural, fiindcă lucrează doi kinetoterapeuți. Pe silueta din Axa, coloana e desenată din puncte aurii, ca vertebrele din logo.

Pozele cu aparatura și sala sunt pozele clinicii de pe Google Maps, făcute de un fotograf (semnătura apare în colț). Pozele cu oameni sunt de pe Facebook, la 1151 px, cât servește Facebook. Logoul e decupat de pe fundal alb din poza de profil.

## De confirmat cu clinica înainte de publicare

1. Prețurile. Toate sunt orientative și marcate cu `DE CONFIRMAT` în HTML.
2. Denumirea firmei, CUI-ul, numărul de la Registrul Comerțului și autorizația sanitară. În subsol scrie acum "de completat".
3. Numele complete, studiile și specializările lui Erik și Brian. Pe site apar doar prenumele, ca pe tricourile lor. Anunțul de angajare e de pe Facebook și poate fi vechi.
4. Dacă 0757 580 831 are WhatsApp. Formularul și butoanele trimit acolo.
5. Acordul autorilor pentru recenziile citate. Sunt reale, de pe Google, scurtate, cu prenumele și inițiala.
6. Dreptul de a folosi pozele fotografului pe site.
7. Domeniul clinicakineticfit.com, scris pe coperta de Facebook, nu mai are DNS. Trebuie reînnoit sau ales altul. Linkul de Instagram e luat de pe roll-up-ul lor și nu e verificat.
8. Codul poștal. Google și Facebook dau 447230, dar codurile din municipiul Satu Mare încep cu 440, așa că l-am lăsat afară din datele structurate.
