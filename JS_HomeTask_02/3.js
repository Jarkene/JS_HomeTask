// 3. Вывести количество минут до конца текущего дня

var curDay = new Date();
var tomorrow = new Date(curDay.getFullYear(), curDay.getMonth(), curDay.getDate() + 1);
var diffInMinutes = Math.ceil((tomorrow - curDay) / 1000/ 60);

document.write(`Minutes to tomorrow: ${diffInMinutes}`);