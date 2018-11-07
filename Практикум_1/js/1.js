var str = 'alex@gmail.com,  jameson@mail.ru, Nick, denis@yandex.ru, a@a.com, anton@mail.ru, +375293435645, javascript@gmail.com,  gosha@tut.by, +375297758434';

const regexp = /^[a-z]+@[a-z]+\.[a-z]+$/gi;

var emails = str.split(', ').map(s => s.trim()).filter(email => email.match(regexp));

//-------------A

var operators = emails.map(email => email.split('@')[1]);

for (i = operators.length - 1; i >= 0; --i) {
    if (operators[operators[i]]) {
        operators[operators[i]] += 1;
        operators.splice(i, 1);
    } else {
        operators[operators[i]] = 1;
    }
}

operators.sort((a, b) => operators[b] - operators[a]);

console.log(operators);

//-----------B

operators = emails.map(email => email.split('@')[1])
    .sort((a, b) => a > b)
    .filter((el, i, arr) => el != arr[i-1]);

var obj = {};

for (var i in emails) {
    for (var j in operators) {
        if (emails[i].indexOf(operators[j]) != -1) {
            if (!obj[operators[j]]) obj[operators[j]] = [];
            obj[operators[j]].push(emails[i]);
        }
    }
}

console.log(obj);

for (var key in obj) {
    var max = obj[key].reduce((p, c) => c.length > p.length ? c : p);
    console.log(`MAX length ${key}: ${max.length} - ${max}`);
}
console.log('');
for (var key in obj) {
    var min = obj[key].reduce((p, c) => c.length < p.length ? c : p);
    console.log(`MIN length ${key}: ${min.length} - ${min}`);
}
console.log('');
for (var key in obj) {
    var avg = obj[key].map(el => el.length).reduce((p, c) => p + c) / obj[key].length;
    console.log(`AVG length ${key}: ${avg}`);
}
console.log('');

//-------------------C

var logins = emails.map(email => email.split('@')[0]).join('').split('');

for (i = logins.length - 1; i >= 0; --i) {
    if (logins[logins[i]]) {
        logins[logins[i]] += 1;
        logins.splice(i, 1);
    } else {
        logins[logins[i]] = 1;
    }
}

logins.sort((a, b) => logins[b] - logins[a]);
console.log(logins);