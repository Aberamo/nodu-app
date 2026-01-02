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
- [x] **Fase 0:** Setup Ambiente (VSC, Git, Repo GitHub).
- [x] **Fase 1:** Frontend Base - Dashboard con 3 card Glassmorphism.
- [x] **Fase 1.5:** UI Upgrade - Chat Fullscreen con View Switching (Nessuna chat flottante).
- [x] **Fase 2:** Migrazione a Flask - Struttura cartelle (`app.py`, `static`, `templates`) e script di avvio (`run.bat`).
- [x] **Fase 3:** AI Core - Integrazione Gemini API (Modello `gemini-2.5-flash/pro`).
- [x] **Fase 4:** Rendering Engine - Supporto Markdown (Marked.js) e LaTeX (MathJax).
- [x] **Fase 5:** Vision & Docs - Supporto Upload Immagini e PDF (Multi-modalità).
- [x] **Fase 6:** Brain Tuning - Implementazione prompt "Metodo ELI5" (Tutor empatico e passo-passo).
- [x] **Fase 7:** Fullstack Core - Database (SQLite), Auth (Login/Register), History Persistente.
- [ ] **Fase 8:** Deploy Finale (DigitalOcean/Render).

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