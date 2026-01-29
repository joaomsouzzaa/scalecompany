
// --- WHATSAPP INTEGRATION LOGIC ---

try {
    console.log("WhatsApp Logic Loading...");

    // Make functions global explicitly
    window.whatsappState = {
        activeTab: 'instances',
        instances: [],
        groups: [],
        alerts: [],
        currentChatId: null
    };

    window.initWhatsApp = function () {
        console.log("Initializing WhatsApp...");
        try {
            const stored = localStorage.getItem('scale_whatsapp_data');
            if (stored) {
                window.whatsappState = JSON.parse(stored);
            } else {
                // Initial Mock Data
                window.whatsappState.instances = [
                    { id: 'inst-1', name: 'Suporte Comercial', phone: '5511999990000', desc: 'Canal principal de vendas', status: 'connected', qrCode: null }
                ];
                window.whatsappState.groups = [
                    { id: 'grp-1', name: 'Equipe de Vendas', lastMsg: 'Meta de hoje batida!', time: '14:30', unread: 2 },
                    { id: 'grp-2', name: 'Notificações Scale', lastMsg: 'Novo lead cadastrado', time: '14:25', unread: 0 },
                    { id: 'grp-3', name: 'Diretoria', lastMsg: 'Reunião confirmada', time: 'Ontem', unread: 0 }
                ];
                saveWhatsAppState();
            }
            renderWhatsApp();

            // Event Delegation for Button (Robust against DOM timing)
            if (!window.hasAttachedWaListeners) {
                document.addEventListener('click', function (e) {
                    const btn = e.target.closest('#btn-new-instance');
                    if (btn) {
                        e.preventDefault();
                        console.log("Delegated Click: Nova Instância");
                        window.openNewInstanceModal();
                    }
                });
                window.hasAttachedWaListeners = true;
                console.log("Global Event Listener Attached for WA Button");
            } else {
                console.log("Listeners already attached.");
            }

        } catch (e) {
            console.error("Error in initWhatsApp:", e);
        }
    };

    // Helper to init render
    window.renderWhatsApp = function () {
        renderInstances();
        renderGroups();
    }

    window.saveWhatsAppState = function () {
        localStorage.setItem('scale_whatsapp_data', JSON.stringify(window.whatsappState));
    }

    // Tab Switching
    window.switchWhatsAppTab = function (tabName) {
        window.whatsappState.activeTab = tabName;

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
    }

    // --- INSTANCES LOGIC ---
    window.renderInstances = function () {
        const grid = document.getElementById('instance-grid');
        const empty = document.getElementById('instance-empty');
        const countBadge = document.getElementById('count-instances');

        if (!grid) return;

        countBadge.innerText = window.whatsappState.instances.length;

        if (window.whatsappState.instances.length === 0) {
            grid.innerHTML = '';
            empty.classList.remove('hidden');
            return;
        }
        empty.classList.add('hidden');

        grid.innerHTML = window.whatsappState.instances.map(inst => `
            <div class="bg-white rounded-xl border border-slate-200 shadow-sm relative group hover:shadow-md transition-all flex flex-col justify-between">
                <div class="p-5">
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <h3 class="font-bold text-slate-800 text-lg">${inst.name}</h3>
                            <p class="text-sm text-slate-500 font-mono mt-0.5">${inst.phone || 'Sem número'}</p>
                        </div>
                        <span class="px-2 py-1 rounded-full text-[10px] font-bold uppercase ${inst.status === 'connected' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} flex items-center gap-1">
                            <span class="w-1.5 h-1.5 rounded-full ${inst.status === 'connected' ? 'bg-green-500' : 'bg-red-500'}"></span>
                            ${inst.status === 'connected' ? 'Conectado' : 'Desconectado'}
                        </span>
                    </div>
                    <p class="text-xs text-slate-400 mb-4 line-clamp-2 min-h-[1.5em]">${inst.desc || ''}</p>
                    
                    <!-- Grid de Ações -->
                    <div class="grid grid-cols-2 gap-2">
                            <button onclick="window.connectInstance('${inst.id}')" class="flex items-center justify-center px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-medium rounded border border-slate-100 transition-colors">
                            <i data-lucide="qr-code" class="w-4 h-4 mr-2"></i> QR Code
                            </button>
                            <button onclick="window.openWebhookModal('${inst.id}')" class="flex items-center justify-center px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-medium rounded border border-slate-100 transition-colors">
                            <i data-lucide="webhook" class="w-4 h-4 mr-2"></i> Webhook
                            </button>
                            <button onclick="window.syncInstance('${inst.id}')" class="flex items-center justify-center px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-medium rounded border border-slate-100 transition-colors">
                            <i data-lucide="refresh-cw" class="w-4 h-4 mr-2"></i> Sincronizar
                            </button>
                            <button onclick="window.restartInstance('${inst.id}')" class="flex items-center justify-center px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-medium rounded border border-slate-100 transition-colors">
                            <i data-lucide="power" class="w-4 h-4 mr-2"></i> Reiniciar
                            </button>
                    </div>
                </div>
                
                <!-- Footer Info/Delete -->
                <div class="px-5 py-3 bg-slate-50/50 border-t border-slate-100 flex justify-center">
                        <button onclick="window.deleteInstance('${inst.id}')" class="text-red-400 hover:text-red-600 text-xs flex items-center transition-colors">
                        <i data-lucide="trash-2" class="w-3 h-3 mr-1.5"></i> Desconectar
                        </button>
                </div>
            </div>
        `).join('');

        if (window.lucide) lucide.createIcons();
    }

    // --- NEW INSTANCE MODAL LOGIC ---
    window.openNewInstanceModal = function () {
        console.log("Opening Modal triggered");
        const modal = document.getElementById('instance-modal');
        const content = document.getElementById('instance-modal-content');

        if (!modal) {
            console.error("Modal not found");
            return;
        }

        modal.classList.remove('hidden');
        // Animation
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            content.classList.remove('scale-95', 'opacity-0');
        }, 10);
    }

    window.closeNewInstanceModal = function () {
        const modal = document.getElementById('instance-modal');
        const content = document.getElementById('instance-modal-content');

        content.classList.add('scale-95', 'opacity-0');
        modal.classList.add('opacity-0');

        setTimeout(() => {
            modal.classList.add('hidden');
            // Clear fields
            document.getElementById('wa-name').value = '';
            document.getElementById('wa-phone').value = '';
            document.getElementById('wa-desc').value = '';
        }, 300);
    }

    window.saveNewInstance = function () {
        const name = document.getElementById('wa-name').value.trim();
        const phone = document.getElementById('wa-phone').value.trim();
        const desc = document.getElementById('wa-desc').value.trim();

        if (!name) {
            alert("Por favor, informe o Nome da Instância.");
            return;
        }

        const newInst = {
            id: `inst-${Date.now()}`,
            name: name,
            phone: phone,
            desc: desc, // Added description
            status: 'disconnected',
            qrCode: null
        };

        window.whatsappState.instances.push(newInst);
        window.saveWhatsAppState();
        renderInstances();
        window.closeNewInstanceModal();
    }

    window.deleteInstance = function (id) {
        if (!confirm("Deseja realmente desconectar e remover esta instância?")) return;
        window.whatsappState.instances = window.whatsappState.instances.filter(i => i.id !== id);
        window.saveWhatsAppState();
        renderInstances();
    }

    // Mock Actions
    window.connectInstance = function (id) {
        alert(`Simulando conexão UAZAPI para instância ${id}...\n\n(QR Code seria exibido aqui)`);
        setTimeout(() => {
            const inst = window.whatsappState.instances.find(i => i.id === id);
            if (inst && inst.status !== 'connected') {
                if (confirm("Deseja simular sucesso na conexão?")) {
                    inst.status = 'connected';
                    window.saveWhatsAppState();
                    renderInstances();
                }
            }
        }, 1000);
    }

    window.syncInstance = function (id) {
        alert(`Sincronizando mensagens e contatos da instância ${id}...`);
    }

    window.restartInstance = function (id) {
        if (confirm("Reiniciar conexão da instância?")) {
            alert(`Instância ${id} reiniciada com sucesso.`);
        }
    }

    window.openWebhookModal = function (id) {
        alert(`Configuração de Webhook para ${id} (Em breve)`);
    }

    // --- GROUPS LOGIC ---
    window.renderGroups = function () {
        const list = document.getElementById('groups-list');
        const countBadge = document.getElementById('count-groups');

        if (!list) return;

        countBadge.innerText = window.whatsappState.groups.length;

        list.innerHTML = window.whatsappState.groups.map(grp => `
            <div onclick="window.openChat('${grp.id}')" class="p-3 border-b border-slate-100 hover:bg-slate-100 cursor-pointer flex items-center transition-colors ${window.whatsappState.currentChatId === grp.id ? 'bg-slate-100' : ''}">
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

    window.openChat = function (grpId) {
        window.whatsappState.currentChatId = grpId;
        const grp = window.whatsappState.groups.find(g => g.id === grpId);

        document.getElementById('chat-header').classList.remove('hidden');
        document.getElementById('chat-input-area').classList.remove('hidden');
        document.getElementById('chat-title').innerText = grp.name;

        // Clear mock messages and show welcome
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

        renderGroups();
        if (window.lucide) lucide.createIcons();
    }

    window.sendMessage = function () {
        const input = document.getElementById('message-input');
        const txt = input.value.trim();
        if (!txt || !window.whatsappState.currentChatId) return;

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

        const grp = window.whatsappState.groups.find(g => g.id === window.whatsappState.currentChatId);
        grp.lastMsg = txt;
        grp.time = 'Agora';
        renderGroups();

        input.value = '';
        msgArea.parentElement.scrollTop = msgArea.parentElement.scrollHeight;
        if (window.lucide) lucide.createIcons();
    }

    window.saveAlertConfig = function () {
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

    console.log("WhatsApp Logic Loaded Successfully");

} catch (eGlobal) {
    console.error("CRITICAL ERROR LOADING WHATSAPP LOGIC:", eGlobal);
    alert("Erro crítico ao carregar lógica do WhatsApp: " + eGlobal.message);
}
