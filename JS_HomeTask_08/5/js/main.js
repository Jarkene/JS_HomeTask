var form = document.querySelector('form');

const patterns = {
    name: /^[a-zа-я\-\s\_]{3,20}$/i,
    phone: /^\+375\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/,
    email: /^[a-z0-9\_]{3,20}@[a-z]{3,10}\.[a-z]{2,5}$/i,
    site: /^[a-z0-9\_\-]{3,20}\.[a-z]{2,5}$/,
}

const msg = {
    correct: '&#10004',
    incorrect: '&#10008',
}

var valid = {
    name: false,
    phone: false,
    email: false,
    site: false,
}

form.addEventListener('input', function (event) {
    var target = event.target;
    if (target.tagName == 'INPUT') {
        var nextSibling = target.nextElementSibling
        if (target.value.search(patterns[target.id]) != -1) {
            nextSibling.innerHTML = msg.correct;
            nextSibling.classList.add('correct');
            nextSibling.classList.remove('incorrect');
            valid[target.id] = true;
        } else {
            nextSibling.classList.add('incorrect');
            nextSibling.classList.remove('correct');
            nextSibling.innerHTML = msg.incorrect;
            valid[target.id] = false;
        }
    }
})

form.addEventListener('submit', function (event) {
    var isFormValid = true;
    for (key in valid) {
        if (valid[key] == false) {
            isFormValid = false;
        }
    }
    isFormValid ? alert('Все поля заполнены верно') : alert('Не все поля заполнены верно');
})