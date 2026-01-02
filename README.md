# NODU.ME - Educational AI Platform

Piattaforma Web Educational AI con Dashboard interattiva, sistema di Tutor AI specializzati e backend Flask.

## 📁 Struttura del Progetto

```
NODU.ME/
│
├── app.py                  # Flask backend (cervello Python)
├── requirements.txt        # Dipendenze Python
├── .env.example            # Template variabili ambiente
├── .gitignore              # File da ignorare in Git
│
├── templates/              # Template HTML (Flask)
│   └── index.html          # Dashboard principale
│
└── static/                 # File statici (CSS, JS, Assets)
    ├── css/
    │   └── style.css       # Stili Glassmorphism + Dark Mode
    ├── js/
    │   └── script.js       # Logica frontend interattiva
    └── assets/             # Icone e immagini
```

## 🚀 Come Avviare il Progetto

### 1. Setup Iniziale

```bash
# Naviga nella cartella del progetto
cd NODU.ME

# Crea un ambiente virtuale Python
python -m venv venv

# Attiva l'ambiente virtuale
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Installa le dipendenze
pip install -r requirements.txt
```

### 2. Configurazione Ambiente

```bash
# Copia il file di esempio
copy .env.example .env

# Modifica .env con i tuoi valori (editor di testo)
```

### 3. Avvia il Server Flask

```bash
# Metodo 1: Direttamente con Python
python app.py

# Metodo 2: Con Flask CLI
flask run
```

Poi apri: `http://localhost:5000`

## ✨ Caratteristiche

### Design
- **Glassmorphism**: Effetti vetro sfocati moderni
- **Dark Mode**: Palette scura con accenti neon
- **Responsive**: Ottimizzato per desktop e mobile
- **Animazioni Fluide**: Transizioni e micro-interazioni

### Funzionalità
- **3 Tutor AI Specializzati**:
  - 🟢 Tutor Generale - Organizzazione e supporto
  - 🔵 Area Scientifica - Matematica, fisica, logica
  - 🟠 Area Umanistica - Letteratura, storia, filosofia

- **Chat Interattiva**:
  - Interfaccia simile a ChatGPT
  - Risposte simulate in base al tutor selezionato
  - Auto-resize della textarea
  - Invio con Enter (Shift+Enter per nuova riga)

- **Sidebar Navigazione**:
  - Home, Profilo, Storico, Settings
  - Icone SVG personalizzate
  - Stati attivi e hover

## 🎨 Palette Colori

```css
Background:  #0a0a0f (Nero scuro)
Neon Green:  #00ff88 (Tutor Generale)
Neon Blue:   #00d4ff (Area Scientifica)
Neon Orange: #ff6b35 (Area Umanistica)
Text:        #ffffff (Bianco)
Secondary:   #b0b0c8 (Grigio chiaro)
```

## 🛠️ Tecnologie Utilizzate

- **HTML5**: Struttura semantica
- **CSS3**: Glassmorphism, Grid, Flexbox, Animations
- **Vanilla JavaScript**: Nessuna dipendenza esterna
- **Google Fonts**: Inter font family

## 🔌 API Endpoints

### Frontend Routes
- `GET /` - Dashboard principale

### Backend API (TODO)
- `POST /api/chat` - Invio messaggi al tutor AI
- `POST /api/save-chat` - Salvataggio cronologia chat
- `GET /api/load-chat/<chat_id>` - Caricamento chat salvate

## 📝 Prossimi Sviluppi

### Backend
- [ ] Integrazione API AI reale (OpenAI/Anthropic)
- [ ] Database per salvataggio conversazioni (SQLAlchemy)
- [ ] Sistema di autenticazione utenti (Flask-Login)
- [ ] Rate limiting e security headers
- [ ] Logging e monitoring

### Frontend
- [ ] Integrazione chiamate API backend
- [ ] Esportazione PDF delle chat
- [ ] Sistema di preferiti e note
- [ ] Dark/Light mode toggle
- [ ] Supporto multilingua

### DevOps
- [ ] Containerizzazione (Docker)
- [ ] Deploy su cloud (Heroku/AWS/Railway)
- [ ] CI/CD pipeline
- [ ] Testing automatizzato

## 🛠️ Stack Tecnologico

**Backend:**
- Python 3.x
- Flask (Web Framework)
- Flask-CORS (Cross-Origin Resource Sharing)

**Frontend:**
- HTML5 (Template Jinja2)
- CSS3 (Glassmorphism + Dark Mode)
- Vanilla JavaScript (ES6+)
- Google Fonts (Inter)

**AI/ML (Future):**
- OpenAI API / Anthropic Claude API

## 📦 Deployment

```bash
# Production setup
pip install gunicorn

# Run with Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## 🤝 Contributi

Progetto creato per NODU.ME Educational Platform.

---

**Versione**: 2.0.0 (Flask Backend)
**Data**: Gennaio 2026
**Stack**: Flask + HTML/CSS/JS
**Architetto**: Claude AI
