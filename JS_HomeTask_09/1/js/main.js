var contextMenu = document.querySelector('.menu');
var blocks = document.querySelector('.blocks');

function callMenu(x, y) {
    contextMenu.style.left = x + 'px';
    contextMenu.style.top = y + 'px';
    contextMenu.style.display = 'block';
}

document.addEventListener('contextmenu', function (event) {
    callMenu(event.clientX, event.clientY);
    event.preventDefault();
})

document.addEventListener('click', function () {
    contextMenu.style.display = 'none';
})

var counter = 1;

contextMenu.children[0].addEventListener('click', function () {
    var h1 = document.createElement('h1');
    h1.innerHTML = `Block ${counter}`;
    counter++;
    blocks.appendChild(h1);
})

contextMenu.children[1].addEventListener('click', function () {
    if (blocks.children.length) {
        blocks.removeChild(blocks.children[blocks.children.length - 1]);
    }
})

contextMenu.children[2].addEventListener('click', function () {
    blocks.innerHTML = '';
})

blocks.addEventListener('contextmenu', function(event) {
    if (event.target.tagName == 'H1') {
        event.target.outerHTML = '';
    }
    event.stopPropagation();
    event.preventDefault();
})