// 2. Вычислить значение полинома с введенными N, a0..an, x

var n = Number(prompt('Input N: ')),
    x = Number(prompt('Input X: ')),
    a = [];

for (var i = 0; i <= n; ++i) {
    a.push(Number(prompt(`Input a${i}: `)));
}

var sum = 0;

for (var i = 0; i <= n; ++i) {
    sum += a[i] * x ** i;
}

if (n && x && isCorrectArr(a)) {
    document.write(`Your polynom: `);
    for (var i = 0; i <= n; ++i) {
        document.write(`${a[i]} * (${x} ** ${i}) `);
        if (i != n) {
            document.write('+ ');
        }
    }
    document.write(`<br> Total sum of polynom: ${sum}`);
}

function isCorrectArr(arr) {
    for (var i = 0; i < arr.length; ++i) {
        if (!arr[i]) return false;
    }
    return true;
}