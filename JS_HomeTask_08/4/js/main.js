const memoryScreen = document.querySelector('.memory-screen');
const calcScreen = document.querySelector('.calc-screen');
const result = document.querySelector('.result');
const buttonSet = document.querySelector('.button-set');
const clearMemoryBtn = document.querySelector('.clear-memory-btn');
const clearCalcBtn = document.querySelector('.clear-calc-btn');

const operations = {
    '+': (...args) => args.reduce((p, c) => p + c),
    '-': (...args) => args.reduce((p, c) => p - c),
    '*': (...args) => args.reduce((p, c) => p * c),
    '/': (...args) => args.reduce((p, c) => p / c),
}

document.addEventListener('keydown', function (event) {
    if (event.keyCode == 8) { // backspace
        calcScreen.innerHTML = calcScreen.innerHTML.slice(0, calcScreen.innerHTML.length - 1);
    }
})

buttonSet.addEventListener('click', function (el) {
    if (el.target.className == 'digit' || el.target.className == 'operation') {
        if (calcScreen.innerHTML.length <= 14) {
            calcScreen.innerHTML += el.target.innerHTML;
        }
    }
})

clearMemoryBtn.addEventListener('click', function () {
    memoryScreen.innerHTML = '';
})

clearCalcBtn.addEventListener('click', function () {
    calcScreen.innerHTML = '';
})

result.addEventListener('click', function () {
    calcStr = calcScreen.innerHTML;
    calc(calcStr);
})

function calc(calcStr) {
    for (key in operations) {
        if (calcStr.indexOf(key) != -1) {
            var args = calcStr.split(key).map((el) => +el);
            var result = operations[key](...args);
            if (result) {
                memoryScreen.innerHTML += calcScreen.innerHTML;
                calcScreen.innerHTML = result;
                memoryScreen.innerHTML += `=${result}<br/>`;
            }
        }
    }
}