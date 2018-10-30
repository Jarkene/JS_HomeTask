var menu = document.querySelector('.menu');

menu.addEventListener('mouseup', function(event) {
    if (event.target.children.length) {
        var childItem = event.target.firstElementChild;
        if (getComputedStyle(childItem).display == 'none') {
            childItem.style.display = 'block';
        } else {
            childItem.style.display = 'none';
        }
    }
})