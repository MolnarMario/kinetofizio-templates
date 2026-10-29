# kinetofizio-templates: notes for client-site

This is the template-set profile for the `client-site` skill (`~/.claude/skills/client-site/SKILL.md`). `profile.json` is for the scripts. This file is for the agent. Read it before building a client from these templates.

## The trade

The templates are for kinetoterapie and fizioterapie clinics in Romania, which is a health trade.

- **Results.** Don't promise any. "Scapi de durere în 3 ședințe" is out. Say what a technique does and who it suits.
- **Services.** Use the business's exact service names and explain each in one plain sentence. Don't add services they don't list.
- **Estimates.** Prices only.
- **Footer.** It needs the legal name, CUI, Registrul Comerțului number and autorizația sanitară. Write "de completat" until the client sends them.
- **JSON-LD.** Type `Physiotherapy`.

## Language and voice

The copy is Romanian, with comma-below ș and ț (`check.js` rejects ş/ţ with a cedilla). Use straight quotes. En dashes are fine in ranges like 12:00–20:00 and luni–vineri.

| Template | Voice |
|---|---|
| Axa | the clinic talking to the reader, "tu" |
| Elan | sport coach tone, "tu" |
| Respiro | a letter from the therapist in the first person. Switch to "noi" when there is more than one therapist, and sign with their first names |

## Head block

The head block runs from the first comment in `<head>` to `<style>`. It holds:

- a comment naming the variant, the client, the sources with their month, and what is still to confirm;
- the `<title>` and meta description;
- `theme-color`;
- `canonical` and `og:url`, both pointing to the client's domain;
- `og:type`, `og:locale` `ro_RO`, `og:title`, `og:description` and `og:image` (`img/og.jpg`);
- the icons;
- a preload for the hero image;
- the Google Fonts link;
- JSON-LD `Physiotherapy` with `name`, `url`, `image`, `logo`, `telephone`, `email`, `address`, `geo`, `openingHoursSpecification`, `sameAs` and `areaServed`.

Leave out any field you couldn't verify. `<meta name="robots" content="noindex">` sits above the block, on line 7 of every template, and stays there until launch.

The body block runs from just after `<body>` to the main `<script>`.

## Axa (`varianta-1-axa`)

The look is clinical and light. Its sections, in order:

| Id | What it is |
|---|---|
| `#sus` | hero with a proof row (rating, number of services, hours) |
| `#unde-doare` | body map |
| `#servicii` | services |
| `#prima-vizita` | first visit |
| `#echipa` | team |
| `#tarife` | prices |
| `#recenzii` | reviews |
| `#intrebari` | FAQ |
| `#programare` | booking: hours table, form and map |

- **Tokens.** `--teal` is the main colour and `--teal-d` its darker shade. `--aqua` is the light accent. `--ink` is the dark surface. The neutrals are `--bg`, `--ice`, `--line` and `--ink-2`. KineticFit added `--gold`, `--gold-d` and `--head` (the heading font).
- **Hard-coded colours.** The star colour `#e2a72e`, the `rgba(11,42,53,…)` shadows, the `rgba(10,119,108,.16)` focus ring, the `.book` text colours `#e9f1f2` and `#a9bfc5`, and the `#b9cbd0` border.
- **Image slots.** Hero (4:5), two in services (3:2) and the team (3:4 or 3:2). KineticFit added an entrance photo to the booking block (`.door`, 3:2).
- **JS hooks.**
  - Body map: `data-zone` on its buttons and articles, and `select[name="zona"]`.
  - Price buttons: `data-pick`, which pre-fills the form.
  - Hours: `data-days="1,2,3,4,5"` rows (JavaScript day numbers, 0 is Sunday), `[data-today]` and `[data-today-hours]`.
  - Footer: `[data-year]`.
  - Navigation and booking: `.nav a`, `.menu-btn`, `.callbar` and `[data-hide-callbar]`.
  - Form: `[required]`.
- **Browser checks.**
  - The hours card says "Azi, <zi>".
  - Each body map zone shows its own panel.
  - A price button pre-fills the form.
  - An empty submit shows validation.
  - The WhatsApp URL carries the client's number.

## Elan (`varianta-2-elan`)

The look is sporty and energetic. Its sections, in order:

| Id | What it is |
|---|---|
| `#sus` | dark hero |
| `#sporturi` | sports list |
| `#servicii` | services |
| `#etape` | return-to-sport phase tabs |
| `#echipa` | team |
| `#preturi` | prices |
| `#recenzii` | reviews |
| `#intrebari` | FAQ |
| `#programare` | booking |

- **Tokens.** `--blue` is the main colour and `--blue-d` its darker shade. `--lime` is the highlight on dark. `--navy` and `--navy-2` are the dark surfaces. The neutrals are `--bg`, `--line`, `--ink`, `--ink-2` and `--on-dark`.
- **Hard-coded colours.** The phase button hover `#1b2f5e`, the `rgba(10,22,48,.18)` borders, the footer `#060e20` and the `.g-score` star `#e2a72e`.
- **Wordmark.** The template's is uppercase and condensed. KineticFit switched that off to match its logo.
- **Logo.** The header and footer are dark, so use `semn-deschis.png`.
- **Image slots.** Hero (a therapist at work, wide), services (4:5, sticky beside the list) and beside the reviews (3:4, the team or an action shot).
- **JS hooks.** `.phases [role="tab"]` (click and arrow keys), `data-pick`, which fills `select[name="tip"]`, `data-days`, `[data-year]` and `[required]`.
- **Placeholder warning.** "Exemplu:" is a real label in this template, so the soft-placeholder warning for it is expected.
- **Phase tabs.** They describe a generic timeline for knee ligament (ACL) recovery. Keep them when the business does sports rehab. Cut them when it doesn't.
- **Browser checks.**
  - The phase tabs work with both click and arrow keys.
  - A pack button pre-fills the form.
  - The form URL carries the client's number.

## Respiro (`varianta-3-respiro`)

The look is warm and calm. Its sections, in order:

| Id | What it is |
|---|---|
| `#sus` | hero |
| `#despre` | letter from the therapist |
| `#servicii` | services |
| `#orar` | class timetable |
| `#prima-sedinta` | first session |
| `#tarife` | prices |
| `#sfaturi` | tips |
| `#recenzii` | reviews |
| `#intrebari` | FAQ |
| `#contact` | voucher block, hours and form |

- **Tokens.** `--green` is the main colour and `--green-d` its darker shade. `--sage`, `--sage-bg` and `--clay` are the soft accents. The neutrals are `--sand`, `--bg`, `--ink`, `--ink-2` and `--line`.
- **Hard-coded colours.** `#c9d8cd`, the `.gift p` colour `#5b4c42`, and the wave's SVG stroke inside a data URI, `stroke='%232f5d4a'`.
- **Image slots.** Hero (portrait with people, 3:4), the letter (4:5), the timetable or techniques section (16:9) and tips (3:2).
- **JS hooks.** The timetable uses `.day[data-d]` and `.days-nav button`. The rest are `data-days`, `[data-year]` and `[required]`.
- **No classes.** Remove `#orar`, its nav link, its CSS and the timetable JS. `examples/kineticfit/respiro-rules.json` has the exact rules. KineticFit replaced it with "Tehnicile, pe scurt", a `.glos` grid that explains six techniques.
- **Browser checks.**
  - The form builds its message.
  - The voucher link points to WhatsApp.
  - If the timetable stays, its day buttons switch days.

## Romanian specifics

- **Company register.** Search listafirme.ro or termene.ro, which carry ONRC data. Use the result only if the registered address matches the clinic.
- **Postal codes.** These are per street. Google sometimes shows a code that doesn't fit the city: the Satu Mare municipality uses 440xxx, but Google showed 447230. When unsure, leave the code out of the JSON-LD.
- **Phone formats.** Write `0757 580 831` on the page, `+40757580831` in `tel:` links and `wa.me/40757580831` for WhatsApp.

## Standard to-confirm items for this trade

Write the list in Romanian on the page, and in the switcher's `client.json`:

1. Prețurile, if estimated.
2. Denumirea firmei, CUI, numărul de la Registrul Comerțului, autorizația sanitară.
3. Numele complete, studiile și specializările terapeuților.
4. Dacă numărul are WhatsApp, since the form sends there.
5. Acordul autorilor recenziilor citate.
6. Dreptul de a folosi pozele fotografului, and the consent of any recognisable patient.
7. The domain's status, plus any social link you couldn't verify.
8. The postal code, if it doesn't fit the city.

## Example client: KineticFit

The pages are live at https://thebarbellengineer.com/kineticfit/, from the repo `MolnarMario/kineticfit`, cloned locally in `clients/kineticfit/`. `examples/kineticfit/` has the rules for all three variants, `photos.json`, `client.json` and the README. Splitting `clients/kineticfit/<id>/index.html` gives its head and body blocks. Rebuilding with those files reproduces the live pages byte for byte.

Lessons from that job:

- **Colour contrast.** The brand gold #c79e41 only reaches 2.3:1 on cream. Headings and big numbers use #94702a, which gets 4.1:1 and is enough for large text only. Body text stays dark.
- **Heading font.** Poppins comes from the Facebook cover. It sets Axa's headings through `--head`.
- **Team names.** Two older reviews name therapists who appear in no recent photo. The site names only Erik and Brian, whose names are embroidered on their polos.
- **Services.** The 15 services came from the shop window in a Maps photo.
- **Website.** The domain on the Facebook cover no longer resolved, so it went on the list. The Instagram link came from a printed banner and stayed unverified.
- **README.** `examples/kineticfit/README.md` is the model for later clients.

## Publishing

Each client gets its own repo, `MolnarMario/<slug>`, cloned in `clients/<slug>/`, which this repo ignores. GitHub Pages serves it from `main` at `https://thebarbellengineer.com/<slug>/`, because the account's user site owns that domain. Trimming the slug off a client's address leads to Mario's own site, never to this template gallery.

KineticFit and FizioTerapia Plus were first published inside this repo. Their old folders here now hold only redirects to the new addresses, so links already sent keep working. Don't add client folders to this repo.
