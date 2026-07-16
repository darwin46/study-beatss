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

<<<<<<< HEAD
function syncPlayerOffset() {
    const player = document.querySelector('.player');
    const root = document.documentElement;
    const offset = player ? player.offsetHeight : 0;
    root.style.setProperty('--player-offset', `${offset}px`);
}

=======
>>>>>>> 90fbd99f37ac1f361ded4200d3f1391c729632ca
function initPlayerControls() {
    const player = document.querySelector('.player');
    const playBtn = document.querySelector('.play-pause');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const moodAudio = document.getElementById('moodAudio');

<<<<<<< HEAD
    syncPlayerOffset();
    window.addEventListener('resize', syncPlayerOffset);

    const updatePlayIcon = () => {
        setPlayPauseButtonState(playBtn, !!moodAudio && !moodAudio.paused);
=======
    const updatePlayIcon = () => {
        if (!playBtn) return;
        const icon = playBtn.querySelector('i');
        if (!icon) return;
        if (moodAudio && !moodAudio.paused) {
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
        } else {
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
        }
>>>>>>> 90fbd99f37ac1f361ded4200d3f1391c729632ca
    };

    const getCurrentSongIndex = () => {
        const currentTrack = sessionStorage.getItem('currentTrack');
        return ALL_SONGS.findIndex(item => item.file === currentTrack);
    };

    const playByOffset = (offset) => {
        const currentIndex = getCurrentSongIndex();
        const index = (currentIndex >= 0 ? currentIndex : 0) + offset;
        const next = ALL_SONGS[((index % ALL_SONGS.length) + ALL_SONGS.length) % ALL_SONGS.length];
        if (next) playHomeSong(next.mood, next.file, next.title);
    };

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if (!moodAudio) return;
            if (moodAudio.src && moodAudio.src !== '') {
                if (moodAudio.paused) {
<<<<<<< HEAD
                    moodAudio.play()
                        .then(() => updatePlayIcon())
                        .catch(error => {
                            console.log('Audio play blocked:', error);
                            updatePlayIcon();
                        });
=======
                    moodAudio.play().catch(error => console.log('Audio play blocked:', error));
>>>>>>> 90fbd99f37ac1f361ded4200d3f1391c729632ca
                } else {
                    moodAudio.pause();
                }
            }
            updatePlayIcon();
<<<<<<< HEAD
            if (player) {
                player.classList.add('active');
                syncPlayerOffset();
            }
=======
            if (player) player.classList.add('active');
>>>>>>> 90fbd99f37ac1f361ded4200d3f1391c729632ca
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => playByOffset(-1));
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => playByOffset(1));
    }

    if (moodAudio) {
        moodAudio.addEventListener('play', () => {
<<<<<<< HEAD
            if (player) {
                player.classList.add('active');
                requestAnimationFrame(syncPlayerOffset);
            }
=======
            if (player) player.classList.add('active');
>>>>>>> 90fbd99f37ac1f361ded4200d3f1391c729632ca
            updatePlayIcon();
            sessionStorage.setItem('wasPlaying', 'true');
            sessionStorage.setItem('playerActive', 'true');
        });
        moodAudio.addEventListener('pause', () => {
            updatePlayIcon();
            sessionStorage.setItem('wasPlaying', 'false');
            if (moodAudio) sessionStorage.setItem('currentTime', moodAudio.currentTime.toString());
        });
        moodAudio.addEventListener('ended', () => {
            updatePlayIcon();
            sessionStorage.setItem('wasPlaying', 'false');
        });
    }
}

function initProgressBars() {
    const moodAudio = document.getElementById('moodAudio');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const currentTimeEl = document.getElementById('currentTime');
    const durationTimeEl = document.getElementById('durationTime');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeBtn = document.getElementById('volumeBtn');
    const volumeLabel = document.getElementById('volumeLabel');

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60) || 0;
        const secs = Math.floor(seconds % 60) || 0;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (progressBar) {
        progressBar.style.width = '0%';
    }

    if (moodAudio && progressBar) {
        moodAudio.addEventListener('timeupdate', () => {
            if (moodAudio.duration && !isNaN(moodAudio.duration)) {
                const percent = (moodAudio.currentTime / moodAudio.duration) * 100;
                progressBar.style.width = `${Math.min(100, Math.max(0, percent))}%`;
                if (currentTimeEl) currentTimeEl.textContent = formatTime(moodAudio.currentTime);
                if (durationTimeEl) durationTimeEl.textContent = formatTime(moodAudio.duration);
                sessionStorage.setItem('currentTime', moodAudio.currentTime.toString());
            }
        });

        moodAudio.addEventListener('loadedmetadata', () => {
            if (durationTimeEl && moodAudio.duration && !isNaN(moodAudio.duration)) {
                durationTimeEl.textContent = formatTime(moodAudio.duration);
            }
        });
    }

    if (progressContainer && moodAudio) {
        progressContainer.addEventListener('click', (e) => {
            const rect = progressContainer.getBoundingClientRect();
            const pct = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100)) / 100;
            if (moodAudio.duration && !isNaN(moodAudio.duration)) {
                moodAudio.currentTime = moodAudio.duration * pct;
            }
        });
    }

    if (volumeSlider && moodAudio) {
        volumeSlider.addEventListener('input', () => {
            const value = Number(volumeSlider.value);
            moodAudio.volume = value / 100;
            if (volumeLabel) volumeLabel.textContent = `${value}%`;
            if (volumeBtn) {
                const icon = volumeBtn.querySelector('i');
                if (icon) {
                    icon.className = value === 0 ? 'fas fa-volume-mute' : 'fas fa-volume-up';
                }
            }
        });
        volumeSlider.dispatchEvent(new Event('input'));
    }

    if (volumeBtn && moodAudio) {
        volumeBtn.addEventListener('click', () => {
            moodAudio.muted = !moodAudio.muted;
            const value = Math.round((moodAudio.volume || 0) * 100);
            if (volumeBtn) {
                const icon = volumeBtn.querySelector('i');
                if (icon) {
                    icon.className = moodAudio.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
                }
            }
            if (volumeLabel) volumeLabel.textContent = moodAudio.muted ? 'Muted' : `${value}%`;
        });
    }
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
    const profileMenu = document.getElementById('profileMenu');
    const profilePanel = document.getElementById('profilePanel');
    const profileClose = document.getElementById('profileClose');
    const profileBackdrop = document.getElementById('profileBackdrop');
    const logoutMenuBtn = document.getElementById('logoutMenuBtn');
    if (!profileBtn) return;

    const closeMenu = () => profileMenu?.classList.remove('open');
    const doLogout = () => {
        localStorage.removeItem('loggedInUser');
        sessionStorage.removeItem('playerActive');
        sessionStorage.removeItem('currentMood');
        sessionStorage.removeItem('currentTrack');
        window.location.href = 'login.html';
    };

    profileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        profileMenu?.classList.toggle('open');
    });

<<<<<<< HEAD
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.profile-menu-wrapper')) {
            closeMenu();
        }
    });
=======
    document.addEventListener('click', closeMenu);
>>>>>>> 90fbd99f37ac1f361ded4200d3f1391c729632ca
    profileMenu?.addEventListener('click', (e) => e.stopPropagation());
    profileMenu?.querySelector('a')?.addEventListener('click', closeMenu);
    logoutMenuBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeMenu();
        doLogout();
    });

    if (profilePanel && profileClose) profileClose.addEventListener('click', () => profilePanel.classList.remove('open'));
    if (profilePanel && profileBackdrop) profileBackdrop.addEventListener('click', () => profilePanel.classList.remove('open'));
}

const FAVORITES_STORAGE_KEY = 'studyBeatsFavorites';

// CLASS + ENCAPSULATION: FAVORITEMANAGER MENGGABUNGKAN STATE, DATA, DAN LOGIKA PENYIMPANAN FAVORIT MENJADI SATU UNIT YANG TERATUR.
class FavoriteManager {
    constructor(storageKey = FAVORITES_STORAGE_KEY) {
        this.storageKey = storageKey;
        this.items = this.read();
    }

    read() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        } catch (error) {
            return [];
        }
    }

    persist() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.items));
        window.dispatchEvent(new CustomEvent('favorites:updated', { detail: this.items }));
    }

    getItems() {
        return this.items;
    }

    // Abstraction: UI cukup memanggil metode publik ini, detail penyimpanan dan pemrosesan disembunyikan di balik class.
    add(item) {
        const exists = this.items.some(existing => existing.mood === item.mood && existing.file === item.file);
        if (!exists) {
            this.items.push(item);
            this.persist();
        }
    }

    remove(item) {
        this.items = this.items.filter(existing => !(existing.mood === item.mood && existing.file === item.file));
        this.persist();
    }

    // POLYMORPHISM: METODE RENDER INI BISA MENANGANI DUA KEADAAN BERBEDA (KOSONG ATAU BERISI) DENGAN INTERFACE YANG SAMA.
    render(listElement) {
        if (!listElement) return;

        if (!this.items.length) {
            listElement.innerHTML = '<li class="favorite-sidebar-empty">Belum ada lagu yang kamu love. Coba kasih love di halaman search, lalu lagu itu akan muncul di sini.</li>';
            return;
        }

        listElement.innerHTML = this.items.map(item => {
            const cover = HOME_MOOD_IMAGES[item.mood] || item.cover || '';
            return `
            <li class="favorite-sidebar-item favorite-item-with-image">
                <a href="search.html?mood=${encodeURIComponent(item.mood)}">
                    <div class="favorite-item-cover">
                        <img src="${cover}" alt="${item.mood} cover">
                    </div>
                    <div class="favorite-item-text">
                        <strong>${item.title || item.mood}</strong>
                        <span>${item.mood} • ${item.file}</span>
                    </div>
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        `;
        }).join('');
    }
}

const favoriteManager = new FavoriteManager();

const ALL_SONGS = [
    { mood: 'Lo-Fi', file: 'lofi.mp3', title: 'Lo-Fi Study Beats' },
    { mood: 'Deep Focus', file: 'deep focus.mp3', title: 'Deep Focus Flow' },
    { mood: 'Classical', file: 'classical.mp3', title: 'Classical for Work' },
    { mood: 'Ambient', file: 'ambient.mp3', title: 'Rainy Days Ambient' },
    { mood: 'Chillhop', file: 'chillhop.mp3', title: 'Chillhop Essentials' }
];

const HOME_SONG_URLS = {
    'lofi.mp3': 'https://res.cloudinary.com/dx4bwoci7/video/upload/v1780369770/lofi_p1gtxq.mp3',
    'deep focus.mp3': 'https://res.cloudinary.com/dx4bwoci7/video/upload/v1780369785/deep_focus_kzjznv.mp3',
    'classical.mp3': 'https://res.cloudinary.com/dx4bwoci7/video/upload/v1780370303/Classical_Music_for_Studying_Working_Focusing_Concentrating_1_Hour_u3rnc9.mp3',
    'ambient.mp3': 'https://res.cloudinary.com/dx4bwoci7/video/upload/v1780369894/ambient_qjeavr.mp3',
    'chillhop.mp3': 'https://res.cloudinary.com/dx4bwoci7/video/upload/v1780369833/chillhop_vzsmxv.mp3'
};

const HOME_MOOD_IMAGES = {
    'Lo-Fi': 'lofi img.jpg',
    'Deep Focus': 'deep focus img.jpeg',
    'Classical': 'clasical img.jpeg',
    'Ambient': 'ambient.jpeg',
    'Chillhop': 'chillhop img.jpg'
};

<<<<<<< HEAD
function setPlayPauseButtonState(button, isPlaying) {
    if (!button) return;
    const icon = button.querySelector('i');
    if (!icon) return;
    icon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
}

const HISTORY_STORAGE_KEY = 'studyBeatsPlaybackHistory';

function getStoredPlaybackHistory() {
    try {
        return JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY) || '[]');
    } catch (error) {
        return [];
    }
}

function persistPlaybackHistoryToStorage(historyEntries) {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(historyEntries));
}

function addToPlaybackHistory(moodName, fileName, title = '') {
    const playbackHistory = getStoredPlaybackHistory();
    const entry = {
        mood: moodName,
        file: fileName,
        title: title || fileName,
        cover: HOME_MOOD_IMAGES[moodName] || '',
        time: new Date().toISOString()
    };

    const nextHistory = [...playbackHistory];
    const existingIndex = nextHistory.findIndex(item => item.mood === moodName && item.file === fileName);
    if (existingIndex >= 0) {
        nextHistory.splice(existingIndex, 1);
    }

    nextHistory.unshift(entry);
    persistPlaybackHistoryToStorage(nextHistory.slice(0, 8));
}

=======
>>>>>>> 90fbd99f37ac1f361ded4200d3f1391c729632ca
function playHomeSong(mood, file, title) {
    const moodAudio = document.getElementById('moodAudio');
    const moodAudioSource = document.getElementById('moodAudioSource');
    const playerTrackName = document.getElementById('playerTrackName');
    const playerTrackMood = document.getElementById('playerTrackMood');
    const trackCover = document.getElementById('trackCover');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const player = document.querySelector('.player');
    if (!moodAudio || !moodAudioSource) return;

    const fileSrc = HOME_SONG_URLS[file] || file;
    moodAudioSource.src = fileSrc;
    moodAudio.src = fileSrc;
    moodAudio.load();

    if (playerTrackName) playerTrackName.textContent = title || mood;
    if (playerTrackMood) playerTrackMood.textContent = `— ${file}`;
    if (trackCover) trackCover.src = HOME_MOOD_IMAGES[mood] || '';
<<<<<<< HEAD
    if (player) {
        player.classList.add('active');
        syncPlayerOffset();
    }
    setPlayPauseButtonState(playPauseBtn, false);

    moodAudio.play()
        .then(() => setPlayPauseButtonState(playPauseBtn, true))
        .catch(error => {
            console.log('Audio play blocked:', error);
            setPlayPauseButtonState(playPauseBtn, false);
        });
    addToPlaybackHistory(mood, file, title || file);
=======
    if (player) player.classList.add('active');
    if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';

    moodAudio.play().catch(error => console.log('Audio play blocked:', error));
>>>>>>> 90fbd99f37ac1f361ded4200d3f1391c729632ca
    sessionStorage.setItem('playerActive', 'true');
    sessionStorage.setItem('currentMood', mood);
    sessionStorage.setItem('currentTrack', file);
    sessionStorage.setItem('wasPlaying', 'true');
}

function readFavoriteSongs() {
    return favoriteManager.getItems();
}

// Favorite: menampilkan daftar lagu yang sudah disimpan sebagai favorit di sidebar home.
function renderFavoriteSidebar() {
    const list = document.getElementById('homeFavoritesList');
    favoriteManager.items = favoriteManager.read();
    favoriteManager.render(list);
}

function isSongFavorited(mood, file) {
    return favoriteManager.getItems().some(item => item.mood === mood && item.file === file);
}

function toggleSongFavorite(mood, file, title) {
    if (isSongFavorited(mood, file)) {
        favoriteManager.remove({ mood, file });
    } else {
        favoriteManager.add({ mood, file, title });
    }
    renderFavoriteSidebar();
    renderAllSongsSidebar();
}

function renderAllSongsSidebar() {
    const list = document.getElementById('homeSongsList');
    if (!list) return;
    list.innerHTML = ALL_SONGS.map(item => {
        const active = isSongFavorited(item.mood, item.file) ? 'active' : '';
        const icon = isSongFavorited(item.mood, item.file) ? 'fas fa-heart' : 'far fa-heart';
        return `
        <li class="favorite-sidebar-item song-sidebar-item">
            <div class="song-row">
                <button type="button" class="song-love-button ${active}" data-mood="${item.mood}" data-file="${item.file}" data-title="${item.title}" aria-label="Tambah ke favorit">
                    <i class="${icon}"></i>
                </button>
                <button type="button" class="song-play-button" data-mood="${item.mood}" data-file="${item.file}" data-title="${item.title}">
                    <div>
                        <strong>${item.title}</strong>
                        <span>${item.mood} • ${item.file}</span>
                    </div>
                    <i class="fas fa-play"></i>
                </button>
            </div>
        </li>`;
    }).join('');

    list.querySelectorAll('.song-love-button').forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            const mood = button.dataset.mood;
            const file = button.dataset.file;
            const title = button.dataset.title;
            toggleSongFavorite(mood, file, title);
        });
    });

    list.querySelectorAll('.song-play-button').forEach(button => {
        button.addEventListener('click', () => {
            const mood = button.dataset.mood;
            const file = button.dataset.file;
            const title = button.dataset.title;
            playHomeSong(mood, file, title);
        });
    });
}

function initFavoriteSidebar() {
    renderFavoriteSidebar();
    renderAllSongsSidebar();
    window.addEventListener('favorites:updated', renderFavoriteSidebar);
    window.addEventListener('storage', (event) => {
        if (event.key === FAVORITES_STORAGE_KEY) {
            renderFavoriteSidebar();
        }
    });
}

function initSongSidebar() {
    renderAllSongsSidebar();
}

document.addEventListener('DOMContentLoaded', () => {
    initDropdown();
    initSearch();
    initProfilePanel();
    initSmoothScroll();
    initPlayerControls();
    initProgressBars();
    initFavoriteSidebar();
});
