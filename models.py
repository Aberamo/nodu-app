"""
NODU.ME Database Models
- User: Gestione utenti con autenticazione
- Chat: Cronologia conversazioni per ogni utente
"""

from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import json

db = SQLAlchemy()

class User(UserMixin, db.Model):
    """
    Modello Utente per autenticazione
    """
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)
    password_hash = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relazione con le chat (un utente ha molte chat)
    chats = db.relationship('Chat', backref='user', lazy=True, cascade='all, delete-orphan')

    def set_password(self, password):
        """Hash della password prima di salvarla"""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Verifica la password"""
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.username}>'


class Chat(db.Model):
    """
    Modello Chat per salvare cronologia conversazioni
    """
    __tablename__ = 'chats'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    tutor_type = db.Column(db.String(50), nullable=False)  # 'tutor-general', 'tutor-scientific', 'tutor-humanistic'
    messages_json = db.Column(db.Text, nullable=False)  # JSON array di messaggi
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def set_messages(self, messages_list):
        """
        Salva lista di messaggi come JSON
        messages_list format: [{"role": "user", "content": "..."}, {"role": "bot", "content": "..."}]
        """
        self.messages_json = json.dumps(messages_list, ensure_ascii=False)

    def get_messages(self):
        """
        Recupera lista di messaggi da JSON
        """
        if self.messages_json:
            return json.loads(self.messages_json)
        return []

    def add_message(self, role, content):
        """
        Aggiunge un singolo messaggio alla conversazione
        role: 'user' o 'bot'
        """
        messages = self.get_messages()
        messages.append({
            'role': role,
            'content': content,
            'timestamp': datetime.utcnow().isoformat()
        })
        self.set_messages(messages)
        self.last_updated = datetime.utcnow()

    def __repr__(self):
        return f'<Chat {self.id} - User {self.user_id} - {self.tutor_type}>'
