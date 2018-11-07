function getRandomInt(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

var nums = new Array(10000).fill(0).map(el => el = getRandomInt(1, 100)).join(' ');

var fs = require('fs');

fs.writeFile('../data/data.txt', nums, function(err) {
    if (err) throw err;
    console.log('Nums created!');
})