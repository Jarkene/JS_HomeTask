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

function makeHover() {
    var bgColor = this.style.backgroundColor = 'Grey';
    var timer = setTimeout(() => this.style.backgroundColor = 'White', 3000);
}

function style() {
    forEachInTable(function(el) {
        el.addEventListener('mouseover', makeHover);
    })
}

createTable();
style();