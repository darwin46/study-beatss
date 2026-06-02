/* ===========================
   script.js — Study Beats + Teknik Belajar
   =========================== */

const MOODS = {
    'Lo-Fi':      { track: 'Lo-Fi Study Beats',  color: 'linear-gradient(45deg,#a78bfa,#7c3aed)', page: 'mood/lofi.html' },
    'Deep Focus': { track: 'Deep Focus Flow',     color: 'linear-gradient(45deg,#60a5fa,#2563eb)', page: 'mood/deepfocus.html' },
    'Classical':  { track: 'Classical for Work',  color: 'linear-gradient(45deg,#fbbf24,#d97706)', page: 'mood/classical.html' },
    'Ambient':    { track: 'Rainy Days Ambient',  color: 'linear-gradient(45deg,#34d399,#059669)', page: 'mood/ambient.html' },
    'Chillhop':   { track: 'Chillhop Essentials', color: 'linear-gradient(45deg,#fb7185,#e11d48)', page: 'mood/chillhop.html' },
};

const TECHNIQUES = [
    {
        id: 'pomodoro',
        emoji: '🍅',
        name: 'Pomodoro',
        desc: 'Fokus 25 menit, istirahat 5 menit',
        focus: 25, break: 5,
        color: '#ef4444',
        tip: 'Teknik paling populer! Cocok untuk tugas yang bisa dibagi-bagi.'
    },
    {
        id: 'deepwork',
        emoji: '🧠',
        name: 'Deep Work',
        desc: 'Fokus 90 menit tanpa jeda',
        focus: 90, break: 20,
        color: '#6366f1',
        tip: 'Untuk tugas kompleks yang butuh konsentrasi penuh tanpa distraksi.'
    },
    {
        id: 'spaced',
        emoji: '🔁',
        name: 'Spaced Learning',
        desc: 'Belajar 20 menit, istirahat 40 menit',
        focus: 20, break: 40,
        color: '#10b981',
        tip: 'Efektif untuk hafalan — otak butuh jeda untuk konsolidasi memori.'
    },
    {
        id: 'ultradian',
        emoji: '⚡',
        name: 'Ultradian',
        desc: 'Ikuti ritme alami tubuh 90-120 menit',
        focus: 100, break: 20,
        color: '#f59e0b',
        tip: 'Berbasis ritme biologis tubuh. Maksimalkan energi alami kamu.'
    },
    {
        id: 'timeblock',
        emoji: '🎯',
        name: 'Time Blocking',
        desc: 'Blok waktu khusus per topik, 50 menit',
        focus: 50, break: 10,
        color: '#8b5cf6',
        tip: 'Ideal untuk jadwal padat — setiap sesi punya topik spesifik.'
    },
];

let activeMood     = null;
let selectedMood   = null;
let timerInterval  = null;
let timeLeft       = 0;
let timerPhase     = 'focus'; // 'focus' | 'break'
let activeTechnique = null;
let timerRunning   = false;
let sessionCount   = 0;

// ──────────────────────────────────────────────
//  DROPDOWN
// ──────────────────────────────────────────────
function toggleDropdown() {
    const menu    = document.getElementById('dropdownMenu');
    const chevron = document.getElementById('chevronIcon');
    const isOpen  = menu.classList.contains('open');
    menu.classList.toggle('open', !isOpen);
    chevron.classList.toggle('open', !isOpen);
}

function initDropdown() {
    const logoBtn = document.getElementById('logoBtn');
    if (!logoBtn) return;
    logoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown();
    });
}

document.addEventListener('click', (e) => {
    const wrapper = document.querySelector('.logo-dropdown');
    if (wrapper && !wrapper.contains(e.target)) {
        document.getElementById('dropdownMenu')?.classList.remove('open');
        document.getElementById('chevronIcon')?.classList.remove('open');
    }
    if (e.target.id === 'techniqueModal') closeTechniqueModal();
});

// ── PILIH MOOD DARI DROPDOWN → tampilkan popup teknik ──
function selectMood(e, mood) {
    e.preventDefault();
    closeDropdown();
    selectedMood = mood;
    showTechniqueModal(mood);
}

function closeDropdown() {
    document.getElementById('dropdownMenu')?.classList.remove('open');
    document.getElementById('chevronIcon')?.classList.remove('open');
}

// ──────────────────────────────────────────────
//  POPUP TEKNIK BELAJAR
// ──────────────────────────────────────────────
function showTechniqueModal(mood) {
    document.getElementById('techniqueModal')?.remove();

    const data = MOODS[mood];
    const modal = document.createElement('div');
    modal.id = 'techniqueModal';
    modal.innerHTML = `
        <div class="tm-backdrop"></div>
        <div class="tm-box">
            <div class="tm-header">
                <div class="tm-cover" style="background:${data.color}">
                    <i class="fas fa-music"></i>
                </div>
                <div class="tm-info">
                    <div class="tm-mood">${mood}</div>
                    <div class="tm-subtitle">Pilih teknik belajarmu</div>
                </div>
                <button class="tm-close" onclick="closeTechniqueModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="tm-techniques">
                ${TECHNIQUES.map(t => `
                <div class="tm-card" onclick="selectTechnique('${t.id}', '${mood}')">
                    <div class="tm-card-icon" style="background:${t.color}22;color:${t.color}">
                        ${t.emoji}
                    </div>
                    <div class="tm-card-info">
                        <div class="tm-card-name">${t.name}</div>
                        <div class="tm-card-desc">${t.desc}</div>
                    </div>
                    <div class="tm-card-badge">
                        <span>${t.focus}m</span>
                    </div>
                </div>`).join('')}
            </div>

            <div class="tm-footer">
                <button class="tm-skip" onclick="skipTechnique('${mood}')">
                    <i class="fas fa-music"></i> Langsung dengarkan saja
                </button>
            </div>
        </div>`;
    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.querySelector('.tm-box').classList.add('tm-open'));
}

function closeTechniqueModal() {
    const modal = document.getElementById('techniqueModal');
    if (!modal) return;
    modal.querySelector('.tm-box')?.classList.remove('tm-open');
    setTimeout(() => modal.remove(), 300);
}

function selectTechnique(techId, mood) {
    const tech = TECHNIQUES.find(t => t.id === techId);
    activeTechnique = tech;
    closeTechniqueModal();
    applyMood(mood);
    setTimeout(() => {
        sessionStorage.setItem('activeTechnique', JSON.stringify(tech));
        window.location.href = MOODS[mood].page;
    }, 400);
}

function skipTechnique(mood) {
    closeTechniqueModal();
    applyMood(mood);
    setTimeout(() => {
        sessionStorage.removeItem('activeTechnique');
        window.location.href = MOODS[mood].page;
    }, 300);
}

// ──────────────────────────────────────────────
//  APPLY MOOD
// ──────────────────────────────────────────────
function applyMood(mood) {
    activeMood = mood;
    const data = MOODS[mood];

    document.querySelectorAll('.dropdown-card').forEach(card => {
        card.classList.toggle('active-mood', card.querySelector('strong')?.textContent === mood);
    });

    const footer = document.getElementById('activeMoodLabel');
    if (footer) footer.textContent = `Mood aktif: ${mood}`;

    const badge = document.getElementById('moodBadgeHeader');
    const badgeText = document.getElementById('moodBadgeText');
    if (badge && badgeText) {
        badge.style.display = 'flex';
        badgeText.textContent = mood;
    }

    document.querySelectorAll('.category-card').forEach(card => {
        card.classList.toggle('selected', card.querySelector('h3')?.textContent === mood);
    });

    const nameEl  = document.getElementById('playerTrackName');
    const moodEl  = document.getElementById('playerTrackMood');
    const coverEl = document.getElementById('trackCover');
    if (nameEl)  nameEl.textContent  = data.track;
    if (moodEl)  moodEl.textContent  = `Mood — ${mood}`;
    if (coverEl) coverEl.style.background = data.color;
}

// ──────────────────────────────────────────────
//  SMOOTH SCROLL + PLAYER + SEARCH
// ──────────────────────────────────────────────
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function initPlayerControls() {
    const playBtn = document.querySelector('.play-pause');
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            const icon = playBtn.querySelector('i');
            icon.classList.toggle('fa-pause');
            icon.classList.toggle('fa-play');
        });
    }
}

function initProgressBars() {
    document.querySelectorAll('.progress-container').forEach(container => {
        container.addEventListener('click', (e) => {
            const bar  = container.querySelector('.progress-bar');
            const rect = container.getBoundingClientRect();
            const pct  = ((e.clientX - rect.left) / rect.width) * 100;
            if (bar) bar.style.width = Math.min(100, Math.max(0, pct)) + '%';
        });
    });
}

function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        const cards = document.querySelectorAll('.category-card');

        cards.forEach(card => {
            const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
            const text = title + ' ' + desc;
            card.style.display = query === '' || text.includes(query) ? 'block' : 'none';
        });
    });
}

function initProfilePanel() {
    const profileBtn = document.getElementById('profileBtn');
    const profilePanel = document.getElementById('profilePanel');
    const profileClose = document.getElementById('profileClose');
    const profileBackdrop = document.getElementById('profileBackdrop');
    if (!profileBtn || !profilePanel) return;

    const openPanel = () => profilePanel.classList.add('open');
    const closePanel = () => profilePanel.classList.remove('open');

    profileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openPanel();
    });
    if (profileClose) profileClose.addEventListener('click', closePanel);
    if (profileBackdrop) profileBackdrop.addEventListener('click', closePanel);
}

document.addEventListener('DOMContentLoaded', () => {
    initDropdown();
    initSearch();
    initProfilePanel();
    initSmoothScroll();
    initPlayerControls();
    initProgressBars();
});
