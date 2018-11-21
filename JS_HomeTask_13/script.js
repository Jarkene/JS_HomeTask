class Request {
	constructor(path) {
		this.xhr = new XMLHttpRequest();
		this.xhr.open("GET", path, true);
		this.xhr.send(null);
	}
	then(f) {
		this.xhr.onload = function () {
			f(JSON.parse(this.responseText));
		}
	}
}

class Item {
	constructor(id, title, type, price, releaseDate) {
		this.id = id;
		this.title = title;
		this.type = type;
		this.price = price;
		this.releaseDate = releaseDate;
	}
	dom() {
		var li = document.createElement('li');
		li.classList.add('item-info');

		li.innerHTML =
			`<h3 class="item-title">${this.title}</h3>
			 <h4 class="item-price">Цена: ${this.price.toFixed(2)}</h4>
			 <div class="ttem-type">Тип: ${this.type}</div>
			 <div class="item-date">Дата выпуска: ${this.releaseDate}</div>`

		return li;
	}
}

class Store {
	constructor(title, address, markup, income) {
		this.title = title;
		this.address = address;
		this.items = [];
		this.markup = markup;
		this.income = income;

		Object.defineProperty(this, 'avgPrice', {
			get: function () {
				var itemsAmt = this.items.reduce((amt, curItem) => curItem.amount + amt, 0);
				return this.items.reduce((prevPrice, curItem) => curItem.price * curItem.amount + prevPrice, 0) / itemsAmt;
			}
		})
	}

	addItem(t, n) {

		// если массив товаров пуст или такого товара еще нет
		if (!this.items.length || !this.items.filter(item => item.id == t.id).length) {
			var newItem = Object.create(t); // создаем каждому магазину свой товар, прототип которого - t
			newItem.amount = n;
			newItem.price = newItem.price * (parseFloat(this.markup) / 100 + 1); // пересчитываем цену, исходя из наценки магазина

			this.items.push(newItem);
		} else {
			this.items.filter(item => item.id == t.id)[0].amount += n;
		}
		
	}

	removeItem(t, n) {
		this.items = this.items.map(item => {
			if (item.id == t.id && n != 0) {
				item.amount -= n;
			}
			return item;
		})
	}

	sellItem(t, n) {

		// находим нужный нам товар и если его количество больше n, то ставим n равное количеству
		if (this.items.filter(item => item.id == t.id)[0].amount < n) {
			n = this.items.filter(item => item.id == t.id)[0].amount;
		}

		// удаляем товары и добавляем магазину прибыль
		this.removeItem(t, n);
		this.income += t.price * n;
	}

	getInfoDom() {
		var storeInfo = document.createElement('div');
		storeInfo.classList.add('store-info');

		var store = this;

		storeInfo.innerHTML =
			`<div class="store-title">Название: <b>${this.title}</b></div>
			 <div class="store-address">Адрес: ${this.address}</div>
			 <div class="store-markup">Наценка: ${this.markup}</div>
			 <div class="store-income">Доход: ${this.income}</div>
			 <div class="avg-price">Средняя цена за товар: ${this.avgPrice.toFixed(2)}</div>
			 <button type="button" class="show-btn">Показать товары</button>`

		storeInfo.querySelector('.show-btn').addEventListener('click', function () {
			market.showStoreItems(store);
		})

		return storeInfo;
	}

	getItemsDom() {
		return this.items.map(item => {
			var itemDom = item.dom();
			var market = this;

			itemDom.innerHTML +=
				`<div><b>Количество: <span class="item-amt">${item.amount}</span></b></div>
				 <p>
				 	<input type="number" class="input-amt"/>
				 	<button type="button" class="addToCart">Добавить</button>
				 <p>`;

			itemDom.querySelector('.input-amt').setAttribute('max', item.amount);

			itemDom.querySelector(".addToCart").addEventListener('click', function (e) {
				var n = this.previousElementSibling.value;
				if (n > item.amount) n = item.amount;

				market.sellItem(item, n);

				itemDom.querySelector('.item-amt').innerHTML -= n;

				var t = item.title;
				var p = item.price;
				var s = p * n;
				alert(`Куплено ${n} штук товара ${t}. Сумма: ${s.toFixed(2)} руб`);
			})

			return itemDom;
		})
	}
}

var market = {
	setStores: function(stores) {
		this.stores = stores;
	},

	showStoresInfo: function () {
		document.querySelector('.container').innerHTML = `<h1>Информация о магазинах</h1>`;
		this.stores.forEach(store => {
			document.querySelector('.container').appendChild(store.getInfoDom());
		})
		
	},

	showStoreItems: function (store) {
		document.querySelector('.container').innerHTML = 
		`<div class="back-btn-container">
			<div class="back-btn">Назад к магазинам</div>
		</div>
		<h1>Товары магазина "${store.title}"</h1>`;

		var stores = this.stores;

		document.querySelector('.back-btn').addEventListener('click', function() {
			market.showStoresInfo(stores);
		})

		store.getItemsDom().forEach(item => {
			document.querySelector('.container').appendChild(item);
		})
	}
}

var items = [];
var request = new Request("data.json");

request.then(function (data) {
	items = data.map(function (obj) {
		var item = new Item(obj.id, obj.title, obj.type, obj.price, obj.releaseDate);
		return item;
	})
});

request = new Request('stores.json');

request.then(function (data) {
	var stores = data.map(function (obj) {
		return new Store(obj.title, obj.address, obj.markup, obj.income);
	})
	stores[0].addItem(items[0], 10);
	stores[0].addItem(items[1], 5);
	stores[0].addItem(items[2], 7);

	stores[1].addItem(items[2], 15);
	stores[1].addItem(items[1], 7);
	stores[1].addItem(items[4], 8);

	stores[2].addItem(items[3], 24);
	stores[2].addItem(items[4], 17);
	stores[2].addItem(items[5], 12);

	market.setStores(stores);
	market.showStoresInfo();
})