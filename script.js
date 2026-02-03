const btnNu = document.getElementById('btn-nu');
const btnDa = document.getElementById('btn-da');
const card = document.getElementById('proposal-card');
const successFlow = document.getElementById('success-flow');
const loveMeter = document.getElementById('love-meter');
const lovePercentText = document.getElementById('love-percent');
const statusText = document.getElementById('status-text');
const finalMsg = document.getElementById('final-message');
const tooltip = document.getElementById('tooltip');

let nuAttempts = 0;
const messages = [
    'Nici o șansă! 😜',
    'Ești rapidă, dar eu sunt mai rapid!',
    'Butonul acesta e doar de decor...',
    'Eroare 404: Refuzul nu a fost găsit',
    'Mai încearcă... sau nu! 😂',
    'Ești pe aproape! (Glumesc)'
];

const statuses = [
    'Se procesează răspunsul...',
    'Se verifică compatibilitatea...',
    'Se rezervă locul, ești în queue locul 5...'
];

// --- Trolling Logic ---

function moveButton() {
    nuAttempts++;

    if (btnNu.parentElement !== document.body) {
        document.body.appendChild(btnNu);
    }

    btnNu.style.position = 'fixed';
    btnNu.style.margin = '0';
    btnNu.style.transition = 'all 0.15s ease-out';

    const btnWidth = btnNu.offsetWidth;
    const btnHeight = btnNu.offsetHeight;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const margin = 50;
    const maxX = vw - btnWidth - margin;
    const maxY = vh - btnHeight - margin;

    let newX = Math.random() * (maxX - margin) + margin;
    let newY = Math.random() * (maxY - margin) + margin;

    newX = Math.max(margin, Math.min(newX, maxX));
    newY = Math.max(margin, Math.min(newY, maxY));

    btnNu.style.left = `${newX}px`;
    btnNu.style.top = `${newY}px`;
    btnNu.style.zIndex = '10000';

    if (nuAttempts % 3 === 0) {
        showTooltip();
    } else {
        tooltip.classList.add('hidden');
    }
}

function showTooltip() {
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    tooltip.textContent = randomMsg;
    tooltip.classList.remove('hidden');

    if (tooltip.parentElement !== document.body) {
        document.body.appendChild(tooltip);
    }

    const rect = btnNu.getBoundingClientRect();
    tooltip.style.left = `${rect.left}px`;
    tooltip.style.top = `${rect.top - 45}px`;
    tooltip.style.zIndex = '10001';
}

// Desktop: Mouse Enter
btnNu.addEventListener('mouseenter', moveButton);

// Mobile: Touch/Click
btnNu.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveButton();
});

btnNu.addEventListener('click', (e) => {
    moveButton();
});

// --- Success Flow ---

btnDa.addEventListener('click', () => {
    btnNu.style.display = 'none';
    tooltip.style.display = 'none';

    card.classList.add('hidden');
    successFlow.classList.remove('hidden');
    document.body.classList.add('zoom-effect');
    startLoveMeter();
});

function startLoveMeter() {
    let progress = 0;
    const duration = 10000; // 10 seconds
    const intervalTime = 100;
    const increment = 100 / (duration / intervalTime);

    const interval = setInterval(() => {
        progress += increment;

        if (progress >= 99) {
            progress = 99;
            clearInterval(interval);

            setTimeout(() => {
                showFakeError();
            }, 1000);
        }

        loveMeter.style.width = `${progress}%`;
        lovePercentText.textContent = `${Math.floor(progress)}%`;

        let statusIdx = 0;
        if (progress > 33) statusIdx = 1;
        if (progress > 66) statusIdx = 2;
        statusText.textContent = statuses[statusIdx];
    }, intervalTime);
}

function showFakeError() {
    statusText.textContent = "Eroare: Nu am găsit loc disponibil...";
    statusText.style.color = "#ff4d4d";

    setTimeout(() => {
        statusText.textContent = "Dar pentru tine facem oricând! ❤️";
        statusText.style.color = "white";

        setTimeout(() => {
            loveMeter.style.width = '100%';
            lovePercentText.textContent = '100%';
            celebrate();
        }, 1500);
    }, 2000);
}

function celebrate() {
    // Reveal the whole final content (image + text)
    const finalContent = document.getElementById('final-content');
    if (finalContent) {
        finalContent.classList.remove('hidden');
    }

    // Hide progress elements for cleaner look
    loveMeter.parentElement.style.display = 'none';
    lovePercentText.style.display = 'none';
    statusText.style.display = 'none';

    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            shapes: ['heart'],
            colors: ['#ff007f', '#ff4d94', '#ffffff']
        });
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            shapes: ['heart'],
            colors: ['#ff007f', '#ff4d94', '#ffffff']
        });
    }, 250);
}
