javascript:(function () {
    // === COOKIE HELPERS ===
    function setCookie(name, value, days) {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
    }

    function getCookie(name) {
        return document.cookie.split('; ').reduce((r, v) => {
            const parts = v.split('=');
            return parts[0] === name ? decodeURIComponent(parts[1]) : r;
        }, '');
    }

    // === CREATE CONTEXT MENU ===
    const chatgptMenu = document.createElement('div');
    chatgptMenu.id = 'chatgpt-context-menu';
    Object.assign(chatgptMenu.style, {
        position: 'absolute',
        border: '1px solid #ccc',
        borderRadius: '10px',
        padding: '10px 14px 14px 14px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
        display: 'none',
        zIndex: 99999,
        transition: 'opacity 0.25s ease, transform 0.25s ease',
        opacity: 0,
        transform: 'translateY(20px) scale(0.95)',
        minWidth: '150px',
        fontFamily: 'Arial, sans-serif',
        direction: 'rtl'
    });

    // === LOAD THEME ===
    let currentTheme = getCookie('chatgpt_theme') || 'light';
    applyTheme(currentTheme, false);

    function applyTheme(theme, animate = true) {
        if (animate) {
            chatgptMenu.style.transition = 'opacity 0.4s ease';
            chatgptMenu.style.opacity = 0;
            setTimeout(() => {
                setColors(theme);
                chatgptMenu.style.opacity = 1;
            }, 200);
        } else {
            setColors(theme);
        }
    }

    function setColors(theme) {
        if (theme === 'dark') {
            Object.assign(chatgptMenu.style, {
                background: '#1e1e1e',
                color: '#f5f5f5',
                border: '1px solid #444'
            });
        } else {
            Object.assign(chatgptMenu.style, {
                background: '#ffffff',
                color: '#000',
                border: '1px solid #ccc'
            });
        }
    }

    // === CLOSE BUTTON ===
    const closeButton = document.createElement('span');
    closeButton.innerHTML = '✕';
    Object.assign(closeButton.style, {
        position: 'absolute',
        top: '4px',
        right: '8px',
        cursor: 'pointer',
        fontSize: '12px',
        color: '#888'
    });
    closeButton.addEventListener('click', hideChatGPTMenu);
    chatgptMenu.appendChild(closeButton);

    // === MAIN ACTION ===
    const askButton = document.createElement('div');
    askButton.innerText = 'שאל את ChatGPT';
    Object.assign(askButton.style, {
        marginTop: '12px',
        cursor: 'pointer',
        fontWeight: 'bold'
    });
    askButton.addEventListener('mouseenter', () => askButton.style.opacity = 0.8);
    askButton.addEventListener('mouseleave', () => askButton.style.opacity = 1);
    chatgptMenu.appendChild(askButton);

    // === MINIMAL THEME TOGGLE ===
    const themeToggle = document.createElement('div');
    themeToggle.innerText = currentTheme === 'dark' ? '☀️' : '🌙';
    Object.assign(themeToggle.style, {
        position: 'absolute',
        top: '3px',
        left: '10px',
        cursor: 'pointer',
        fontSize: '16px',
        opacity: '0.7',
        transition: 'opacity 0.2s ease'
    });

    themeToggle.addEventListener('mouseenter', () => themeToggle.style.opacity = '1');
    themeToggle.addEventListener('mouseleave', () => themeToggle.style.opacity = '0.7');

    themeToggle.addEventListener('click', () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setCookie('chatgpt_theme', currentTheme, 365);
        themeToggle.innerText = currentTheme === 'dark' ? '☀️' : '🌙';
        applyTheme(currentTheme, true);
    });

    chatgptMenu.appendChild(themeToggle);
    document.body.appendChild(chatgptMenu);

    // === STATE ===
    let selectedText = '';

    // === FUNCTIONS ===
    function showChatGPTMenu(x, y) {
        chatgptMenu.style.top = y + 'px';
        chatgptMenu.style.left = x + 'px';
        chatgptMenu.style.display = 'block';
        setTimeout(() => {
            chatgptMenu.style.opacity = 1;
            chatgptMenu.style.transform = 'translateY(0) scale(1)';
        }, 10);
    }

    function hideChatGPTMenu() {
        chatgptMenu.style.opacity = 0;
        chatgptMenu.style.transform = 'translateY(20px) scale(0.95)';
        setTimeout(() => chatgptMenu.style.display = 'none', 250);
    }

    // === EVENTS ===

    // Show menu with Shift + Q
    document.addEventListener('keydown', event => {
        if (event.shiftKey && event.key.toLowerCase() === 'q') {
            selectedText = window.getSelection().toString().trim();
            if (selectedText) {
                const rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
                showChatGPTMenu(rect.right + window.scrollX, rect.bottom + window.scrollY);
            }
        }
    });

    // Hide menu when clicking outside
    document.addEventListener('click', event => {
        if (!chatgptMenu.contains(event.target)) hideChatGPTMenu();
    });

    // Open ChatGPT with selected text
    askButton.addEventListener('click', () => {
        if (selectedText) {
            const url = 'https://chat.openai.com/?q=' + encodeURIComponent(selectedText);
            window.open(url, '_blank', 'width=600,height=400');
        }
        hideChatGPTMenu();
    });

})();
