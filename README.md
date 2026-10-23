# Checkpoint Prep — Cambridge Lower Secondary Stage 8

A free revision app for Cambridge Lower Secondary Stage 8 students working towards the Checkpoint exams.
It runs in any browser, installs on iPhone, iPad and Android (Add to Home Screen), and works offline.

**Subjects:** Mathematics · Science · English · English as a Second Language · Global Perspectives · Computing · Maths Booster (basics → strong)

Each subject has:
- **Topic notes** with worked examples and common mistakes
- **Quick tests**, marked instantly
- **5 timed mock papers** with worked solutions and mark schemes
- **Exam tips**

There's also a **progress dashboard** that tracks scores and points out weak topics.

With [Supabase](https://supabase.com) connected (free plan), it adds **student accounts, cloud sync, and an admin panel**: class overview, per-student results, weak topics, account management and CSV export.

## Quick start
- **Try it locally:** open `index.html` in a browser.
- **Turn on accounts and the admin panel, and install on phones:** see [SETUP.md](SETUP.md).
- **Hosting:** GitHub Pages serves this repository directly, and every push to `main` updates the live site.

## Project layout
| Path | Purpose |
|---|---|
| `index.html`, `app.js`, `styles.css` | The app |
| `data/*.js` | Subject content (check it with `node tools/validate.js`) |
| `cloud.js`, `admin.js`, `config.js` | Accounts and sync, admin panel, Supabase connection |
| `supabase/schema.sql` | Database tables and row-level security rules |
| `sw.js`, `manifest.webmanifest`, `icons/` | Installable, offline-capable app |
| `ios/` | Optional native iOS wrapper (Xcode, generated with XcodeGen) |

## Note on content
All notes, questions and mock papers are original practice material written in the style of the Checkpoint exams.
They are not official Cambridge papers. Official past papers are copyright Cambridge University Press & Assessment, and schools get them from the Cambridge School Support Hub.

---
Created by **Satheesh K Parepalli**
