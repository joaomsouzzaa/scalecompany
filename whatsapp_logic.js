
// --- MINIMAL WHATSAPP LOGIC (REBUILD) ---

console.log("WhatsApp Logic Module Loaded (Clean)");

window.whatsappState = {
    instances: []
};

// 1. Initialization
window.initWhatsApp = function () {
    console.log("Initializing WhatsApp Module...");

    // Setup Global Event Delegation for the "New Instance" button
    if (!window.hasAttachedWaListeners) {
        document.addEventListener('click', function (e) {
            // Check for New Instance Button
            const btnNew = e.target.closest('#btn-new-instance');
            if (btnNew) {
                e.preventDefault();
                console.log("Button Clicked: New Instance");
                window.openNewInstanceModal();
            }

            // Check for Save Button
            const btnSave = e.target.closest('#btn-save-instance');
            if (btnSave) {
                e.preventDefault();
                console.log("Button Clicked: Save Instance");
                window.saveNewInstance();
            }

            // Check for Close Modal
            const btnClose = e.target.closest('#btn-close-modal');
            if (btnClose) {
                e.preventDefault();
                window.closeNewInstanceModal();
            }
        });
        window.hasAttachedWaListeners = true;
        console.log("Global Event Listeners Attached.");
    }

    renderWhatsApp();
};

// 2. Render Wrapper
window.renderWhatsApp = function () {
    // Determine if we have instances to show (placeholder for now)
    const container = document.getElementById('instance-list-container');
    if (container) {
        container.innerHTML = `<p class="text-slate-500 text-center py-4">Nenhuma instância (Renderização limpa)</p>`;
    }
}

// 3. Modal Logic
window.openNewInstanceModal = function () {
    console.log("Opening Modal Function Called");
    const modal = document.getElementById('instance-modal');
    if (modal) {
        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.remove('opacity-0'), 10);
    } else {
        console.error("CRITICAL: Modal element #instance-modal not found!");
        alert("Erro: O modal não foi encontrado na página.");
    }
};

window.closeNewInstanceModal = function () {
    const modal = document.getElementById('instance-modal');
    if (modal) {
        modal.classList.add('opacity-0');
        setTimeout(() => modal.classList.add('hidden'), 300);
    }
};

window.saveNewInstance = function () {
    const name = document.getElementById('wa-name').value;
    const phone = document.getElementById('wa-phone').value;

    if (!name || !phone) {
        alert("Preencha nome e telefone.");
        return;
    }

    alert(`Salvo com sucesso: ${name} (${phone})`);
    window.closeNewInstanceModal();
}
