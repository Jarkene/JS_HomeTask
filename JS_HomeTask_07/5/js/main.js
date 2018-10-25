var n = prompt('Input N:');
var rows = Math.ceil(n / 10);
var cols = 10;

function createTable() {
    var html = '<table><tbody>';
    for (var i = 0; i < rows; ++i) {
        html += '<tr>';
        for (var j = 0; j < cols; ++j) {
            html += '<td></td>';
        }
        html += '</tr>';
    }
    html += '</table></tbody>';
    document.write(html);
}

function fillTable() {
    var counter = 1;
    forEachInTable(el => {
        if (counter <= n) el.innerHTML = counter;
        counter++;
    })
}

function forEachInTable(func) {
    var table = document.querySelector('table').firstChild;
    var rows = table.children;
    for (var i = 0; i < rows.length; ++i) {
        var cols = rows[i].children;
        for (var j = 0; j < cols.length; ++j) {
            func(cols[j]);
        }
    }
}

function forEachIntervalInTable(func, interval = 100) {
    var table = document.querySelector('table').firstChild;
    var rows = table.children;
    var i = 0;
    var j = 0;
    var timer = setInterval(function () {
        if (i < rows.length) {
            cols = rows[i].children;
            if (j < cols.length) {
                func(cols[j]);
                j++;
            } else {
                i++;
                j = 0;
            }
        }
    }, interval)
}

createTable();
fillTable();


var primeNums = [1, 2];
forEachInTable(el => {
    if (el.innerHTML) el.usable = true;
});
var anyUsable = true;

function eratostheneSieve(interval) {
    anyUsable = false;
    var firstUsable = true;
    curPos = primeNums.length - 1;
    forEachIntervalInTable(function (el, next) {
        if (el.usable) {
            console.log(el.innerHTML);
            anyUsable = true;
            if (el.innerHTML % primeNums[curPos] == 0) {
                el.usable = false;
            } else {
                el.usable = true;
            }
            if (el.usable && el.innerHTML != '1') {
                el.style = 'background-color: green';
                if (firstUsable && primeNums.indexOf(+el.innerHTML) == -1) {
                    primeNums.push(+el.innerHTML);
                    firstUsable = false;
                }
            } else {
                el.usable = false;
                el.style = 'background-color: red';
            }
            if (el.innerHTML == primeNums[curPos]) {
                el.usable = false;
                el.style = 'background-color: aqua';
            }
        }
        if (el.innerHTML == n && anyUsable) eratostheneSieve(interval / 2.3);
    }, interval)
}
eratostheneSieve(180);