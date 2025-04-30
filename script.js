const themeSwitch = document.getElementById('theme-switch');
const prefersDarkTheme = window.matchMedia('(prefers-color-scheme: dark)');

const initializeTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkTheme.matches)) {
        document.body.setAttribute('data-theme', 'dark');
        themeSwitch.checked = true;
    } else {
        document.body.removeAttribute('data-theme');
        themeSwitch.checked = false;
    }
};

themeSwitch.addEventListener('change', () => {
    if (themeSwitch.checked) {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    }
});

prefersDarkTheme.addEventListener('change', (event) => {
    if (!localStorage.getItem('theme')) {
        if (event.matches) {
            document.body.setAttribute('data-theme', 'dark');
            themeSwitch.checked = true;
        } else {
            document.body.removeAttribute('data-theme');
            themeSwitch.checked = false;
        }
    }
});

const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        button.classList.add('active');
        const tabId = `${button.dataset.tab}-tab`;
        document.getElementById(tabId).classList.add('active');
    });
});

const textInput = document.getElementById('text-input');
const hashOutput = document.getElementById('hash-output');
const copyBtn = document.getElementById('copy-btn');

textInput.addEventListener('input', () => {
    if (textInput.value.trim() === '') {
        hashOutput.value = '';
        return;
    }
    
    const hash = sha256(textInput.value);
    hashOutput.value = hash;
});

copyBtn.addEventListener('click', async () => {
    if (!hashOutput.value) return;
    
    try {
        await navigator.clipboard.writeText(hashOutput.value);
        
        // Visual feedback for copy
        const originalSvg = copyBtn.innerHTML;
        copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg>';
        copyBtn.style.color = 'var(--success-color)';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalSvg;
            copyBtn.style.color = '';
        }, 1500);
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
});

const verifyText = document.getElementById('verify-text');
const verifyHash = document.getElementById('verify-hash');
const resultIndicator = document.getElementById('result-indicator');
const verificationMessage = document.getElementById('verification-message');

const updateVerification = () => {
    const text = verifyText.value.trim();
    const hash = verifyHash.value.trim();
    
    if (!text || !hash) {
        resultIndicator.className = '';
        verificationMessage.textContent = 'Enter both text and hash to verify';
        return;
    }
    
    const generatedHash = sha256(text);
    
    if (generatedHash === hash) {
        resultIndicator.className = 'success';
        verificationMessage.textContent = 'Hash verification successful! The text matches the provided hash.';
    } else {
        resultIndicator.className = 'error';
        verificationMessage.textContent = 'Hash verification failed. The text does not match the provided hash.';
    }
};

verifyText.addEventListener('input', updateVerification);
verifyHash.addEventListener('input', updateVerification);

const prefillExample = () => {
    const exampleText = "Password@123";
    const exampleHash = sha256(exampleText);
    
    verifyHash.value = exampleHash;
    verifyText.value = exampleText;
    updateVerification();
};

document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    prefillExample();
}); 