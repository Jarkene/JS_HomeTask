function calcHarmomicMean(...args) {
    return args.length / args.reduce((p, c) => p + 1 / c, 0);
}

function calcMedian(...args) {
    var n = args.length;
    if (n % 2 == 0) {
        return (args[n / 2 - 1] + args[n / 2]) / 2;
    } else {
        return args[(n - 1) / 2];
    }
}

function calcDispersion(...args) {

    // считаем среднее арифметическое
    var avg = calcAvg.apply(null, args);

    // создаем массив из квадратов отклонений
    var arr = args.map(el => (el - avg) ** 2);

    // возвращаем дисперсию
    return calcAvg.apply(null, arr);
}

function stringOfSymbols(...args) {
    return args.map(el => String.fromCharCode(el)).join(' ');
}

function calcPolynom(n, a) {

    return function (x) {
        var sum = 0;
        for (var i = 0; i <= n; ++i) {
            sum += a[i] * x ** i;
        }
        return sum;
    }

}

document.write(`Среднее гармоническое (5, 2, 2, 3, 5): ${calcHarmomicMean(5, 2, 2, 3, 5)} <br>`)
document.write(`Медианное значение (1, 15, 17, 30): ${calcMedian(1, 15, 17, 30)} <br>`)
document.write(`Дисперсия (1, 2, 3, 4, 5, 6, 7, 8): ${calcDispersion(1, 2, 3, 4, 5, 6, 7, 8)} <br>`)
document.write(`Строка символов (72, 109, 34, 87): ${stringOfSymbols(72, 109, 34, 87)} <br>`)

//Для работы с полиномом вызвать следующую функцию
//workWithPolynom()

//-------------Вспомогательные функции----------------

function isCorrectArr(arr) {
    return arr.every(el => !!el);
}

function showPolynom(n, a, x) {
    document.write(`Your polynom: `);
    for (var i = 0; i <= n; ++i) {
        document.write(`${a[i]} * (${x} ** ${i}) `);
        if (i != n) {
            document.write('+ ');
        }
    }
}

function workWithPolynom() {
    var n = Number(prompt('Input N: ')),
        x = Number(prompt('Input X: ')),
        a = [];

    for (var i = 0; i <= n; ++i) {
        a.push(Number(prompt(`Input a${i}: `)));
    }

    if (n && x && isCorrectArr(a)) {
        showPolynom(n, a, x);
        document.write(`<br> Total sum of polynom: ${calcPolynom(n, a)(x)}`);
    }
}

function calcAvg(...args) {
    return args.reduce((p, c) => p + c) / args.length;
}