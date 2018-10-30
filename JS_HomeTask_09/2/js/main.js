var block = document.querySelector('h1');

var offset = getComputedStyle(block).top;

window.addEventListener('scroll', function(event) {
    if (block.getBoundingClientRect().top <= 0) {
        block.classList.add('fixed');
        block.classList.remove('not-fixed');
    }
    if (window.scrollY <= 500) {
        block.classList.remove('fixed');
        block.classList.add('not-fixed');
    }
})