/**
 * NODU.ME Dashboard - Interactive JavaScript
 * Handles tutor selection, chat functionality, and view switching
 */

// ========================================
// STATE MANAGEMENT
// ========================================
const AppState = {
    currentTutor: null,
    currentView: 'dashboard', // 'dashboard' or 'chat'
    chatHistory: [],
    userName: 'Studente',
    currentImage: null, // Stores { data: base64, mimeType: string }
};

// ========================================
// DOM ELEMENTS
// ========================================
const elements = {
    // Views
    dashboardView: document.getElementById('dashboardView'),
    chatView: document.getElementById('chatView'),
    profileView: document.getElementById('profileView'),
    historyView: document.getElementById('historyView'),
    settingsView: document.getElementById('settingsView'),

    // Navigation
    navHome: document.getElementById('nav-home'),
    navProfile: document.getElementById('nav-profile'),
    navHistory: document.getElementById('nav-history'),
    navSettings: document.getElementById('nav-settings'),

    // Tutor Cards
    tutorCards: document.querySelectorAll('.tutor-card'),

    // Chat View Elements
    chatMessages: document.getElementById('chatMessages'),
    chatInput: document.getElementById('chatInput'),
    sendBtn: document.getElementById('sendBtn'),
    backBtn: document.getElementById('backBtn'),
    chatViewTutorName: document.getElementById('chatViewTutorName'),
    chatViewAvatar: document.getElementById('chatViewAvatar'),

    // File Upload Elements
    attachBtn: document.getElementById('attachBtn'),
    imageInput: document.getElementById('imageInput'),
    imagePreviewContainer: document.getElementById('imagePreviewContainer'),
    imagePreview: document.getElementById('imagePreview'),
    pdfPreview: document.getElementById('pdfPreview'),
    pdfFileName: document.getElementById('pdfFileName'),
    removeImageBtn: document.getElementById('removeImageBtn'),

    // History
    historyList: document.getElementById('historyList')
};

// ========================================
// TUTOR CONFIGURATION
// ========================================
const tutorConfig = {
    generale: {
        name: 'Tutor Generale',
        greeting: 'Ciao! Sono il tuo Tutor Generale. Posso aiutarti con l\'organizzazione dello studio, tecniche di apprendimento e motivazione. Come posso supportarti oggi?',
        gradient: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
        icon: 'TG',
        mascot: '/static/assets/images/mascotte_verde.svg'
    },
    scientifica: {
        name: 'Tutor Scientifico',
        greeting: 'Salve! Sono il tuo Tutor per le materie scientifiche. Matematica, fisica, chimica... quale argomento vuoi esplorare?',
        gradient: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
        icon: 'TS',
        mascot: '/static/assets/images/mascotte_blu.svg'
    },
    umanistica: {
        name: 'Tutor Umanistico',
        greeting: 'Benvenuto! Sono il tuo Tutor per le discipline umanistiche. Letteratura, storia, filosofia... di cosa vuoi parlare?',
        gradient: 'linear-gradient(135deg, #ff6b35 0%, #ff4500 100%)',
        icon: 'TU',
        mascot: '/static/assets/images/mascotte_arancione.svg'
    }
};

// ========================================
// INITIALIZATION
// ========================================
function init() {
    setupEventListeners();
    setupChatInput();
    setupMobileMenu();

    // Check if user is logged in (global variable from template)
    if (typeof IS_USER_LOGGED_IN !== 'undefined' && !IS_USER_LOGGED_IN) {
        // Guest mode - setup guest UI
        setupGuestUI();
    } else {
        // Logged user - load chat history
        loadChatHistory();
    }
}

function setupGuestUI() {
    /**
     * Configura l'interfaccia per gli utenti guest (non loggati)
     * - Nascondi Profilo, Storico, Impostazioni
     * - Cambia Logout in "Accedi / Registrati"
     */
    console.log('Modalità Guest attivata');

    // Nascondi funzionalità riservate agli utenti loggati
    if (elements.navProfile) {
        elements.navProfile.style.display = 'none';
    }
    if (elements.navHistory) {
        elements.navHistory.style.display = 'none';
    }
    if (elements.navSettings) {
        elements.navSettings.style.display = 'none';
    }

    // Modifica il pulsante Logout in Login/Registrati
    const logoutBtn = document.querySelector('.logout-item');
    if (logoutBtn) {
        // Cambia link e testo
        logoutBtn.href = '/login';
        const logoutText = logoutBtn.querySelector('span');
        if (logoutText) {
            logoutText.textContent = 'Accedi';
        }

        // Cambia icona (opzionale - login icon)
        const logoutIcon = logoutBtn.querySelector('svg');
        if (logoutIcon) {
            logoutIcon.innerHTML = `
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
            `;
        }
    }

    // Mostra un messaggio di benvenuto per guest (opzionale)
    console.log('Guest mode: Profilo, Storico, Impostazioni nascosti. Logout → Accedi');
}

async function loadChatHistory() {
    /**
     * Carica la cronologia chat dal database quando si apre un tutor
     */
    try {
        const response = await fetch('/api/history');
        const data = await response.json();

        if (data.status === 'success' && data.history) {
            // Salva cronologia nello stato globale
            AppState.chatHistory = data.history;
            console.log('Cronologia caricata:', data.history);
        }
    } catch (error) {
        console.error('Errore caricamento cronologia:', error);
    }
}

// ========================================
// EVENT LISTENERS
// ========================================
function setupEventListeners() {
    // Tutor card click handlers
    elements.tutorCards.forEach(card => {
        card.addEventListener('click', () => handleTutorSelection(card));

        // Add hover effect animation
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Chat controls
    elements.sendBtn.addEventListener('click', handleSendMessage);
    elements.backBtn.addEventListener('click', handleBackToDashboard);

    // Image upload controls
    elements.attachBtn.addEventListener('click', () => elements.imageInput.click());
    elements.imageInput.addEventListener('change', handleImageSelect);
    elements.removeImageBtn.addEventListener('click', handleImageRemove);

    // Sidebar navigation
    elements.navHome.addEventListener('click', (e) => {
        e.preventDefault();
        navigateToView('dashboard');
    });

    elements.navProfile.addEventListener('click', (e) => {
        e.preventDefault();
        navigateToView('profile');
    });

    elements.navHistory.addEventListener('click', (e) => {
        e.preventDefault();
        navigateToView('history');
        loadHistoryView();  // Carica lista chat
    });

    elements.navSettings.addEventListener('click', (e) => {
        e.preventDefault();
        navigateToView('settings');
    });
}

function setupChatInput() {
    // Auto-resize textarea
    elements.chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });

    // Send message on Enter (Shift+Enter for new line)
    elements.chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });
}

// ========================================
// VIEW SWITCHING
// ========================================
function switchView(viewName) {
    if (viewName === 'chat') {
        // Hide dashboard, show chat
        elements.dashboardView.style.display = 'none';
        elements.chatView.style.display = 'flex';
        AppState.currentView = 'chat';

        // Focus on input
        setTimeout(() => {
            elements.chatInput.focus();
        }, 100);
    } else {
        // Hide chat, show dashboard
        elements.chatView.style.display = 'none';
        elements.dashboardView.style.display = 'block';
        AppState.currentView = 'dashboard';
    }
}

function navigateToView(viewName) {
    /**
     * Gestisce navigazione tra tutte le view (dashboard, profile, history, settings, chat)
     */
    // Nascondi tutte le view
    elements.dashboardView.style.display = 'none';
    elements.chatView.style.display = 'none';
    elements.profileView.style.display = 'none';
    elements.historyView.style.display = 'none';
    elements.settingsView.style.display = 'none';

    // Aggiorna classe active nella sidebar
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

    // Mostra view richiesta
    switch(viewName) {
        case 'dashboard':
            elements.dashboardView.style.display = 'block';
            elements.navHome.classList.add('active');
            AppState.currentView = 'dashboard';
            break;
        case 'profile':
            elements.profileView.style.display = 'block';
            elements.navProfile.classList.add('active');
            AppState.currentView = 'profile';
            break;
        case 'history':
            elements.historyView.style.display = 'block';
            elements.navHistory.classList.add('active');
            AppState.currentView = 'history';
            break;
        case 'settings':
            elements.settingsView.style.display = 'block';
            elements.navSettings.classList.add('active');
            AppState.currentView = 'settings';
            break;
        case 'chat':
            elements.chatView.style.display = 'flex';
            AppState.currentView = 'chat';
            setTimeout(() => elements.chatInput.focus(), 100);
            break;
    }
}

function loadHistoryView() {
    /**
     * Popola la vista History con le chat dell'utente
     */
    if (!AppState.chatHistory || Object.keys(AppState.chatHistory).length === 0) {
        elements.historyList.innerHTML = '<p style="color: rgba(255,255,255,0.5);">Nessuna cronologia disponibile.</p>';
        return;
    }

    let historyHTML = '';

    for (const [tutorType, chatData] of Object.entries(AppState.chatHistory)) {
        const messages = chatData.messages || [];
        const lastUpdated = chatData.last_updated || '';
        const messageCount = messages.length;

        // Trova il tutor config corrispondente
        const frontendType = {
            'tutor-general': 'generale',
            'tutor-scientific': 'scientifica',
            'tutor-humanistic': 'umanistica'
        }[tutorType] || 'generale';

        const tutor = tutorConfig[frontendType];
        const tutorName = tutor ? tutor.name : tutorType;
        const gradient = tutor ? tutor.gradient : 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)';

        historyHTML += `
            <div class="history-item" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 1.5rem; cursor: pointer; transition: all 0.3s ease;"
                 data-tutor="${frontendType}"
                 onmouseover="this.style.background='rgba(255,255,255,0.08)'"
                 onmouseout="this.style.background='rgba(255,255,255,0.05)'">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <div style="width: 48px; height: 48px; border-radius: 12px; background: ${gradient}; display: flex; align-items: center; justify-content: center; color: #000; font-weight: 700;">
                        ${tutor ? tutor.icon : 'T'}
                    </div>
                    <div style="flex: 1;">
                        <h3 style="color: #fff; margin: 0 0 0.3rem 0; font-size: 1.1rem;">${tutorName}</h3>
                        <p style="color: rgba(255,255,255,0.6); margin: 0; font-size: 0.85rem;">${messageCount} messaggi</p>
                    </div>
                    <div style="text-align: right; color: rgba(255,255,255,0.5); font-size: 0.8rem;">
                        ${new Date(lastUpdated).toLocaleDateString('it-IT')}
                    </div>
                </div>
            </div>
        `;
    }

    elements.historyList.innerHTML = historyHTML;

    // Aggiungi event listener ai history items
    document.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', () => {
            const tutorType = item.dataset.tutor;
            // Simula click sulla tutor card
            const tutorCard = document.querySelector(`.tutor-card[data-tutor="${tutorType}"]`);
            if (tutorCard) {
                handleTutorSelection(tutorCard);
            }
        });
    });
}

// ========================================
// TUTOR SELECTION
// ========================================
async function handleTutorSelection(card) {
    const tutorType = card.dataset.tutor;
    const tutor = tutorConfig[tutorType];

    if (!tutor) return;

    // Update app state
    AppState.currentTutor = tutorType;

    // Update chat view UI
    updateChatView(tutor);

    // Clear chat first
    clearChat();

    // Check if there's chat history for this tutor
    const tutorTypeBackend = mapFrontendToBackend(tutorType);

    if (AppState.chatHistory && AppState.chatHistory[tutorTypeBackend]) {
        // Restore previous messages
        const messages = AppState.chatHistory[tutorTypeBackend].messages;

        if (messages && messages.length > 0) {
            messages.forEach(msg => {
                addMessage(msg.content, msg.role);
            });
        } else {
            // No history, show greeting
            addMessage(tutor.greeting, 'bot');
        }
    } else {
        // No history, show greeting
        addMessage(tutor.greeting, 'bot');
    }

    // Switch to chat view
    navigateToView('chat');

    // Add visual feedback to card
    animateCardSelection(card);
}

function mapFrontendToBackend(frontendType) {
    /**
     * Map frontend tutor names to backend tutor names
     */
    const mapping = {
        'generale': 'tutor-general',
        'scientifica': 'tutor-scientific',
        'umanistica': 'tutor-humanistic'
    };
    return mapping[frontendType] || 'tutor-general';
}

function updateChatView(tutor) {
    // Update header info
    elements.chatViewTutorName.textContent = tutor.name;

    // Clear avatar content
    elements.chatViewAvatar.innerHTML = '';

    // Add mascot image
    const mascotImg = document.createElement('img');
    mascotImg.src = tutor.mascot;
    mascotImg.alt = tutor.name;
    mascotImg.style.width = '100%';
    mascotImg.style.height = '100%';
    mascotImg.style.objectFit = 'contain';
    elements.chatViewAvatar.appendChild(mascotImg);

    elements.chatViewAvatar.style.background = tutor.gradient;
}

function animateCardSelection(card) {
    // Add pulse animation
    card.style.animation = 'none';
    setTimeout(() => {
        card.style.animation = 'pulse 0.5s ease';
    }, 10);
}

// ========================================
// NAVIGATION
// ========================================
function handleBackToDashboard() {
    navigateToView('dashboard');
    // Optionally keep chat history or clear it
    // clearChat(); // Uncomment to clear chat when going back
}

// ========================================
// FILE UPLOAD HANDLING (Images + PDFs)
// ========================================
function handleImageSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type (images or PDF)
    const isImage = file.type.startsWith('image/');
    const isPDF = file.type === 'application/pdf';

    if (!isImage && !isPDF) {
        alert('Per favore seleziona un\'immagine o un file PDF.');
        return;
    }

    // Validate file size (max 20MB for PDFs, 10MB for images)
    const maxSize = isPDF ? 20 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
        alert(`Il file è troppo grande. Massimo ${isPDF ? '20MB' : '10MB'}.`);
        return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = function(e) {
        const base64Data = e.target.result;

        // Store in app state
        AppState.currentImage = {
            data: base64Data,
            mimeType: file.type,
            fileName: file.name
        };

        // Show appropriate preview
        if (isImage) {
            // Show image preview
            elements.imagePreview.src = base64Data;
            elements.imagePreview.style.display = 'block';
            elements.pdfPreview.style.display = 'none';
        } else {
            // Show PDF preview (icon + filename)
            elements.pdfFileName.textContent = file.name;
            elements.pdfPreview.style.display = 'flex';
            elements.imagePreview.style.display = 'none';
        }

        elements.imagePreviewContainer.style.display = 'block';
    };

    reader.onerror = function() {
        alert('Errore durante il caricamento del file.');
    };

    reader.readAsDataURL(file);
}

function handleImageRemove() {
    // Clear state
    AppState.currentImage = null;

    // Clear previews
    elements.imagePreview.src = '';
    elements.imagePreview.style.display = 'none';
    elements.pdfPreview.style.display = 'none';
    elements.imagePreviewContainer.style.display = 'none';

    // Reset file input
    elements.imageInput.value = '';
}

// ========================================
// CHAT FUNCTIONALITY
// ========================================
function clearChat() {
    elements.chatMessages.innerHTML = '';
    AppState.chatHistory = [];
}

async function handleSendMessage() {
    const message = elements.chatInput.value.trim();

    if (!message) return;

    // Add user message
    addMessage(message, 'user');

    // Clear input
    elements.chatInput.value = '';
    elements.chatInput.style.height = 'auto';

    // Show typing indicator
    const typingMessage = addMessage('...', 'bot');

    try {
        // Map frontend tutor type to backend naming
        let backendTutorType = 'tutor-general';
        if (AppState.currentTutor === 'scientifica') {
            backendTutorType = 'tutor-scientific';
        } else if (AppState.currentTutor === 'umanistica') {
            backendTutorType = 'tutor-humanistic';
        }

        // Build request body
        const requestBody = {
            message: message,
            tutorType: backendTutorType
        };

        // Add image if present
        if (AppState.currentImage) {
            requestBody.image_data = AppState.currentImage.data;
            requestBody.mime_type = AppState.currentImage.mimeType;
        }

        // Call backend API
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        // Remove typing indicator
        if (typingMessage && typingMessage.parentNode) {
            typingMessage.parentNode.removeChild(typingMessage);
        }

        // Add real response
        if (data.error) {
            addMessage('Errore: ' + data.error, 'bot');
        } else {
            addMessage(data.reply, 'bot');
        }

        // Clear image preview after successful send
        if (AppState.currentImage) {
            handleImageRemove();
        }

    } catch (error) {
        console.error('Errore di connessione:', error);

        // Remove typing indicator
        if (typingMessage && typingMessage.parentNode) {
            typingMessage.parentNode.removeChild(typingMessage);
        }

        // Show error message
        addMessage('Errore di connessione con il server. Riprova.', 'bot');
    }
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';

    if (sender === 'bot') {
        const tutor = tutorConfig[AppState.currentTutor];
        if (tutor) {
            // Use mascot image instead of text icon
            const mascotImg = document.createElement('img');
            mascotImg.src = tutor.mascot;
            mascotImg.alt = tutor.name;
            mascotImg.style.width = '100%';
            mascotImg.style.height = '100%';
            mascotImg.style.objectFit = 'contain';
            avatarDiv.appendChild(mascotImg);
            avatarDiv.style.background = tutor.gradient;
        } else {
            avatarDiv.textContent = 'AI';
        }
    } else {
        avatarDiv.textContent = AppState.userName.charAt(0).toUpperCase();
    }

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    // Render Markdown to HTML (instead of plain text)
    if (typeof marked !== 'undefined') {
        // Configure marked options
        marked.setOptions({
            breaks: true,  // Convert line breaks to <br>
            gfm: true,     // GitHub Flavored Markdown
            headerIds: false,
            mangle: false
        });

        // Parse markdown and insert as HTML
        contentDiv.innerHTML = marked.parse(text);
    } else {
        // Fallback if marked.js not loaded
        const textP = document.createElement('p');
        textP.textContent = text;
        contentDiv.appendChild(textP);
    }

    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);

    elements.chatMessages.appendChild(messageDiv);

    // Render LaTeX math with MathJax (asynchronously)
    if (typeof MathJax !== 'undefined' && MathJax.typesetPromise) {
        MathJax.typesetPromise([contentDiv]).catch((err) => {
            console.warn('MathJax rendering error:', err);
        });
    }

    // Scroll to bottom with smooth animation
    setTimeout(() => {
        elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
    }, 100);

    // Save to history
    AppState.chatHistory.push({ text, sender, timestamp: Date.now() });

    // Return the message element (useful for removing typing indicator)
    return messageDiv;
}

// ========================================
// AI RESPONSE SIMULATION
// ========================================
function generateAIResponse(userMessage) {
    const message = userMessage.toLowerCase();

    // Simple response logic based on tutor type
    const responses = {
        generale: [
            'Ottima domanda! Per organizzare meglio il tuo studio, ti consiglio di creare un piano settimanale con obiettivi specifici.',
            'Ricorda: la costanza è più importante dell\'intensità. Meglio 30 minuti al giorno che 3 ore una volta a settimana!',
            'Hai bisogno di aiuto per pianificare le tue sessioni di studio? Posso aiutarti a creare un programma personalizzato.'
        ],
        scientifica: [
            'Affrontiamo questo problema passo per passo. Quale parte specifica ti crea difficoltà?',
            'In matematica e nelle scienze, la chiave è comprendere i concetti fondamentali. Hai delle basi solide su questo argomento?',
            'Ottimo! Proviamo a risolvere questo esercizio insieme. Qual è il primo passo secondo te?'
        ],
        umanistica: [
            'Interessante prospettiva! Nelle materie umanistiche è importante fare collegamenti tra i vari concetti.',
            'Per comprendere meglio questo testo, proviamo a contestualizzarlo nel periodo storico. Cosa sai dell\'epoca?',
            'L\'argomentazione è fondamentale. Prova a costruire una tesi supportata da esempi concreti dal testo.'
        ]
    };

    // Get responses for current tutor
    const tutorResponses = responses[AppState.currentTutor] || responses.generale;

    // Return a random response
    return tutorResponses[Math.floor(Math.random() * tutorResponses.length)];
}

// ========================================
// ADDITIONAL ANIMATIONS
// ========================================
// Add CSS animation dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: translateY(-8px) scale(1); }
        50% { transform: translateY(-8px) scale(1.02); }
    }
`;
document.head.appendChild(style);

// ========================================
// MOBILE MENU FUNCTIONALITY
// ========================================
function setupMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const navItems = document.querySelectorAll('.nav-item');

    if (!mobileMenuToggle || !sidebar || !sidebarOverlay) return;

    // Toggle sidebar on hamburger click
    mobileMenuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('sidebar-open');
        sidebarOverlay.classList.toggle('active');
    });

    // Close sidebar on overlay click
    sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('sidebar-open');
        sidebarOverlay.classList.remove('active');
    });

    // Close sidebar when clicking nav items on mobile
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('sidebar-open');
                sidebarOverlay.classList.remove('active');
            }
        });
    });

    // Close sidebar when clicking tutor cards on mobile
    elements.tutorCards.forEach(card => {
        card.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('sidebar-open');
                sidebarOverlay.classList.remove('active');
            }
        });
    });
}

// ========================================
// UTILITY FUNCTIONS
// ========================================
function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
}

// ========================================
// START APPLICATION
// ========================================
document.addEventListener('DOMContentLoaded', init);

// ========================================
// CONSOLE INFO
// ========================================
console.log('%c🎓 NODU.ME Dashboard', 'font-size: 20px; font-weight: bold; color: #00ff88;');
console.log('%cPiattaforma Educational AI caricata con successo!', 'color: #00d4ff;');
console.log('%cVersion: 1.0.0', 'color: #b0b0c8;');
