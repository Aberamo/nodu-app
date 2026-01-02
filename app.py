import os
import io
import base64
from flask import Flask, render_template, request, jsonify, redirect, url_for, flash
from flask_cors import CORS
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
import google.generativeai as genai
from dotenv import load_dotenv
from PIL import Image
from models import db, User, Chat

# 1. Carica le configurazioni (API Key)
load_dotenv()

# 2. Configura Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Usiamo il modello più recente apparso nella tua lista
model = genai.GenerativeModel('gemini-2.5-flash')

# 3. Inizializza Flask e estensioni
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')

# Database Configuration for Render deployment
# Se siamo su Render, usa PostgreSQL; altrimenti usa SQLite locale
database_url = os.environ.get('DATABASE_URL')
if database_url and database_url.startswith("postgres://"):
    # Render usa postgres:// ma SQLAlchemy richiede postgresql://
    database_url = database_url.replace("postgres://", "postgresql://", 1)
app.config['SQLALCHEMY_DATABASE_URI'] = database_url or 'sqlite:///nodu.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app)
db.init_app(app)

# 4. Configura Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
login_manager.login_message = 'Devi effettuare il login per accedere a questa pagina.'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# --- NUOVI PROMPT "METODO ELEMENTARE" ---
SYSTEM_PROMPTS = {
    'tutor-general': """
        Sei il Tutor Generale di NODU.ME.
        IL TUO OBIETTIVO: Sei come un fratello maggiore o un coach paziente.

        REGOLE FONDAMENTALI:
        1. NON usare mai "paroloni" accademici. Parla semplice, come in una chat tra amici.
        2. Se lo studente è in ansia, sdrammatizza. Usa emoji occasionalmente (ma non troppe).
        3. Se ti chiedono un piano di studio, fallo SUPER concreto (es. "Oggi fai solo pag 10 e 11, poi pausa").
        4. NON spiegare le materie qui. Se chiedono aiuto su un esercizio, dì: "Per questo c'è il Prof di Scientifico, andiamo da lui? Clicca sulla carta blu!".
    """,

    'tutor-scientific': """
        Sei il Tutor Scientifico.
        IL TUO OBIETTIVO: Insegnare il ragionamento, NON dare la soluzione. Spiegare come se lo studente avesse difficoltà enormi.

        REGOLE DI COMPORTAMENTO:
        1. **METODO PASSO-PASSO:** Non spiegare tutto insieme. Spiega SOLO il primo passaggio. Poi chiedi: "Fino a qui ci sei? Ti è chiaro perché abbiamo fatto questo?".
        2. **LINGUAGGIO ELEMENTARE:** Non dire "Applichiamo la proprietà distributiva". Dì: "Dobbiamo moltiplicare questo numero per tutti quelli nella parentesi".
        3. **ZERO SOLUZIONI COMPLETE:** Se mandi un'immagine di un esercizio, NON risolverlo tutto. Risolvi la prima riga e chiedi allo studente di provare la seconda.
        4. **MATEMATICA VISIVA:** Quando puoi, descrivi le cose in modo visivo o con esempi della vita reale (es. "Immagina la funzione come una montagna russa...").
        5. Usa LaTeX per le formule ma spiega cosa significano i simboli a parole.
    """,

    'tutor-humanistic': """
        Sei il Tutor Umanistico.
        IL TUO OBIETTIVO: Raccontare storie, non lezioni.

        REGOLE DI COMPORTAMENTO:
        1. **STORYTELLING:** La storia e la filosofia sono pettegolezzi di persone morte. Raccontale così. Usa metafore moderne (es. "Napoleone era l'influencer più famoso d'Europa").
        2. **CONNESSIONI:** Se parli di un autore, collegalo a qualcosa che lo studente conosce (serie TV, sentimenti attuali, canzoni).
        3. **SCHEMI:** Alla fine della spiegazione, fai SEMPRE un micro-schema riassuntivo con parole chiave in grassetto.
        4. **NO MURI DI TESTO:** Dividi la risposta in paragrafi brevi.
    """
}

# ========================================
# AUTHENTICATION ROUTES
# ========================================

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('home'))

    if request.method == 'POST':
        data = request.form
        username = data.get('username')
        password = data.get('password')

        user = User.query.filter_by(username=username).first()

        if user and user.check_password(password):
            login_user(user, remember=True)
            return redirect(url_for('home'))
        else:
            flash('Username o password errati.', 'error')

    return render_template('login.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('home'))

    if request.method == 'POST':
        data = request.form
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        confirm_password = data.get('confirm_password')

        # Validazione email
        if not email or email.strip() == '':
            flash('L\'email è obbligatoria.', 'error')
            return render_template('register.html')

        # Verifica password match
        if password != confirm_password:
            flash('Le password non coincidono.', 'error')
            return render_template('register.html')

        # Verifica se username esiste già
        if User.query.filter_by(username=username).first():
            flash('Username già esistente.', 'error')
            return render_template('register.html')

        # Crea nuovo utente
        new_user = User(username=username, email=email)
        new_user.set_password(password)

        db.session.add(new_user)
        db.session.commit()

        flash('Registrazione completata! Effettua il login.', 'success')
        return redirect(url_for('login'))

    return render_template('register.html')


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))


# ========================================
# PUBLIC ROUTES
# ========================================

@app.route('/')
def home():
    """Landing page pubblica"""
    return render_template('landing.html', is_authenticated=current_user.is_authenticated)


@app.route('/pricing')
def pricing():
    """Pagina Prezzi"""
    return render_template('pricing.html', is_authenticated=current_user.is_authenticated)


@app.route('/how-it-works')
def how_it_works():
    """Pagina Come Funziona"""
    return render_template('how_it_works.html', is_authenticated=current_user.is_authenticated)


@app.route('/feedback')
def feedback():
    """Pagina Feedback"""
    return render_template('feedback.html', is_authenticated=current_user.is_authenticated)


@app.route('/dashboard')
def dashboard():
    """Dashboard accessibile sia per guest che per utenti loggati"""
    if current_user.is_authenticated:
        # Utente loggato
        return render_template('index.html', username=current_user.username, is_logged_in=True)
    else:
        # Utente guest
        return render_template('index.html', username='Guest', is_logged_in=False)

# ========================================
# API ROUTES (Protected)
# ========================================

@app.route('/api/chat', methods=['POST'])
def chat():
    """
    API Chat accessibile sia per guest che per utenti loggati
    - Guest: Risponde senza salvare nel DB
    - Logged: Risponde E salva nel DB
    """
    data = request.json
    user_message = data.get('message')
    tutor_type = data.get('tutorType', 'tutor-general')
    image_data = data.get('image_data')
    mime_type = data.get('mime_type')

    if not user_message:
        return jsonify({'error': 'Messaggio vuoto'}), 400

    # Recupera il prompt di sistema corretto
    system_instruction = SYSTEM_PROMPTS.get(tutor_type, SYSTEM_PROMPTS['tutor-general'])

    try:
        # Variabili per gestire guest vs logged
        active_chat = None
        context = ""

        # SE UTENTE LOGGATO: Carica cronologia dal DB
        if current_user.is_authenticated:
            # Recupera o crea la chat attiva per questo tutor
            active_chat = Chat.query.filter_by(
                user_id=current_user.id,
                tutor_type=tutor_type
            ).order_by(Chat.last_updated.desc()).first()

            if not active_chat:
                # Crea nuova chat
                active_chat = Chat(
                    user_id=current_user.id,
                    tutor_type=tutor_type
                )
                active_chat.set_messages([])
                db.session.add(active_chat)
                db.session.commit()

            # Recupera gli ultimi 5 messaggi per il contesto
            recent_messages = active_chat.get_messages()[-10:]
            context = "\n".join([f"{msg['role'].capitalize()}: {msg['content']}" for msg in recent_messages[-5:]])

        # Prepariamo il messaggio completo per Gemini
        full_prompt = f"{system_instruction}\n\nContesto della chat precedente:\n{context}\n\nStudente: {user_message}\nTutor:"

        # Check if there's a file (image or PDF) to process
        if image_data and mime_type:
            # Decode base64 data (remove data:image/... or data:application/pdf... prefix if present)
            if ',' in image_data:
                image_data = image_data.split(',')[1]

            # Decode base64 to bytes
            file_bytes = base64.b64decode(image_data)

            # For images, optionally validate with PIL
            # For PDFs, pass bytes directly
            if mime_type.startswith('image/'):
                # Validate image with PIL (optional but recommended)
                try:
                    image = Image.open(io.BytesIO(file_bytes))
                    # Convert back to bytes for Gemini (PIL validation passed)
                    img_byte_arr = io.BytesIO()
                    image.save(img_byte_arr, format=image.format or 'PNG')
                    file_bytes = img_byte_arr.getvalue()
                except Exception as e:
                    print(f"Errore validazione immagine: {e}")
                    return jsonify({'reply': "Immagine non valida o corrotta.", 'error': str(e)}), 400

            # Create Gemini-compatible part dictionary
            file_part = {
                "mime_type": mime_type,
                "data": file_bytes
            }

            # Send file + prompt to Gemini Vision/PDF API
            response = model.generate_content([full_prompt, file_part])
        else:
            # Text-only request
            response = model.generate_content(full_prompt)

        bot_reply = response.text

        # Salva messaggi nel database SOLO se utente loggato
        if current_user.is_authenticated and active_chat:
            active_chat.add_message('user', user_message)
            active_chat.add_message('bot', bot_reply)
            db.session.commit()

        return jsonify({
            'reply': bot_reply,
            'status': 'success',
            'is_guest': not current_user.is_authenticated  # Info per frontend
        })

    except Exception as e:
        print(f"Errore API Gemini: {e}")
        if current_user.is_authenticated:
            db.session.rollback()
        return jsonify({'reply': "Mi dispiace, ho perso il filo del discorso (Errore server). Riprova.", 'error': str(e)}), 500


@app.route('/api/history', methods=['GET'])
@login_required
def get_history():
    """
    Restituisce la cronologia chat dell'utente corrente
    """
    tutor_type = request.args.get('tutorType')

    if tutor_type:
        # Cronologia per uno specifico tutor
        chat = Chat.query.filter_by(
            user_id=current_user.id,
            tutor_type=tutor_type
        ).order_by(Chat.last_updated.desc()).first()

        if chat:
            return jsonify({
                'messages': chat.get_messages(),
                'status': 'success'
            })
        else:
            return jsonify({
                'messages': [],
                'status': 'success'
            })
    else:
        # Tutte le chat dell'utente
        chats = Chat.query.filter_by(user_id=current_user.id).all()
        history = {}

        for chat in chats:
            history[chat.tutor_type] = {
                'messages': chat.get_messages(),
                'last_updated': chat.last_updated.isoformat()
            }

        return jsonify({
            'history': history,
            'status': 'success'
        })

# --- CODICE TEMPORANEO PER CREARE IL DATABASE SU RENDER ---
@app.route('/setup-database-segreto')
def setup_database():
    with app.app_context():
        db.create_all()
    return "Fatto! Tabelle create nel Database. Ora puoi cancellare questa route."
# ---------------------------------------------------------

# ========================================
# DATABASE INITIALIZATION
# ========================================

def init_db():
    """Inizializza il database creando tutte le tabelle"""
    with app.app_context():
        db.create_all()
        print("✅ Database inizializzato con successo!")


if __name__ == '__main__':
    # Inizializza il database se non esiste
    init_db()

    print("🚀 Avvio NODU.ME...")
    print("📊 Dashboard: http://localhost:5000")
    print("🔐 Login: http://localhost:5000/login")

    app.run(debug=True, port=5000)