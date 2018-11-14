var menu = document.querySelector('.categories');
var btn = document.querySelector('.responsive-btn');

btn.addEventListener('click', function() {
    if (window.getComputedStyle(menu).display == 'none') {
        menu.style.display = 'block';
    } else {
        menu.style.display = 'none';
    }
})

window.addEventListener('resize', function() {
    if (this.window.innerWidth > 1070) {
        menu.style.display = 'block';
    } else {
        menu.style.display = 'none';
    }
})

document.addEventListener('click', function(e) {
    if (!e.target.classList.contains('responsive-btn') && window.innerWidth <= 1070) {
        menu.style.display = 'none';
    }
})