var elem = document.getElementById('clock');

var flag = true;

function updateTime() {
    var cur_date = new Date();
    var hours = cur_date.getHours();
    var minutes = cur_date.getMinutes();
    var seconds = cur_date.getSeconds();
    if (flag) {
        elem.innerText = addZero(hours) + ':' + addZero(minutes) + ':' + addZero(seconds);
        flag = false;
    } else {
        elem.innerText = addZero(hours) + ' ' + addZero(minutes) + ' ' + addZero(seconds);
        flag = true;
    }
}

updateTime();

var timer = setInterval(function () {
    updateTime();
}, 500);

function addZero(num) {
    if (num < 10) {
        return '0' + num;
    }
    return num;
}