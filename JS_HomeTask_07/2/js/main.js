//------Стилизованный таймер отсчтета

var flag = true;

function updateTimeToTomorrow() {
    var curDate = new Date();
    var tomorrow = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate() + 1);
    var allMsToTomorrow = tomorrow - curDate;

    var fullHoursToTomorrow = (allMsToTomorrow / 1000 / 3600);
    var fullMinutesToTomorrow = getDecimal(fullHoursToTomorrow) * 60;
    var fullSecondsToTomorrow = getDecimal(fullMinutesToTomorrow) * 60;

    var hoursToTomorrow = Math.floor(fullHoursToTomorrow);
    var minutesToTomorrow = Math.floor(fullMinutesToTomorrow);
    var secondsToTomorrow = Math.floor(fullSecondsToTomorrow);

    var elem = document.getElementById('timer');

    if (flag) {
        elem.innerHTML = addZero(hoursToTomorrow) + ':' + addZero(minutesToTomorrow) + ':' + addZero(secondsToTomorrow);
        flag = false;
    } else {
        elem.innerHTML = addZero(hoursToTomorrow) + ' ' + addZero(minutesToTomorrow) + ' ' + addZero(secondsToTomorrow);
        flag = true;
    }
}

updateTimeToTomorrow();
var timer = setInterval(updateTimeToTomorrow, 500);

function getDecimal(num) {
    var str = '' + num;
    var zeroPos = str.indexOf('.');
    if (zeroPos == -1) return 0;
    return +str.slice(zeroPos);
}

function addZero(num) {
    if (num < 10) {
        return '0' + num;
    }
    return num;
}