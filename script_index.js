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

document.addEventListener('click', (e) => {
    const wrapper = document.querySelector('.logo-dropdown');
    if (wrapper && !wrapper.contains(e.target)) {
        document.getElementById('dropdownMenu')?.classList.remove('open');
        document.getElementById('chevronIcon')?.classList.remove('open');
    }
});