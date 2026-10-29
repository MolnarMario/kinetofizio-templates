---
name: kineto-client
description: Turn a kineto/fizio business's Google Maps and/or Facebook page into a client proposal, with the three templates (Axa, Elan, Respiro) filled with their real data, logo and colours, plus a switcher page, published on GitHub Pages. Use when the user gives a Maps or Facebook link for a physiotherapy business and wants the templates customised for it.
argument-hint: <google-maps-url> [facebook-url] [slug]
---

# Client proposal from Maps and Facebook

Input: $ARGUMENTS
(If you are reading this file directly, the input is the links the user gave you.)

You end with four live pages:

- `https://thebarbellengineer.com/kinetofizio-templates/<slug>/` (the switcher)
- the same address plus `axa/`, `elan/` and `respiro/`

You also add a section to `README.md` and send the user a short report.

The worked example is `kineticfit/` (Clinica KineticFit, Satu Mare, commit 49656b0), and its rule files are in `examples/kineticfit/`. When a step is unclear, open the matching KineticFit file and copy what it does. That job took about two hours, and the slowest part was the photos.

Paths below: `K` is `.claude/skills/kineto-client/scripts` from the repo root, and `W` is a work folder in your own scratchpad (`<scratchpad>/<slug>`). Raw captures stay in `W` and never go in the repo.

## Rules

These win over speed. Every one of them comes from a mistake or a question on the KineticFit job.

1. **Every fact needs a source you saw.** That means Maps, Facebook, a photo of the premises or a public register. Write the fact and its source into `W/facts.md` as you go (start from `templates/facts.md`). Anything you can't source goes on the "De confirmat" list. The page then shows "de completat" or leaves the item out.
2. **Prices are the only thing you may estimate.** The templates need a price table. Use the business's own prices if a post or photo shows them. Otherwise estimate from the local market, mark each price in the HTML with `<!-- DE CONFIRMAT: preț estimat -->` and make the page say the prices are orientative.
3. **Quote reviews, never rewrite them.** Copy an exact excerpt. Mark every cut inside a quote with `[...]`, including cuts in the middle of a sentence. The only allowed edits are diacritics (ş/ţ to ș/ț, missing ă/î/â), obvious typos like "ca" for "că", and dropping emoji. Write the name as first name plus surname initial ("Diana C."). The label under the name, like "spate blocat", is yours, but it has to come from what the review says. The user asked whether the KineticFit quotes were real, so be ready to show the source of each one.
4. **Use only names you can tie to the current team.** Good sources are names on uniforms, names in recent posts and the owner's replies to reviews. Reviews older than a year often name staff who have left. KineticFit reviews named two therapists who weren't in any recent photo, so the site shows only Erik and Brian, whose names are embroidered on their polos.
5. **Photos come from the business itself.** Use the owner photos on Maps and their own Facebook photos. A photographer's watermark or signature goes on the list (photo rights). So does any photo where a patient's face is recognisable (consent). Fill an empty slot with the template's stock photo only when the business has nothing that fits, and say so in the README.
6. **Don't work around blocks.** The browser extension hides Facebook image URLs. That is on purpose, so capture images with zoom screenshots (step 2). Don't log in, don't solve CAPTCHAs, and decline optional cookies.
7. **Write the copy like a person.** It is Romanian with comma-below ș/ț, straight quotes and no em dashes. En dashes are fine in ranges like 12:00–20:00. The unslop rules in `~/.claude/CLAUDE.md` apply to the Romanian copy too. Axa and Elan talk to the reader as "tu". Respiro is written in the therapist's voice, so switch it to "noi" when there is more than one therapist. Don't invent claims: no years of experience, patient counts or certifications unless a source states them.

## Checklist

### 0. Set up

- [ ] Read `.aihive/board.md`. Then log `starting: <slug> client page` with `log_activity`. Another agent may be building a different client at the same time.
- [ ] Pick a slug: the brand name, lowercase, no spaces (`kineticfit`). Check that `<slug>/` doesn't exist yet.
- [ ] Once per machine, run `cd $K && npm install`. It installs sharp. Node is the scripting tool here, because Git Bash on this machine has no `python`.
- [ ] Create the work folders: `mkdir -p $W/raw $W/fb $W/out $W/frag $W/shots`.

### 1. Google Maps

Open the link in a new Chrome tab (claude-in-chrome). Short `maps.app.goo.gl` links redirect. Add `hl=ro` to the final URL to get Romanian labels, which the snippets below expect.

- [ ] **Overview.** Record the name, category, address, phone, website, rating and review count (write down the date, since the rating changes). Take the coordinates from the URL: `!3d<lat>!4d<lng>`.
  `document.querySelector('div[role=main]').innerText`
- [ ] **Hours.**
  `[...document.querySelectorAll('table tr')].map(r=>r.innerText.replace(/\s+/g,' ')).join('\n')`
- [ ] **"Despre" tab.** Record accessibility, payment methods, "programare necesară" and parking.
- [ ] **"Recenzii" tab.** Scroll the pane, expand every "Mai mult", then extract. The result is too long for one tool call, so keep it in `window._rv` and read it in slices of about 900 characters (`window._rv.slice(0,900)`, and so on). Save the full text of every review into `facts.md`.
  ```js
  const sc=[...document.querySelectorAll('div.m6QErb.DxyBCb')].pop();
  for(let i=0;i<8;i++){sc&&sc.scrollBy(0,4000);await new Promise(r=>setTimeout(r,700));}
  [...document.querySelectorAll('button')].filter(b=>/Mai mult|More/.test(b.innerText)&&b.getAttribute('aria-expanded')==='false').forEach(b=>b.click());
  await new Promise(r=>setTimeout(r,800));
  window._rv=[...document.querySelectorAll('div.jftiEf[data-review-id]')].map(r=>`## ${r.querySelector('.d4r55')?.innerText} | ${r.querySelector('.kvMYJc')?.getAttribute('aria-label')} | ${r.querySelector('.rsqaWe')?.innerText}\n${r.querySelector('.wiI7pd')?.innerText||''}`).join('\n\n');
  window._rv.length
  ```
- [ ] **Owner photos.** On the overview, open the photos and pick the "De la proprietar" filter. Scroll the pane and collect the URLs:
  ```js
  const sc=[...document.querySelectorAll('div.m6QErb.DxyBCb')].pop();
  for(let i=0;i<10;i++){sc&&sc.scrollBy(0,3000);await new Promise(r=>setTimeout(r,600));}
  window._ph=[...new Set([...document.querySelectorAll('[style*="googleusercontent"]')].map(e=>(e.getAttribute('style').match(/url\("?([^")]+)/)||[])[1]).filter(Boolean).map(u=>u.replace(/=w\d+.*$/,'')))];
  window._ph.length
  ```
  Download each one at full size: `curl -sS -m 30 -o $W/raw/m01.jpg "<url>=w2400-h2400-k-no"`. Then run `node $K/sheet.js $W/raw $W/shots/sheet-maps.jpg` and look at the contact sheet.
- [ ] **Read the photos as sources.** Window lettering, roll-up banners and posters list services. The equipment shows brand names (Winback, Chattanooga). Names are embroidered on uniforms. Zoom in on them. KineticFit's 15 therapies came from its shop window.

Google's class names (`jftiEf`, `d4r55`, `wiI7pd`, `kvMYJc`, `rsqaWe`, `m6QErb`) change from time to time. If a snippet returns nothing, run `get_page_text` or `read_page` and find the new selectors.

### 2. Facebook

- [ ] Decline optional cookies. Close the login dialog with its X and don't log in. If a login wall hides something, write down what you couldn't see.
- [ ] **Intro and About.** Record the phone, e-mail, website, address, Instagram link and category.
- [ ] **Posts.** Scroll through the last 30 or so with `get_page_text`. Look for services, staff names, prices, offers, hiring posts and opening-hour changes.
- [ ] **Photos.** Go through `/photos` and `/photos_albums`. The profile pictures album gives the logo, the largest version available. The cover photos give `og.jpg` and often the brand's font.
- [ ] **Capture method.** The extension blocks reading image URLs, so screenshot each image at native size:
  1. Open the photo in the viewer.
  2. Get the size and position of the biggest image:
     `const im=[...document.querySelectorAll('img')].sort((a,b)=>b.naturalWidth*b.naturalHeight-a.naturalWidth*a.naturalHeight)[0];const r=im.getBoundingClientRect();[im.naturalWidth,im.naturalHeight,Math.round(r.x),Math.round(r.y),Math.round(r.right),Math.round(r.bottom),devicePixelRatio].join(',')`
  3. Hover over an empty spot such as `[60,700]`, so the cursor isn't in the shot.
  4. Run `computer` `zoom` with `region:[x0,y0,x1,y1]` and `save_to_disk:true`.
  5. Check the saved width. Facebook serves about 960 to 1150 px, and that is the most you will get. Record the real width, because it goes into srcset.
  6. Press ArrowRight to move to the next photo.

### 3. Verify the rest

- [ ] **Website.** Run `curl -sSI -m 20 https://<domain>` and `nslookup <domain>`. A dead domain goes on the list. It is also a good opening for the sale: KineticFit's domain was printed on its Facebook cover and no longer resolved.
- [ ] **Company.** Use WebSearch for "<name> <city> CUI", and try listafirme.ro or termene.ro. Use the company name and CUI only if the registered address matches. If it doesn't, the footer says "de completat".
- [ ] **Other links** (Instagram, TikTok, booking apps). Open each one. An unverified link stays out of `sameAs`, or goes on the list.
- [ ] **Postal code.** Compare it with the city's range (Satu Mare municipality is 440xxx). If it doesn't fit, leave it out of the JSON-LD and put it on the list.

### 4. Brand

- [ ] Run `node $K/logo.js $W/fb/logo.png $W/out`, then open `$W/out/preview-logo.png`. Check two things:
  - the mark is cut above the wordmark;
  - on the dark panel only the dark parts turned light.
  
  Tune with `--dark-below` or `--no-mark` and run it again. The script also prints the main colours.
- [ ] Choose one main brand colour, one accent and a dark tone. Check every text pairing with `node $K/contrast.js <fg> <bg>`. Body text needs 4.5:1. If a brand colour is too light for text, use a darker shade of it for text and keep the brand shade for fills. KineticFit's gold #c79e41 scores 2.3:1 on cream. Its headings and big numbers use #94702a, which reaches 4.1:1, enough for large text only. Body text stays dark.
- [ ] If the logo or cover uses a recognisable Google Font, use it for headings in at least one variant. KineticFit's cover uses Poppins, which went into Axa. Load fonts only from Google Fonts.

Map the colours onto each template's tokens:

| Template | Main colour | Darker main | Light accents | Dark surfaces | Neutrals |
|---|---|---|---|---|---|
| Axa | `--teal` | `--teal-d` | `--aqua` | `--ink` | `--bg`, `--ice`, `--line`, `--ink-2` |
| Elan | `--blue` | `--blue-d` | `--lime` (highlight on dark) | `--navy`, `--navy-2` | `--bg`, `--line`, `--ink-2`, `--on-dark` |
| Respiro | `--green` | `--green-d` | `--sage`, `--sage-bg`, `--clay` | `--ink` | `--bg`, `--sand`, `--line`, `--ink-2` |

Each template also has colours hard-coded outside the tokens: the star colour `#e2a72e`, `rgba()` shadows of the old ink colour, hover backgrounds, the footer background and the SVG stroke inside Respiro's data URI (`stroke='%232f5d4a'`). List them with `grep -o '#[0-9a-fA-F]\{6\}\|rgba([^)]*)' varianta-1-axa/index.html | sort | uniq -c | sort -rn`. `examples/kineticfit/*-rules.json` shows every one that had to change.

### 5. Photos

- [ ] Pick photos for each slot. Ratios that worked for KineticFit are listed below, but the CSS crops with `object-fit`, so treat them as a guide.
  - **Axa:** hero (4:5, the clinic's best room or a treatment), two in services (3:2), team (3:4 or 3:2), the entrance for the contact block (3:2).
  - **Elan:** hero (a therapist working, wide), services (4:5, sticky beside the list), the team beside the reviews (3:4).
  - **Respiro:** hero (portrait, people), the letter from the therapist (4:5), the techniques section (16:9), tips (3:2).
- [ ] Write `W/photos.json` (see `examples/kineticfit/photos.json`), then run `node $K/photos.js $W/photos.json $W/out`. It prints `src`, `srcset`, `width` and `height` ready to paste, with the real widths.
- [ ] Write specific alt text that names what is in the photo and who. "Erik și Brian în fața siglei clinicii" works. "Echipa noastră" doesn't.

### 6. Build the three variants

Do these steps once for each variant: `axa` from `varianta-1-axa`, `elan` from `varianta-2-elan` and `respiro` from `varianta-3-respiro`.

- [ ] **Split the template** to get the two blocks you will rewrite: `node $K/split.js varianta-1-axa/index.html $W/frag/axa`. To see how KineticFit filled the same blocks, run `node $K/split.js kineticfit/axa/index.html $W/frag/kf-axa`.
- [ ] **Head fragment** (`frag/axa-head.html`). It holds:
  - a comment naming the variant, the client, the sources with their date, and what is still to confirm;
  - the `<title>` and meta description;
  - `theme-color`;
  - `canonical` and `og:url`, both pointing to the client's domain;
  - the OG tags;
  - the icons;
  - a preload for the hero image;
  - the Google Fonts link;
  - JSON-LD of type `Physiotherapy`, with name, url, image, logo, telephone, email, address, geo, openingHoursSpecification, sameAs and areaServed.

  Leave out anything that isn't verified. `<meta name="robots" content="noindex">` sits above this block in the template and stays there until launch.
- [ ] **Body fragment** (`frag/axa-body.html`). Rewrite the content and keep the structure the CSS and JS depend on:
  - section ids, plus the nav links that point to them;
  - `data-zone` (Axa body map) and `data-pick` (price buttons that pre-fill the form);
  - `data-days="1,2,3,4,5"` on hours rows (JavaScript day numbers, 0 is Sunday);
  - `data-today`, `data-today-hours` and `data-year`;
  - form field names (`zona`, `tip`) and `required`;
  - the Elan phase tabs (`.phases [role="tab"]`);
  - `data-hide-callbar` on the booking section.
- [ ] **Cut what doesn't fit.** Remove a section rather than fill it with invented content. If the business runs no classes, Respiro's timetable has to go. When you remove a section, also remove:
  - its nav link;
  - its CSS;
  - its JS block, with an `exact` rule (see the `/* orar */` rules in `examples/kineticfit/respiro-rules.json`).

  KineticFit turned the timetable into "Tehnicile, pe scurt", a short explainer of six techniques.
- [ ] **Rules** (`frag/axa-rules.json`):
  - `exact` holds `[old, new]` pairs that must each match. Use them for colour tokens, hard-coded colours, font changes and CSS for new elements.
  - `tokens` holds global swaps that may or may not match. The four contact tokens are always the same:

  ```json
  "tokens": [["contact@numestudio.ro", "<email>"], ["wa.me/40700000000", "wa.me/40<number>"], ["+40700000000", "+40<number>"], ["0700 000 000", "<0xxx xxx xxx>"]]
  ```
- [ ] **Splice:** `node $K/splice.js varianta-1-axa/index.html <slug>/axa/index.html $W/frag/axa-head.html $W/frag/axa-body.html $W/frag/axa-rules.json`. A rule that doesn't match stops the build. Fix the rule; don't skip it. "CHECK, still in the page: Exemplu" is fine on Elan, which has a real "Exemplu:" label.
- [ ] **Images.** Copy into `<slug>/<variant>/img/` only the files that page uses, plus `logo.png`, `semn.png` (Elan takes `semn-deschis.png` instead, for its dark header and footer), `favicon.png`, `apple-touch-icon.png` and `og.jpg`. Don't copy `preview-logo.png`.

### 7. Switcher page

- [ ] Copy `kineticfit/index.html` to `<slug>/index.html` and change:
  - the head comment, `<title>` and meta description;
  - the `.who` logo `src`, `width` and `height`, and the name in `<b>`;
  - the "De confirmat" `<ol>`, which must match your list;
  - the two strings in the script, `' a site-ului KineticFit'` and `'KineticFit, varianta '`;
  - `--green`, `--gold`, `--ink` and `--bg` in `:root`, set to the client's colours.
- [ ] `grep -n KineticFit <slug>/index.html` must print nothing.

### 8. Check

- [ ] `node $K/check.js <slug>` must exit 0. It catches:
  - placeholders, em dashes, curly quotes and cedilla ş/ţ;
  - missing images and srcset widths that don't match the files;
  - `<img>` without alt;
  - `#links` to missing ids;
  - broken JSON-LD and a missing noindex.

  It also warns about stock photo names and mixed phone numbers.
- [ ] Re-read every quote against `facts.md`. Each excerpt must appear verbatim in the original, with `[...]` wherever words are missing.
- [ ] **Serve.** Run `node $K/serve.js .` in the background from the repo root. It picks a free port and prints the address, so two agents never collide.
- [ ] **Desktop screenshots:** `bash $K/shot.sh http://127.0.0.1:<port>/<slug>/axa/ $W/shots/axa-d.png 1440 9000`, then `node $K/cut.js $W/shots/axa-d.png 1500 $W/shots/c-axa-d 0.5`. Look at every chunk.
- [ ] **Phone screenshots.** Windows won't make a headless window narrower than about 500 px, so use the harness. One call shows up to three anchors side by side:
  `bash $K/shot.sh "http://127.0.0.1:<port>/.claude/skills/kineto-client/scripts/m.html?u=http://127.0.0.1:<port>/<slug>/axa/&w=390&h=844&a=,servicii,echipa" $W/shots/axa-m.png 1260 880`.
  Cover every section id.
- [ ] **Real Chrome**, in a new tab on the local server:
  - **Switcher.** Each tab loads and updates the hash. ArrowRight moves between tabs. Telefon shows the 390 px frame. "De confirmat" opens and closes with Escape.
  - **Axa.** The hours card says "Azi, <day>". The body map changes zone. A price button pre-fills the form.
  - **Elan.** The phase tabs work with both click and arrow keys. A pack button pre-fills the form.
  - **Respiro.** The form builds its message, and the voucher link points to WhatsApp.
  - **All forms.** Run `window.open=(u)=>{console.log('OPEN',u);return null}` first, then submit an empty form (validation should show) and a filled one. Read the URL from the console. It must be `https://wa.me/40<their number>?text=...`. Nothing gets sent.
  - **Console.** `read_console_messages` with pattern `error|Error` must come back empty.

  If Chrome screenshots time out (the renderer froze on the KineticFit job), keep the JS checks and rely on the headless screenshots. Don't retry the same call.
- [ ] Stop the server.

### 9. README, commit, deploy

- [ ] Under `## Clienți` in `README.md`, add `### <Name>, <City>` in the same shape as the KineticFit section:
  - what the folder holds;
  - where the data came from, with the month;
  - the colour and font choices and why;
  - where the photos came from;
  - the numbered "De confirmat" list.

  The README is in Romanian.
- [ ] Commit only your own files. Never use `git add -A`, because another agent's half-built client folder may be sitting in the tree.
  ```sh
  git add <slug> README.md
  git commit -m "Add the <Name> client page with all three variants" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
  git pull --rebase && git push
  ```
  If README.md conflicts on rebase, keep both client sections, then run `git add README.md && git rebase --continue`.
- [ ] Wait for Pages, then check the four addresses:
  ```sh
  for i in $(seq 1 40); do s=$(gh api repos/MolnarMario/kinetofizio-templates/pages/builds/latest --jq .status); [ "$s" = built ] && break; sleep 10; done; echo $s
  for p in "" axa/ elan/ respiro/; do curl -s -o /dev/null -w "%{http_code} $p\n" "https://thebarbellengineer.com/kinetofizio-templates/<slug>/$p"; done
  ```
- [ ] Log `done: <slug> live (commit <hash>)` with `log_activity`.

### 10. Report to the user

Write it in English, short, and following the unslop rules:

- the switcher link, and how to open each variant on its own;
- what came from where (Maps, Facebook, photos of the premises), and the colours you took from the logo;
- the calls you made yourself (team names, estimated prices, sections you cut or changed), with the reason for each;
- the "De confirmat" list, with the domain status and anything you couldn't verify;
- how you tested, and anything you skipped;
- the commit hash.

## The "De confirmat" list

Start from these items and drop any that don't apply:

1. Prices, if estimated.
2. Company name, CUI, Registrul Comerțului number and health authorisation for the footer.
3. Full names, studies and specialisations of the team, and whether a hiring post is still current.
4. Whether the phone number has WhatsApp, since the form sends the request there.
5. Consent from the reviewers quoted.
6. Rights to photographers' photos, and consent for any recognisable patient.
7. Domain status, plus any social links you couldn't verify.
8. Postal code, if it doesn't fit the city's range.
