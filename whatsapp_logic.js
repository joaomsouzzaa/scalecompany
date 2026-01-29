
// --- WHATSAPP INTEGRATION LOGIC ---

// State Management
let whatsappState = {
    activeTab: 'instances',
    instances: [],
    groups: [],
    alerts: [],
    currentChatId: null
};

// Initialize (Load from Storage or Mock)
function initWhatsApp() {
    const stored = localStorage.getItem('scale_whatsapp_data');
    if (stored) {
        whatsappState = JSON.parse(stored);
    } else {
        // Initial Mock Data
        whatsappState.instances = [
            { id: 'inst-1', name: 'Suporte Comercial', phone: '5511999990000', status: 'connected', qrCode: null }
        ];
        whatsappState.groups = [
            { id: 'grp-1', name: 'Equipe de Vendas', lastMsg: 'Meta de hoje batida!', time: '14:30', unread: 2 },
            { id: 'grp-2', name: 'Notificações Scale', lastMsg: 'Novo lead cadastrado', time: '14:25', unread: 0 },
            { id: 'grp-3', name: 'Diretoria', lastMsg: 'Reunião confirmada', time: 'Ontem', unread: 0 }
        ];
        saveWhatsAppState();
    }
    renderWhatsApp();
}

function saveWhatsAppState() {
    localStorage.setItem('scale_whatsapp_data', JSON.stringify(whatsappState));
}

// Tab Switching
function switchWhatsAppTab(tabName) {
    whatsappState.activeTab = tabName;

    // Visual Update
    ['instances', 'groups', 'alerts'].forEach(t => {
        const content = document.getElementById(`wa-content-${t}`);
        const btn = document.getElementById(`tab-btn-${t}`);

        if (t === tabName) {
            content.classList.remove('hidden');
            btn.classList.remove('border-transparent', 'text-slate-500');
            btn.classList.add('border-orange-500', 'text-orange-600');
        } else {
            content.classList.add('hidden');
            btn.classList.add('border-transparent', 'text-slate-500');
            btn.classList.remove('border-orange-500', 'text-orange-600');
        }
    });

    if (tabName === 'instances') renderInstances();
    if (tabName === 'groups') renderGroups();
    // if (tabName === 'alerts') renderAlerts();
}

// --- INSTANCES LOGIC ---
function renderInstances() {
    const grid = document.getElementById('instance-grid');
    const empty = document.getElementById('instance-empty');
    const countBadge = document.getElementById('count-instances');

    countBadge.innerText = whatsappState.instances.length;

    if (whatsappState.instances.length === 0) {
        grid.innerHTML = '';
        empty.classList.remove('hidden');
        return;
    }
    empty.classList.add('hidden');

    grid.innerHTML = whatsappState.instances.map(inst => `
                <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative group hover:shadow-md transition-all">
                    <div class="flex justify-between items-start mb-4">
                        <div class="flex items-center">
                            <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mr-3">
                                <i data-lucide="smartphone" class="w-5 h-5 text-slate-500"></i>
                            </div>
                            <div>
                                <h3 class="font-medium text-slate-900">${inst.name}</h3>
                                <p class="text-xs text-slate-500 font-mono">${inst.phone || 'Sem número'}</p>
                            </div>
                        </div>
                        <span class="px-2 py-1 rounded-full text-[10px] font-bold uppercase ${inst.status === 'connected' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                            ${inst.status === 'connected' ? 'Conectado' : 'Desconectado'}
                        </span>
                    </div>
                    
                    ${inst.status === 'connected' ? `
                        <div class="grid grid-cols-2 gap-2 mt-4">
                            <button class="px-3 py-2 bg-slate-50 text-slate-600 text-xs font-medium rounded hover:bg-slate-100 border border-slate-100 transition-colors">Testar Mensagem</button>
                            <button onclick="deleteInstance('${inst.id}')" class="px-3 py-2 bg-red-50 text-red-600 text-xs font-medium rounded hover:bg-red-100 border border-red-100 transition-colors">Desconectar</button>
                        </div>
                    ` : `
                        <div class="mt-4 p-4 bg-slate-50 rounded-lg flex flex-col items-center justify-center text-center border-dashed border-2 border-slate-200 group-hover:border-slate-300 transition-colors cursor-pointer" onclick="connectInstance('${inst.id}')">
                            <i data-lucide="qr-code" class="w-8 h-8 text-slate-400 mb-2"></i>
                            <span class="text-xs text-slate-500 font-medium">Clique para Escanear QR Code</span>
                        </div>
                    `}
                </div>
            `).join('');

    if (window.lucide) lucide.createIcons();
}

function openNewInstanceModal() {
    const name = prompt("Nome da nova instância (Ex: Vendas):");
    if (!name) return;

    whatsappState.instances.push({
        id: `inst-${Date.now()}`,
        name: name,
        phone: '',
        status: 'disconnected',
        qrCode: null
    });
    saveWhatsAppState();
    renderInstances();
}

function deleteInstance(id) {
    if (!confirm("Deseja desconectar e remover esta instância?")) return;
    whatsappState.instances = whatsappState.instances.filter(i => i.id !== id);
    saveWhatsAppState();
    renderInstances();
}

function connectInstance(id) {
    // Mock connection flow
    const card = document.querySelector(`button[onclick="connectInstance('${id}')"]`)?.parentElement; // simplified selector logic

    // In a real app we would show a modal with the QR Code.
    // For now, let's simulate a "Scanning" state.
    alert("Gerando QR Code via UAZAPI... (Simulação)");

    setTimeout(() => {
        const confirmConnect = confirm("Simular leitura do QR Code com sucesso?");
        if (confirmConnect) {
            const inst = whatsappState.instances.find(i => i.id === id);
            if (inst) {
                inst.status = 'connected';
                inst.phone = '55119' + Math.floor(Math.random() * 100000000);
                saveWhatsAppState();
                renderInstances();
                alert("Dispositivo conectado com sucesso!");
            }
        }
    }, 1000);
}

// --- GROUPS LOGIC ---
function renderGroups() {
    const list = document.getElementById('groups-list');
    const countBadge = document.getElementById('count-groups');

    countBadge.innerText = whatsappState.groups.length;

    list.innerHTML = whatsappState.groups.map(grp => `
                <div onclick="openChat('${grp.id}')" class="p-3 border-b border-slate-100 hover:bg-slate-100 cursor-pointer flex items-center transition-colors ${whatsappState.currentChatId === grp.id ? 'bg-slate-100' : ''}">
                    <div class="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center mr-3 shrink-0">
                        <i data-lucide="users" class="w-5 h-5 text-slate-500"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex justify-between items-baseline mb-0.5">
                            <h4 class="text-sm font-medium text-slate-800 truncate">${grp.name}</h4>
                            <span class="text-[10px] text-slate-400 shrink-0 ml-2">${grp.time}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <p class="text-xs text-slate-500 truncate pr-2">${grp.lastMsg}</p>
                            ${grp.unread > 0 ? `<span class="bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">${grp.unread}</span>` : ''}
                        </div>
                    </div>
                </div>
             `).join('');

    if (window.lucide) lucide.createIcons();
}

function openChat(grpId) {
    whatsappState.currentChatId = grpId;
    const grp = whatsappState.groups.find(g => g.id === grpId);

    // Update UI
    document.getElementById('chat-header').classList.remove('hidden');
    document.getElementById('chat-input-area').classList.remove('hidden');
    document.getElementById('chat-title').innerText = grp.name;

    // Clear mock messages and show welcome
    // In real app, fetch messages here.
    const msgArea = document.getElementById('chat-messages');
    msgArea.innerHTML = `
                <div class="flex flex-col space-y-4 p-4">
                    <div class="flex justify-center mb-4">
                        <span class="text-[11px] bg-slate-200 text-slate-600 px-2 py-1 rounded shadow-sm">Hoje</span>
                    </div>
                    <!-- Received Mock -->
                    <div class="self-start bg-white rounded-lg rounded-tl-none p-3 shadow-sm max-w-[80%] border border-slate-100">
                        <p class="text-sm text-slate-800">Olá equipe, como estão os leads hoje?</p>
                        <span class="text-[10px] text-slate-400 block text-right mt-1">09:00</span>
                    </div>
                     <!-- Sent Mock -->
                    <div class="self-end bg-[#d9fdd3] rounded-lg rounded-tr-none p-3 shadow-sm max-w-[80%] border border-green-100">
                        <p class="text-sm text-slate-800">Tudo ótimo! Dashboard atualizado.</p>
                        <div class="flex items-center justify-end gap-1 mt-1">
                             <span class="text-[10px] text-green-800/60">09:05</span>
                             <i data-lucide="check-check" class="w-3 h-3 text-blue-500"></i>
                        </div>
                    </div>
                </div>
            `;

    renderGroups(); // Re-render to highlight active
    if (window.lucide) lucide.createIcons();
}

function sendMessage() {
    const input = document.getElementById('message-input');
    const txt = input.value.trim();
    if (!txt || !whatsappState.currentChatId) return;

    // Add to UI
    const msgArea = document.getElementById('chat-messages').querySelector('.flex-col');
    msgArea.innerHTML += `
               <div class="self-end bg-[#d9fdd3] rounded-lg rounded-tr-none p-3 shadow-sm max-w-[80%] border border-green-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <p class="text-sm text-slate-800">${txt}</p>
                    <div class="flex items-center justify-end gap-1 mt-1">
                            <span class="text-[10px] text-green-800/60">Agora</span>
                            <i data-lucide="check" class="w-3 h-3 text-slate-400"></i>
                    </div>
                </div>
            `;

    // Update List state
    const grp = whatsappState.groups.find(g => g.id === whatsappState.currentChatId);
    grp.lastMsg = txt;
    grp.time = 'Agora';
    renderGroups();

    input.value = '';
    msgArea.parentElement.scrollTop = msgArea.parentElement.scrollHeight;
    if (window.lucide) lucide.createIcons();

    // Simulate double check
    setTimeout(() => {
        // Cheap way to update last icon
        const checks = msgArea.querySelectorAll('[data-lucide="check"]');
        if (checks.length) {
            const last = checks[checks.length - 1];
            // Re-render icon not easy without re-innerHTML. 
            // Just trust lucide or ignore for now.
        }
    }, 1000);
}

// --- ALERTS LOGIC ---
function saveAlertConfig() {
    // Mock Save
    const time = document.getElementById('alert-time').value;
    const acc = document.getElementById('alert-account').value;
    const dest = document.getElementById('alert-recipient').value;

    if (!dest) {
        alert("Por favor, informe ao menos um destinatário.");
        return;
    }

    const btn = document.querySelector('button[onclick="saveAlertConfig()"]');
    const original = btn.innerHTML;

    btn.innerHTML = `<i data-lucide="check" class="w-4 h-4 mr-2 inline"></i> Salvo!`;
    btn.classList.add('bg-green-600', 'hover:bg-green-700');
    btn.classList.remove('bg-orange-600', 'hover:bg-orange-700');

    setTimeout(() => {
        btn.innerHTML = original;
        btn.classList.remove('bg-green-600', 'hover:bg-green-700');
        btn.classList.add('bg-orange-600', 'hover:bg-orange-700');
        if (window.lucide) lucide.createIcons();
    }, 2000);

    alert(`Alerta configurado para ${time} na conta ${acc}.`);
}
