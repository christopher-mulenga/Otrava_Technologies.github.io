// Otrava AI Assistant Script - Uses existing HTML
(function() {
    const WORKER_URL = 'https://otrava-ai.mulengachristopher00.workers.dev';

    // ─── GET YOUR EXISTING HTML ELEMENTS ──────────────────────────
    const toggle = document.getElementById('ot-ai-toggle');
    const windowEl = document.getElementById('ot-ai-window');
    const closeBtn = document.getElementById('ot-ai-close');
    const messages = document.getElementById('ot-ai-messages');
    const input = document.getElementById('ot-ai-input');
    const form = document.getElementById('ot-ai-form');

    // Safety check: if the HTML isn't there, stop the script
    if (!toggle || !windowEl || !closeBtn || !messages || !input || !form) {
        console.warn('AI Chat elements missing from HTML. Make sure they are present.');
        return;
    }
    // ─────────────────────────────────────────────────────────────────

    let isOpen = false;

    // ─── TOGGLE THE WINDOW ──────────────────────────────────────────
    function toggleWindow() {
        isOpen = !isOpen;
        // Use the 'hidden' attribute which you already have in your HTML
        windowEl.hidden = !isOpen;
        if (isOpen) input.focus();
    }

    toggle.addEventListener('click', toggleWindow);
    closeBtn.addEventListener('click', toggleWindow);

    // ─── HANDLE SENDING MESSAGES ──────────────────────────────────
    async function sendMessage(e) {
        e.preventDefault(); // Stop the form from reloading the page
        const question = input.value.trim();
        if (!question) return;

        // 1. Add user message
        const userMsg = document.createElement('div');
        userMsg.className = 'ot-ai-message ot-ai-user';
        userMsg.textContent = question;
        messages.appendChild(userMsg);
        messages.scrollTop = messages.scrollHeight;
        input.value = '';

        // 2. Show loading animation
        const loading = document.createElement('div');
        loading.className = 'ot-ai-message ot-ai-bot';
        loading.textContent = 'Thinking…';
        messages.appendChild(loading);
        messages.scrollTop = messages.scrollHeight;

                try {
            const response = await fetch(WORKER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question }),
            });
            const data = await response.json();
            
            // 🚨 NEW LOGIC: Check if the Worker actually sent an error field
            if (data.error) {
                loading.remove();
                const errorMsg = document.createElement('div');
                errorMsg.className = 'ot-ai-message ot-ai-bot';
                errorMsg.textContent = `Backend Error: ${data.error}`;
                messages.appendChild(errorMsg);
                messages.scrollTop = messages.scrollHeight;
                return;
            }

            // If it's a valid answer, show it
            const answer = data.answer || 'Sorry, I could not get a response.';
            loading.remove();
            const botMsg = document.createElement('div');
            botMsg.className = 'ot-ai-message ot-ai-bot';
            botMsg.textContent = answer;
            messages.appendChild(botMsg);
            messages.scrollTop = messages.scrollHeight;

        } catch (error) {
            loading.remove();
            const errorMsg = document.createElement('div');
            errorMsg.className = 'ot-ai-message ot-ai-bot';
            errorMsg.textContent = `Network Error: ${error.message}`;
            messages.appendChild(errorMsg);
            messages.scrollTop = messages.scrollHeight;
        }
    }

    // Listen to the form submit event (matches your HTML <form id="ot-ai-form">)
    form.addEventListener('submit', sendMessage);
})();