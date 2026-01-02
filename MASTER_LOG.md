# 🎓 NODU.ME - Master Project Log

## ℹ️ Visione del Progetto
Piattaforma web educativa (AI Tutor) per studenti delle superiori italiane.
**Obiettivo:** Simulare un professore privato 24/7.
**Nome:** NODU.ME
**Struttura:** 3 Interfacce (Tutor Generale, Area Scientifica, Area Umanistica).

## 🛠 Tech Stack (Aggiornato)
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla).
- **Backend:** Python (Flask).
- **Struttura:** Standard Flask (`/templates` per HTML, `/static` per CSS/JS).
- **AI Engine:** In attesa di integrazione (DeepSeek/OpenAI).
- **Hosting/Tools:** GitHub Student Developer Pack, VSC.

---

## 📅 Roadmap Aggiornata
[x] Fase 0: Setup Ambiente (VSC, Git, Repo GitHub).
[x] Fase 1: Frontend Base - Dashboard con 3 card Glassmorphism.
[x] Fase 1.5: UI Upgrade - Chat Fullscreen con View Switching.
[x] Fase 2: Migrazione a Flask - Struttura cartelle standard.
[x] Fase 3: AI Core - Integrazione Gemini API.
[x] Fase 4: Rendering Engine - Markdown e LaTeX (MathJax).
[x] Fase 5: Vision & Docs - Upload Immagini e PDF.
[x] Fase 6: Brain Tuning - Prompt "Metodo ELI5".
[x] Fase 7: Fullstack Core - Database, Auth, History.
[x] Fase 8: Deploy Finale (Render.com + Custom Domain). 🚀
[x] Milestone: Il sito è accessibile pubblicamente e sicuro.

## 📝 Changelog & Stato Attuale

**[DATA ODIE] - Migrazione Flask & UI Chat Completata**
- **Refactoring Totale:** Progetto migrato su backend Flask.
- **Struttura File:** Creata struttura `app.py`, `models.py`, cartelle `templates/` e `static/`.
- **UI UX:** Implementato "View Switching". Cliccando una card, la dashboard scompare e appare la Chat Fullscreen.
- **Features:** Header chat dinamico (cambia nome/colore in base al tutor), bottone "Indietro" funzionante.
- **Scripts:** Aggiunti `run.bat` e `run.sh` per avvio rapido.
- **Prossimo Step:** Collegare la chiamata AJAX/Fetch dal `script.js` alla route `/api/chat` di Flask e integrare la API Key.


**[01/01/2026 ore 19:45] - INTEGRAZIONE AI COMPLETATA (Milestone MVP)**
- **Backend:** Collegamento API Gemini funzionante (`gemini-1.5-flash`).
- **Frontend:** Script JS aggiornato per chiamate asincrone (`fetch`).
- **Logic:** Implementato mapping dinamico delle 3 personalità (Generale/Scientifico/Umanistico).
- **UX:** Aggiunto indicatore "sta scrivendo..." e rimozione automatica alla risposta.
- **Stato:** Il sistema ora risponde in modo intelligente e contestuale.
- **Prossimo Step:** Rendering del testo (Markdown e LaTeX per le formule).


**[01/01/2026 ore 20:04] - RENDERING ENGINE COMPLETATO**
- **UI Upgrade:** I messaggi ora supportano formattazione ricca.
- **Tech:** Integrato `Marked.js` per il testo (liste, grassetto, codice) e `MathJax 3` per le formule matematiche ($x^2$).
- **Config:** Configurazione MathJax specifica per accettare il singolo dollaro `$` come delimitatore inline.
- **CSS:** Aggiunti stili per tabelle, blocchi di codice e citazioni dentro la chat.
- **Stato:** L'AI risponde, il frontend visualizza perfettamente formule complesse e tabelle.


**[01/01/2026 ore 23:27] - VISION & PDF SUPPORT (Milestone "Occhi")**
- **Feature:** Upload di Immagini (JPG, PNG) e Documenti (PDF).
- **Backend:** Logica ibrida in `app.py`. Usa `PIL` per validare le immagini, ma invia i PDF come raw bytes (`application/pdf`) direttamente a Gemini.
- **Frontend:** Preview distinta per Immagini (thumbnail) e PDF (icona arancione).
- **Limiti:** 10MB immagini, 20MB PDF.
- **Stato:** Il Tutor ora può "leggere" libri e "vedere" esercizi.


**[01/01/2026 ore 23:36] - BRAIN TUNING & PREPARAZIONE DB**
- **AI Logic:** Aggiornati i System Prompts. Ora i Tutor usano il metodo ELI5 (Explain Like I'm Five), metafore visive e rifiutano di dare soluzioni immediate.
- **Issue:** Raggiunto limite API (Quota 429) durante i test PDF.
- **Pivot:** Si procede con lo sviluppo del backend locale (Database) in attesa del reset quota.
- **Prossimo Step:** Attivazione SQLite e sistema di Login/Registrazione con Flask.

**[01/01/2026 ore 23:48] - DATABASE & AUTHENTICATION COMPLETATI**
- **Architecture:** Trasformazione in App Fullstack.
- **Database:** Integrato `Flask-SQLAlchemy` con SQLite (`nodu.db`). Creati modelli `User` e `Chat`.
- **Security:** Implementato `Flask-Login` per gestione sessioni e `Werkzeug` per hashing password.
- **UX Flow:** Aggiunte pagine Login e Register. La Dashboard è ora protetta (`@login_required`).
- **Feature:** Cronologia Chat persistente. Ricaricando la pagina, i messaggi precedenti vengono caricati dal DB.
- **Stato:** Pronto per il Deploy. Tutte le funzionalità core (Chat, Vision, PDF, Auth) sono implementate.

## 📝 Changelog & Stato Attuale

**[DATA ODIE] - UI REFINEMENT & NAVIGATION**
- **Sidebar:** Navigazione funzionante (Home, Profilo, Storico, Settings). Implementato View Switching in JS.
- **Views:** Create viste nascoste per Profilo e Storico che appaiono al click.
- **Bug:** Risolto conflitto `IntegrityError` su email vuote (Reset DB richiesto).
- **Issue:** API Quota (429) limita i test estensivi, ma il frontend è pronto.
- **Goal:** Implementare "Guest Mode" per permettere l'uso senza registrazione obbligatoria.

## 📝 Changelog & Stato Attuale

**[02/01/2026 ore 16:30] - PRE-DEPLOY POLISH**
- **Refactoring UI:** Trasformazione in sito Multi-pagina (Prezzi, Come Funziona).
- **Branding:** Logo SVG integrato (90px) e Mascotte SVG animate ovunque.
- **Fix in corso:**
    - Riduzione altezza Header (troppo ingombrante).
    - Rimozione Footer dalla Dashboard (pulizia layout).
    - Ottimizzazione Mobile (Logo e margini).
    - Hardening Registrazione (Email obbligatoria, Conferma Password).
- **Next Step:** Integrazione Google OAuth e Deploy su Render.

## 📝 Changelog & Stato Attuale

**[02/01/2026 ore 17:00] - PRE-DEPLOY FINAL POLISH**
- **Decision:** Google Login posticipato alla v1.1.
- **Header:** Ottimizzazione aggressiva dell'altezza (Logo ridimensionato temporaneamente).
- **Mobile UX:**
    - Landing: Font e margini adattati per schermi piccoli.
    - Dashboard: Implementazione "Hamburger Menu" (Sidebar a scomparsa su mobile).
- **Registration:** Aggiunti campi Email (required) e Conferma Password.
- **Stato:** Codice pronto per il Deploy su Render.

[02/01/2026 ore 17:00] - PRE-DEPLOY FINAL POLISH

Header: Ottimizzazione aggressiva dell'altezza (Logo ridimensionato).

Mobile UX: Implementazione "Hamburger Menu" (Sidebar a scomparsa).

Registration: Hardening (Email obbligatoria, check password).

[02/01/2026 ore 18:30] - FEEDBACK LOOP & LINUX PREP

Feature Feedback: Creata pagina feedback.html collegata a Formspree per ricevere email senza backend SMTP.

Header: Aggiunto link "Feedback" nella Navbar pubblica.

System Prep:

Creato Procfile per Gunicorn.

Pulizia requirements.txt: Rimosse librerie Windows-only (pywin32, pyinstaller) per compatibilità server Linux.

Update app.py: Switch automatico Database (SQLite se locale, PostgreSQL se su Render).

[02/01/2026 ore 19:50] - DEPLOY SU RENDER (SUCCESS)

Infrastructure:

Creato Database PostgreSQL (Frankfurt).

Creato Web Service Python 3 collegato a GitHub (Aberamo/nodu-app).

Environment: Configurate variabili DATABASE_URL, GEMINI_API_KEY, SECRET_KEY.

Database Init: Aggirato blocco Shell Free Tier tramite route temporanea /setup-database-segreto per creare le tabelle, poi rimossa per sicurezza.

Status: Deploy completato con successo. App funzionante in cloud.

[02/01/2026 ore 20:00] - DOMAIN & SSL (LIVE)

Domain: Acquistato/Riscatto nodu-app.me su Namecheap.

DNS: Configuarati record A e CNAME per puntare a Render.

Verification: Render ha verificato la proprietà del dominio.

Security: Certificato SSL (HTTPS) in fase di generazione automatica (Let's Encrypt).

Stato Finale: V 1.0 ONLINE 🟢