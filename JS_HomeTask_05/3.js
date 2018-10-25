var str = prompt('Input phone number:');

const regexp = /\+375\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}/

if (str) {
    if (str.match(regexp)) console.log('Valid number');
    else console.log('Invalid number');
}