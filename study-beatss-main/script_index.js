function toggleDropdown() {
    const menu    = document.getElementById('dropdownMenu');
    const chevron = document.getElementById('chevronIcon');
    const isOpen  = menu.classList.contains('open');
    menu.classList.toggle('open', !isOpen);
    chevron.classList.toggle('open', !isOpen);
}

const logoBtn = document.getElementById('logoBtn');
if (logoBtn) {
    logoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown();
    });
}

const playBtn = document.querySelector('.play-pause');
const player = document.querySelector('.player');
if (playBtn) {
    playBtn.addEventListener('click', () => {
        if (player) player.classList.add('active');
        const icon = playBtn.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-pause');
            icon.classList.toggle('fa-play');
        }
    });
}

function showAuthPrompt(event, type) {
    if (event) event.preventDefault();
    const banner = document.getElementById('authBanner');
    const title = document.getElementById('authBannerTitle');
    const message = document.getElementById('authBannerMessage');
    const mainBtn = document.getElementById('authMainBtn');
    const switchLink = document.getElementById('authSwitchLink');
    const switchText = document.getElementById('authSwitchText');
    if (!banner || !title || !message || !mainBtn || !switchLink || !switchText) return;
    banner.classList.add('show');
    if (type === 'login') {
        title.textContent = 'Masuk ke Study Beats';
        message.textContent = 'Masuk untuk melanjutkan sesi dan menyimpan playlist favoritmu.';
        mainBtn.textContent = 'Login';
        mainBtn.href = 'login.html';
        switchText.textContent = 'Belum punya akun?';
        switchLink.textContent = 'Daftar';
        switchLink.href = 'daftar.html';
    } else {
        title.textContent = 'Daftar gratis sekarang';
        message.textContent = 'Buat akun gratis untuk menyimpan lagu favorit dan melanjutkan sesi kapan saja.';
        mainBtn.textContent = 'Daftar Gratis';
        mainBtn.href = 'daftar.html';
        switchText.textContent = 'Sudah punya akun?';
        switchLink.textContent = 'Login';
        switchLink.href = 'login.html';
    }
}

const authBannerClose = document.getElementById('authBannerClose');
if (authBannerClose) {
    authBannerClose.addEventListener('click', () => {
        document.getElementById('authBanner')?.classList.remove('show');
    });
}

document.addEventListener('click', (e) => {
    const wrapper = document.querySelector('.logo-dropdown');
    if (wrapper && !wrapper.contains(e.target)) {
        document.getElementById('dropdownMenu')?.classList.remove('open');
        document.getElementById('chevronIcon')?.classList.remove('open');
    }
});