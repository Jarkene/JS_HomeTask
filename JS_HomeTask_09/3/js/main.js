var menu = document.querySelector('.menu');

menu.addEventListener('click', function(event) {
    var dropdownList = event.target.parentNode.children[1];
    dropdownList.classList.toggle('visible');
})

menu.addEventListener('focusout', function(event) {
    var dropdownList = event.target.parentNode.children[1];
    dropdownList.classList.remove('visible');
})