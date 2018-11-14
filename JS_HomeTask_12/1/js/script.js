const Routes = {
	"#home": {
		path: "./html/home.html",
		handler: function () {
			var slider = document.getElementById('slider');
			var container = document.querySelector('.container');

			slider.addEventListener('input', function () {
				document.body.style.backgroundColor = `rgb(${+slider.value + 100}, ${+slider.value + 100}, ${+slider.value + 100})`
			})
		}
	},
	'#timer': {
		path: "./html/timer.html",
		handler: function () {
			timeToTomorrow();
		}
	},
	'#table': {
		path: "./html/table.html",
		handler: function () {
			makeTableEffect();
		}
	},
	"#form": {
		path: "./html/form.html",
		handler: function () {
			formValidation(document.querySelector('form'));
		}
	},
	'#time': {
		path: "./html/time.html",
		handler: function () {
			curTime();
		}
	}
}  //объект с маршрутами (если переходим поссылке открывается этот файл)

function refreshContainer() {
	const hash = location.hash; //открытый в данный момент 
	if (hash in Routes) {
		const path = Routes[hash].path;
		const xhr = new XMLHttpRequest();
		xhr.open('GET', path, true);
		xhr.onload = function () {
			onPageLoaded(this.responseText, hash);
		}
		xhr.send(null);
	}
}

function onPageLoaded(text, hash) {
	const div = document.querySelector('.container');
	div.innerHTML = text;
	if (typeof Routes[hash].handler == "function") {  //проверяем есть ли в пути такие элементы
		Routes[hash].handler();
	}
}

function formValidation(form) {
	const patterns = {
		name: /^[a-zа-я\-\s\_]{3,20}$/i,
		phone: /^\+375\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/,
		email: /^[a-z0-9\_]{3,20}@[a-z]{3,10}\.[a-z]{2,5}$/i,
		site: /^[a-z0-9\_\-]{3,20}\.[a-z]{2,5}$/,
	}

	const msg = {
		correct: '&#10004',
		incorrect: '&#10008',
	}

	var valid = {
		name: false,
		phone: false,
		email: false,
		site: false,
	}

	form.addEventListener('input', function (event) {
		var target = event.target;
		if (target.tagName == 'INPUT') {
			var nextSibling = target.nextElementSibling
			if (target.value.search(patterns[target.id]) != -1) {
				nextSibling.innerHTML = msg.correct;
				nextSibling.classList.add('correct');
				nextSibling.classList.remove('incorrect');
				valid[target.id] = true;
			} else {
				nextSibling.classList.add('incorrect');
				nextSibling.classList.remove('correct');
				nextSibling.innerHTML = msg.incorrect;
				valid[target.id] = false;
			}
		}
	})

	form.addEventListener('submit', function (event) {
		var isFormValid = true;
		for (key in valid) {
			if (valid[key] == false) {
				isFormValid = false;
			}
		}
		isFormValid ? alert('Все поля заполнены верно') : alert('Не все поля заполнены верно');
	})
}

function makeTableEffect() {
	var rows = 10;
	var cols = 10;

	var createTable = function () {
		var html = '<table><tbody>';
		for (var i = 0; i < rows; ++i) {
			html += '<tr>';
			for (var j = 0; j < cols; ++j) {
				html += '<td></td>';
			}
			html += '</tr>';
		}
		html += '</table></tbody>';
		document.querySelector('.container').innerHTML += html;
	}

	var forEachInTable = function (func) {
		var table = document.querySelector('table').firstChild;
		var rows = table.children;
		for (var i = 0; i < rows.length; ++i) {
			var cols = rows[i].children;
			for (var j = 0; j < cols.length; ++j) {
				func(cols[j]);
			}
		}
	}

	var makeHover = function () {
		var bgColor = this.style.backgroundColor = 'Green';
		var timer = setTimeout(() => this.style.backgroundColor = 'White', 500);
	}

	createTable();

	forEachInTable(function (el) {
		el.addEventListener('mouseover', makeHover);
	})
}

function timeToTomorrow() {
	var flag = true;

	var updateTimeToTomorrow = function () {
		var curDate = new Date();
		var tomorrow = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate() + 1);
		var allMsToTomorrow = tomorrow - curDate;

		var getDecimal = function (num) {
			var str = '' + num;
			var zeroPos = str.indexOf('.');
			if (zeroPos == -1) return 0;
			return +str.slice(zeroPos);
		}

		var addZero = function (num) {
			if (num < 10) {
				return '0' + num;
			}
			return num;
		}

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
	var timer = setInterval(function () {
		if (document.getElementById('timer')) {
			updateTimeToTomorrow();
		}
		else {
			clearInterval(timer);
		}
	}, 500);
}

function curTime() {
	var elem = document.getElementById('clock');

	var flag = true;

	var addZero = function(num) {
		if (num < 10) {
			return '0' + num;
		}
		return num;
	}

	var updateTime = function() {
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
		if (document.getElementById('clock')) {
			updateTime();
		} else {
			clearInterval(timer);
		}
	}, 500);
}

window.onhashchange = refreshContainer; //вызывается когда меняется hash (после #)
refreshContainer();  //вызывется принудительно первый раз и загружает ранее открытый hash