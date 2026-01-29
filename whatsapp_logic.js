
// --- MINIMAL WHATSAPP LOGIC (FAILSAFE) ---
console.log("WhatsApp Logic Module Loaded (Failsafe Mode)");

window.whatsappState = {
    instances: []
};

// IMMEDIATE FUNCTION DEFINITION
// Defined globally immediately, not inside an init function
window.openNewInstanceModal = function () {
    console.log("Opening Modal Function Called via ONCLICK or DELEGATION");

    const modal = document.getElementById('instance-modal');
    if (modal) {
        modal.classList.remove('hidden');
        // Force display block via style just in case tailwind hidden class is stubborn
        modal.style.display = 'flex';

        setTimeout(() => {
            modal.classList.remove('opacity-0');
            modal.style.opacity = '1';
        }, 10);
    } else {
        console.error("CRITICAL: Modal element #instance-modal not found!");
        alert("Erro: O modal não foi encontrado na página.");
    }
};

window.closeNewInstanceModal = function () {
    const modal = document.getElementById('instance-modal');
    if (modal) {
        modal.classList.add('opacity-0');
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.style.display = 'none';
        }, 300);
    }
};

window.saveNewInstance = function () {
    const name = document.getElementById('wa-name').value;
    const phone = document.getElementById('wa-phone').value;

    if (!name) {
        alert("Preencha o nome da instância.");
        return;
    }

    alert(`Instância Salva! Nome: ${name}`);
    window.closeNewInstanceModal();
}

// Init function (Optional now, but good for rendering list)
window.initWhatsApp = function () {
    console.log("Initializing WhatsApp View...");

    // Render empty state or list
    const container = document.getElementById('instance-list-container');
    if (container) {
        container.innerHTML = `<div class="col-span-full text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <p class="text-slate-500">Nenhuma instância conectada.</p>
        </div>`;
    }
};
