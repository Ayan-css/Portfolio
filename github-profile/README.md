![AyanOS boot sequence](assets/header.svg)

I build backends that have to be right about money. Most of what I know came out
of one project.

![System info](assets/about.svg)

---

## `PrintOK.app`

[![live](https://img.shields.io/badge/live-print--ok--customer--web.vercel.app-e8a33d?style=flat-square&labelColor=141416)](https://print-ok-customer-web.vercel.app)
[![source](https://img.shields.io/badge/source-Ayan--css%2FPrintOK-7d7d87?style=flat-square&labelColor=141416)](https://github.com/Ayan-css/PrintOK)
![status](https://img.shields.io/badge/status-pre--launch-5a5a66?style=flat-square&labelColor=141416)

**Hardware-free print-on-demand.** A customer walks into a print shop, scans a QR
code, uploads their file and pays from their own phone. A background agent on the
shop's existing Windows PC picks the job up and prints it. No new hardware, no
counter queue, no USB stick.

```
QR scan → upload (signed S3 URL) → quote (rate card frozen) → pay → queued → agent prints
```

![PrintOK architecture](assets/architecture.svg)

**Payment state and print state never touch.** A paid job and a printed job are
different facts. Collapse them into one status field and a webhook replay or a
printer jam charges someone twice. Two more decisions in the same spirit:

- **Prices are integer paise.** `₹12.40` is stored as `1240`. A per-page rate times
  a page count in floating point drifts, and a drifting total is an argument with
  a customer standing at the counter.
- **The rate card is frozen at quote time.** Shops change rates. Snapshot the card
  onto the job when it's quoted, and the price you were shown is the price you pay.

<details>
<summary><b>What exists, rather than what's claimed</b></summary>

<br>

```
43 automated tests    incl. a Postgres integration suite, against a real DB
REST API              Express · TypeScript · Prisma/PostgreSQL
                      job lifecycle, agent pairing, credential revocation,
                      admin console
C# .NET 8 agent       self-contained, ships to GitHub Releases via Actions
CI/CD                 GitHub Actions on push to main
deployment            Render (API) · Vercel (web) · Supabase (db/storage)
```

Pre-launch. Built, deployed and validated end to end — not yet running in a real
shop, so there are no customers to claim.

</details>

---

## `~/stack`

<sub>Grouped the way they are on my resume. No proficiency bars — a number would
only be a guess wearing a percentage sign.</sub>

**Languages**
![JavaScript](https://img.shields.io/badge/JavaScript-f2c14e?style=flat-square&logo=javascript&logoColor=141416)
![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?style=flat-square&logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/Python-f2c14e?style=flat-square&logo=python&logoColor=141416)
![SQL](https://img.shields.io/badge/SQL-4a90b8?style=flat-square&logo=postgresql&logoColor=white)
![HTML](https://img.shields.io/badge/HTML-7d7d87?style=flat-square&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-7d7d87?style=flat-square&logo=css3&logoColor=white)

**Frontend**
![React](https://img.shields.io/badge/React-61dafb?style=flat-square&logo=react&logoColor=141416)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-7d7d87?style=flat-square&logo=tailwindcss&logoColor=white)
![vanilla JS](https://img.shields.io/badge/responsive_%2F_vanilla_JS_UI-f2c14e?style=flat-square)

**Backend**
![Node.js](https://img.shields.io/badge/Node.js-5fa04e?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5fa04e?style=flat-square&logo=express&logoColor=white)
![REST](https://img.shields.io/badge/REST_API_design-7d7d87?style=flat-square)
![WebSockets](https://img.shields.io/badge/WebSockets-7d7d87?style=flat-square)

**Databases**
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4a90b8?style=flat-square&logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-5fa04e?style=flat-square&logo=supabase&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5a67d8?style=flat-square&logo=prisma&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-5fa04e?style=flat-square&logo=mongodb&logoColor=white)

**Cloud & DevOps**
![Docker](https://img.shields.io/badge/Docker-2496ed?style=flat-square&logo=docker&logoColor=white)
![AWS S3](https://img.shields.io/badge/AWS_S3-7d7d87?style=flat-square&logo=amazons3&logoColor=white)
![Render](https://img.shields.io/badge/Render-7d7d87?style=flat-square&logo=render&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-7d7d87?style=flat-square&logo=vercel&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions_%28CI%2FCD%29-7d7d87?style=flat-square&logo=githubactions&logoColor=white)

**Tools**
![Git](https://img.shields.io/badge/Git%2FGitHub-7d7d87?style=flat-square&logo=github&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay_integration-3395ff?style=flat-square&logo=razorpay&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-9b4f96?style=flat-square&logo=jest&logoColor=white)
![C#](https://img.shields.io/badge/C%23_.NET_8-9b4f96?style=flat-square&logo=dotnet&logoColor=white)

---

## `~/projects/Porejects`

![Four projects left mid-progress](assets/graveyard.svg)

Six standalone JavaScript/HTML/CSS apps built to practise DOM manipulation, state
handling and API integration — all in one repo. Four of them I started and
stopped, and they're still on the shelf on purpose: a portfolio that only shows
finished things is telling you half of what happened.

<details>
<summary><b>The full folder</b></summary>

<br>

```
Porejects/
├── expense-tracker        †  left mid-progress
├── ecommerce-cart         †  left mid-progress
├── todo-app
├── weather-app
├── quiz-app               †  left mid-progress
└── project-management     †  left mid-progress
```

None of these is PrintOK-scale, and pretending otherwise would flatten the one
project that is.

**[github.com/Ayan-css/Porejects](https://github.com/Ayan-css/Porejects)**

</details>

---

## `timeline.log`

```
[edu]   Apr 2025 — present   BSc Information Technology
                             Anjuman-I-Islam Kalsekar Technical Campus, New Panvel
                             3rd semester · SGPA 9.5 / 9.65

[lead]                       President — Rise Club

[teach]                      Co-Instructor & Host — Git & GitHub Hands-On Workshop
                             led a live session on version control fundamentals

[lead]                       Media Team — Igniters Club, AIKTC (via Unstop)

[cert]                       Google Developer Student Jam — Google Developer Groups
```

---

## `~/contact`

```
$ curl github.com/Ayan-css
$ curl linkedin.com/in/ayan-ansari-053849313
$ mail ayan48311@gmail.com
```

[![GitHub](https://img.shields.io/badge/GitHub-Ayan--css-141416?style=flat-square&logo=github&logoColor=e8a33d)](https://github.com/Ayan-css)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-ayan--ansari-141416?style=flat-square&logo=linkedin&logoColor=e8a33d)](https://www.linkedin.com/in/ayan-ansari-053849313/)
[![Email](https://img.shields.io/badge/Email-ayan48311%40gmail.com-141416?style=flat-square&logo=gmail&logoColor=e8a33d)](mailto:ayan48311@gmail.com)

<!--
  Once AyanOS is deployed, add the portfolio link here:
  [![portfolio](https://img.shields.io/badge/portfolio-AyanOS-e8a33d?style=flat-square&labelColor=141416)](https://YOUR-URL-HERE)
  Left commented out on purpose — a dead link on a profile is worse than no link.
-->

```
$ uptime
up since Apr 2025 · 1 flagship, 6 practice apps, 0 fake metrics
load average: caffeinated
```
