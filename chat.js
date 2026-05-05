// Chat Module - Réutilisable sur toutes les pages
(function() {
    // Sample conversations data
    const conversationsData = [
        {
            id: 1,
            name: "Marie B.",
            avatar: "MB",
            avatarBg: "bg-purple-100",
            avatarText: "text-purple-700",
            avatarBorder: "border-purple-200",
            isOnline: true,
            lastMessage: "Merci pour votre intérêt ! Comment puis-je vous aider ?",
            timestamp: "14:31",
            unread: 0
        },
        {
            id: 2,
            name: "Jean Michel",
            avatar: "JM",
            avatarBg: "bg-amber-100",
            avatarText: "text-amber-700",
            avatarBorder: "border-amber-200",
            isOnline: false,
            lastMessage: "À bientôt !",
            timestamp: "Hier",
            unread: 2
        },
        {
            id: 3,
            name: "Coopérative F.",
            avatar: "CF",
            avatarBg: "bg-emerald-100",
            avatarText: "text-emerald-700",
            avatarBorder: "border-emerald-200",
            isOnline: true,
            lastMessage: "Nous avons reçu votre commande",
            timestamp: "Mar",
            unread: 0
        }
    ];

    const chatWindow = document.getElementById('chatWindow');
    const chatToggleBtn = document.getElementById('chatToggleBtn');
    const closeBtn = document.getElementById('closeBtn');
    const minimizeBtn = document.getElementById('minimizeBtn');
    const messagesContainer = document.getElementById('messagesContainer');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatHeader = document.querySelector('#chatWindow > div:nth-child(1)');
    
    let currentConversationId = null;
    let isChatMinimized = false;

    // Initialize chat - show conversation list by default
    function initChat() {
        renderConversationList();
    }

    // Render conversation list (like WhatsApp/Instagram)
    function renderConversationList() {
        const chatContent = document.querySelector('#chatWindow > div:nth-child(2)');
        
        chatContent.innerHTML = `
            <div id="conversationList" class="flex flex-col h-full">
                <!-- Search Bar -->
                <div class="p-3 border-b border-slate-100 bg-slate-50/80">
                    <input type="text" placeholder="Chercher une conversation..." class="w-full bg-white border border-slate-200 rounded-full py-2 pl-4 pr-4 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400">
                </div>
                
                <!-- Conversations List -->
                <div id="convList" class="flex-1 overflow-y-auto">
                    ${conversationsData.map(conv => `
                        <div class="conversation-item cursor-pointer hover:bg-slate-50 border-b border-slate-100 p-3 transition-colors" data-conv-id="${conv.id}">
                            <div class="flex items-center gap-3">
                                <div class="relative flex-shrink-0">
                                    <div class="w-12 h-12 rounded-full ${conv.avatarBg} flex items-center justify-center ${conv.avatarText} font-semibold text-sm border ${conv.avatarBorder}">
                                        ${conv.avatar}
                                    </div>
                                    ${conv.isOnline ? '<span class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>' : ''}
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="flex justify-between items-baseline gap-2">
                                        <h4 class="text-sm font-semibold text-slate-900">${conv.name}</h4>
                                        <span class="text-xs text-slate-400 flex-shrink-0">${conv.timestamp}</span>
                                    </div>
                                    <p class="text-xs text-slate-500 truncate mt-0.5">${conv.lastMessage}</p>
                                </div>
                                ${conv.unread > 0 ? `<span class="flex-shrink-0 w-5 h-5 bg-blue-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold">${conv.unread}</span>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Add event listeners to conversation items
        document.querySelectorAll('.conversation-item').forEach(item => {
            item.addEventListener('click', () => {
                const convId = parseInt(item.dataset.convId);
                openConversation(convId);
            });
        });

        // Update header for list view
        updateHeaderForList();
    }

    // Open a conversation
    function openConversation(convId) {
        const conversation = conversationsData.find(c => c.id === convId);
        if (!conversation) return;

        currentConversationId = convId;
        const chatContent = document.querySelector('#chatWindow > div:nth-child(2)');
        
        chatContent.innerHTML = `
            <div id="messageView" class="flex flex-col h-full">
                <!-- Back Button & header info inserted via updateHeaderForConversation -->
            </div>
        `;

        updateHeaderForConversation(conversation);
        loadConversationMessages(conversation);
    }

    // Load messages for a conversation
    function loadConversationMessages(conversation) {
        const messageView = document.getElementById('messageView');
        
        messageView.innerHTML = `
            <div class="text-center text-xs text-slate-400 font-medium py-4">Aujourd'hui</div>
            
            <div class="flex gap-2 flex-row-reverse animate-fade-in">
                <div class="bg-blue-600 text-sm text-white rounded-2xl rounded-tr-sm py-2 px-3.5 max-w-[85%] shadow-sm">
                    Bonjour ! Avez-vous des produits en stock ?
                </div>
                <span class="text-xs text-slate-400 self-end">14:30</span>
            </div>
            
            <div class="flex gap-2 items-end animate-fade-in" style="animation-delay: 0.1s">
                <div class="w-6 h-6 rounded-full ${conversation.avatarBg} flex-shrink-0 flex items-center justify-center ${conversation.avatarText} font-semibold text-[10px] border ${conversation.avatarBorder}">
                    ${conversation.avatar}
                </div>
                <div class="bg-slate-100 border border-slate-200/50 text-sm text-slate-800 rounded-2xl rounded-tl-sm py-2 px-3.5 max-w-[85%]">
                    Bonjour ! Oui, j'ai plusieurs produits disponibles. Comment puis-je vous aider ?
                </div>
                <span class="text-xs text-slate-400 self-end">14:31</span>
            </div>
        `;

        messagesContainer.innerHTML = messageView.parentElement.innerHTML;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Update header for list view
    function updateHeaderForList() {
        chatHeader.innerHTML = `
            <div class="p-3 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
                <h4 class="text-sm font-semibold text-slate-900">Messages</h4>
                <div class="flex gap-1">
                    <button id="minimizeBtn" class="p-1.5 text-slate-400 hover:text-slate-600 transition-colors rounded-md hover:bg-slate-200/50" title="Minimiser">
                        <iconify-icon icon="solar:minus-linear" stroke-width="1.5" class="text-lg"></iconify-icon>
                    </button>
                    <button id="closeBtn" class="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded-md hover:bg-slate-200/50" title="Fermer">
                        <iconify-icon icon="solar:close-circle-linear" stroke-width="1.5" class="text-lg"></iconify-icon>
                    </button>
                </div>
            </div>
        `;
        
        // Re-attach button listeners
        document.getElementById('minimizeBtn').addEventListener('click', minimizeChat);
        document.getElementById('closeBtn').addEventListener('click', closeChat);
    }

    // Update header for conversation view
    function updateHeaderForConversation(conversation) {
        chatHeader.innerHTML = `
            <div class="p-3 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                    <button id="backBtn" class="p-1 text-slate-400 hover:text-slate-600 transition-colors rounded-md" title="Retour">
                        <iconify-icon icon="solar:arrow-left-linear" stroke-width="1.5" class="text-lg"></iconify-icon>
                    </button>
                    <div class="w-8 h-8 rounded-full ${conversation.avatarBg} flex items-center justify-center ${conversation.avatarText} font-semibold text-xs border ${conversation.avatarBorder} relative">
                        ${conversation.avatar}
                        ${conversation.isOnline ? '<span class="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></span>' : ''}
                    </div>
                    <div>
                        <h4 class="text-sm font-semibold text-slate-900 leading-none">${conversation.name}</h4>
                        <span class="text-xs text-slate-500 font-medium">${conversation.isOnline ? 'Disponible' : 'Hors ligne'}</span>
                    </div>
                </div>
                <div class="flex gap-1">
                    <button id="minimizeBtn" class="p-1.5 text-slate-400 hover:text-slate-600 transition-colors rounded-md hover:bg-slate-200/50" title="Minimiser">
                        <iconify-icon icon="solar:minus-linear" stroke-width="1.5" class="text-lg"></iconify-icon>
                    </button>
                    <button id="closeBtn" class="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded-md hover:bg-slate-200/50" title="Fermer">
                        <iconify-icon icon="solar:close-circle-linear" stroke-width="1.5" class="text-lg"></iconify-icon>
                    </button>
                </div>
            </div>
        `;
        
        // Re-attach button listeners
        document.getElementById('backBtn').addEventListener('click', goBackToList);
        document.getElementById('minimizeBtn').addEventListener('click', minimizeChat);
        document.getElementById('closeBtn').addEventListener('click', closeChat);
    }

    // Go back to conversation list
    function goBackToList() {
        currentConversationId = null;
        renderConversationList();
    }

    // Toggle chat window
    function toggleChat() {
        chatWindow.classList.toggle('hidden');
        chatToggleBtn.classList.toggle('hidden');
        isChatMinimized = false;
    }

    // Minimize chat
    function minimizeChat() {
        isChatMinimized = !isChatMinimized;
        const contentArea = chatWindow.querySelector('#chatWindow > div:nth-child(2)');
        const inputArea = chatWindow.querySelector('#chatWindow > div:nth-child(4)');
        
        chatWindow.style.height = isChatMinimized ? 'auto' : '400px';
        contentArea?.classList.toggle('hidden');
        inputArea?.classList.toggle('hidden');
    }

    // Close chat
    function closeChat() {
        chatWindow.classList.add('hidden');
        chatToggleBtn.classList.remove('hidden');
        isChatMinimized = false;
        goBackToList();
    }

    // Send message
    function sendMessage() {
        if (!currentConversationId) return;
        
        const message = messageInput.value.trim();
        if (!message) return;

        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'flex gap-2 flex-row-reverse animate-fade-in';
        userMessageDiv.innerHTML = `
            <div class="bg-blue-600 text-sm text-white rounded-2xl rounded-tr-sm py-2 px-3.5 max-w-[85%] shadow-sm">
                ${message}
            </div>
            <span class="text-xs text-slate-400 self-end">${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
        `;
        messagesContainer.appendChild(userMessageDiv);
        messageInput.value = '';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Simulate response
        setTimeout(() => {
            const responses = [
                "Oui, c'est possible ! Voulez-vous plus de détails ?",
                "D'accord, je peux arranger ça pour vous.",
                "Merci pour votre intérêt ! Comment puis-je vous aider ?",
                "Excellent choix ! Avez-vous des questions ?",
                "Pas de problème, je suis disponible pour discuter."
            ];
            const conversation = conversationsData.find(c => c.id === currentConversationId);
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            
            const artisanMessageDiv = document.createElement('div');
            artisanMessageDiv.className = 'flex gap-2 items-end animate-fade-in';
            artisanMessageDiv.innerHTML = `
                <div class="w-6 h-6 rounded-full ${conversation.avatarBg} flex-shrink-0 flex items-center justify-center ${conversation.avatarText} font-semibold text-[10px] border ${conversation.avatarBorder}">
                    ${conversation.avatar}
                </div>
                <div class="bg-slate-100 border border-slate-200/50 text-sm text-slate-800 rounded-2xl rounded-tl-sm py-2 px-3.5 max-w-[85%]">
                    ${randomResponse}
                </div>
                <span class="text-xs text-slate-400 self-end">${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
            `;
            messagesContainer.appendChild(artisanMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 1000);
    }

    // Event listeners
    if (chatToggleBtn) chatToggleBtn.addEventListener('click', toggleChat);
    if (sendBtn) sendBtn.addEventListener('click', sendMessage);
    if (messageInput) messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Initialize on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChat);
    } else {
        initChat();
    }
})();
