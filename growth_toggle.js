        function toggleGrowthMenu(forceClose = false) {
            if (!forceClose && isSidebarCollapsed) {
                toggleSidebar();
            }

            const submenu = document.getElementById('growth-submenu');
            const chevron = document.getElementById('growth-chevron');

            // Quick safety check
            if (!submenu || !chevron) return;

            // Initial Setup for animation if still using 'hidden' (Legacy fix)
            if (submenu.classList.contains('hidden')) {
                submenu.classList.remove('hidden');
                submenu.classList.add('max-h-0', 'opacity-0', 'overflow-hidden', 'transition-all', 'duration-300', 'ease-in-out');
                // Force reflow
                void submenu.offsetWidth;
            }

            const isClosed = submenu.classList.contains('max-h-0') || forceClose;

            if (forceClose) {
                submenu.classList.add('max-h-0', 'opacity-0');
                submenu.classList.remove('max-h-96', 'opacity-100'); // Arbitrary large height
                chevron.style.transform = 'rotate(0deg)';
                return;
            }

            if (isClosed) {
                // Open
                submenu.classList.remove('max-h-0', 'opacity-0');
                submenu.classList.add('max-h-96', 'opacity-100');
                chevron.style.transform = 'rotate(180deg)';
            } else {
                // Close
                submenu.classList.add('max-h-0', 'opacity-0');
                submenu.classList.remove('max-h-96', 'opacity-100');
                chevron.style.transform = 'rotate(0deg)';
            }
        }
