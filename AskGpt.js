javascript:(function() {
    // Create the main context menu container
    const chatgptMenu = document.createElement('div');
    chatgptMenu.id = 'chatgpt-context-menu';
    
    // Style the menu appearance
    Object.assign(chatgptMenu.style, {
        position: 'absolute',
        color: '#000',
        background: '#fff',
        border: '1px solid #ccc',
        padding: '8px 12px 12px 12px',
        borderRadius: '5px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        cursor: 'pointer',
        display: 'none',
        zIndex: 99999,
        transition: 'opacity 0.3s, transform 0.3s',
        opacity: 0,
        transform: 'translateY(20px)',
        minWidth: '140px',
        fontFamily: 'Arial, sans-serif',
        direction: 'rtl'
    });

    // Create a small close button (✕)
    const closeButton = document.createElement('span');
    closeButton.innerHTML = '✕';
    Object.assign(closeButton.style, {
        position: 'absolute',
        top: '2px',
        right: '6px',
        cursor: 'pointer',
        fontSize: '12px',
        color: '#666'
    });
    closeButton.addEventListener('click', hideChatGPTMenu);
    chatgptMenu.appendChild(closeButton);

    // Create the clickable label
    const menuActionLabel = document.createElement('div');
    menuActionLabel.innerText = 'שאל את ChatGPT';
    menuActionLabel.style.marginTop = '10px';
    chatgptMenu.appendChild(menuActionLabel);

    // Add the menu to the document
    document.body.appendChild(chatgptMenu);

    // Store selected text
    let selectedText = '';

    /**
     * Displays the ChatGPT context menu at a given position
     * @param {number} x - The horizontal coordinate (in pixels)
     * @param {number} y - The vertical coordinate (in pixels)
     */
    function showChatGPTMenu(x, y) {
        chatgptMenu.style.top = y + 'px';
        chatgptMenu.style.left = x + 'px';
        chatgptMenu.style.display = 'block';
        setTimeout(() => {
            chatgptMenu.style.opacity = 1;
            chatgptMenu.style.transform = 'translateY(0)';
        }, 10);
    }

    /**
     * Hides the ChatGPT context menu with a smooth fade-out animation
     */
    function hideChatGPTMenu() {
        chatgptMenu.style.opacity = 0;
        chatgptMenu.style.transform = 'translateY(20px)';
        setTimeout(() => chatgptMenu.style.display = 'none', 300);
    }

    /**
     * When user presses Shift + Q:
     *  - Get selected text
     *  - Show context menu near the selection
     */
    document.addEventListener('keydown', event => {
        if (event.shiftKey && event.key.toLowerCase() === 'q') {
            selectedText = window.getSelection().toString().trim();
            if (selectedText) {
                const selectionRect = window.getSelection().getRangeAt(0).getBoundingClientRect();
                const posX = selectionRect.right + window.scrollX;
                const posY = selectionRect.bottom + window.scrollY;
                showChatGPTMenu(posX, posY);
            }
        }
    });

    /**
     * Hide menu when clicking anywhere outside of it
     */
    document.addEventListener('click', event => {
        if (!chatgptMenu.contains(event.target)) {
            hideChatGPTMenu();
        }
    });

    /**
     * When user clicks "Ask ChatGPT", open a new ChatGPT tab with the selected query
     */
    menuActionLabel.addEventListener('click', () => {
        if (selectedText) {
            const chatUrl = 'https://chat.openai.com/?q=' + encodeURIComponent(selectedText);
            window.open(chatUrl, '_blank', 'width=600,height=400');
        }
        hideChatGPTMenu();
    });
})();
