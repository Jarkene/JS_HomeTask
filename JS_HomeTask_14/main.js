;(function () {
    function loadData() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', `http://localhost:8080/data?`, true);
        xhr.onload = function () {
            renderItems(JSON.parse(this.responseText));
            document.body.addEventListener('input', onPriceChanged);
        }
        xhr.send(null);
    }

    function onPriceChanged(event) {
        if (event.target.classList.contains('find')) {
            const minPrice = document.getElementById('min-price');
            const maxPrice = document.getElementById('max-price');
            const category = document.getElementById('category');

            const xhr = new XMLHttpRequest();
            xhr.open('GET', `http://localhost:8080/data?min=${minPrice.value}&max=${maxPrice.value}&category=${category.value}`, true);
            xhr.onload = function () {
                renderItems(JSON.parse(this.responseText));
            }
            xhr.send(null);
        }
    }

    function renderItems(items) {
        document.querySelector('.items-container').innerHTML = '';
        items.forEach(item => {
            var itemDOM = document.createElement('div');
            itemDOM.classList.add('item');
            itemDOM.innerHTML = `
                <img src="${item.img}" width="250"/>
                <h2>${item.title}</h2>
                <p><b>Цена:</b> ${item.price}</p>
                <p><b>Категория:</b> ${item.category}</p>`

            document.querySelector('.items-container').appendChild(itemDOM);
        })
    }

    loadData()
})();