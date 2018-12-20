Vue.component('app-category', {
    template: `
        <a href=# @click="categoryClick">{{ category }}</a>
    `,
    props: ['category'],
    methods: {
        categoryClick(event) {
            this.$emit('category-click', event.target.innerText);
        }
    }
})

Vue.component('app-item', {
    template: `
        <div class="app-item">
            <img class="item-img" :src="item.img" width="130" height="100"/>
            <h3 class="item-title">{{ item.title }}</h3>
            <div class="item-price">Цена: {{ item.price }} руб.</div>
            <div class="item-props">
                <div class="item-prop" v-for="(prop, key) in item.props">{{ key }}: {{ prop }} &nbsp</div>
            </div>
            <div class="bold item-category">Категория: {{ item.category }}</div>
            <input type="button" @click="buttonClick" class="button-add" value="Добавить в корзину">
        </div>
    `,
    props: ['item'],
    methods: {
        buttonClick() {
            this.$emit('button-click', this.item);
        }
    }
})

Vue.component('app-cart-item', {
    template: `
        <div class="order-item">
            <img class="item-img" :src="item.img" width="130" height="100"/>
            <h3 class="item-title">{{ item.title }}</h3>
            <div class="item-price">Цена: {{ item.price }} руб.</div>
            <div class="item-color"> Цвет: {{ item.color }}</div>
            <input type="button" @click="removeButton" class="button-remove" value="Удалить из корзины"/>
        </div>
    `,
    props: ['item'],
    methods: {
        removeButton() {
            this.$emit('remove-click', this.item);
        }
    }
})

new Vue({
    el: '#app',
    data: {
        items: [],
        checkedFilters: {},
        isSorted: false,
        filtered: {},
        curCategory: 'Все',
        categories: 'Все ',
        categoryFilter: {},
        showOrderList: false,
        orderList: []
    },
    created() {
        this.curCategory = localStorage.curCategory ? localStorage.curCategory : 'Все';
        this.filtered = localStorage.filtered ? JSON.parse(localStorage.filtered) : {};
        this.checkedFilters = localStorage.checkedFilters ? JSON.parse(localStorage.checkedFilters) : {};
        this.orderList = localStorage.orderList ? JSON.parse(localStorage.orderList) : [];

        console.log(this.checkedFilters);
        console.log(this.orderList)

        this.loadItems();
        if (this.curCategory != 'Все') this.changeCategory(this.curCategory);

        this.filterItems();
    },
    methods: {
        loadItems() {
            axios.get('http://localhost:8080/data?').then(res => {
                this.items = res.data;
            }).then(() => {
                this.categoryFilter = false,
                    this.categories = 'Все ';
                this.items.forEach(item => {
                    if (this.categories.indexOf(item.category) == -1) {
                        this.categories += item.category + ' ';
                    }
                });
                this.categories = this.categories.trim().split(' ');
            });
        },
        filterItems() {
            if (!Object.keys(this.filtered).length || this.curCategory == 'Все') return;
            var query = `http://localhost:8080/data?category=${this.curCategory}`;
            for (var key in this.filtered) {
                query += '&' + key + '=' + this.filtered[key];
            }
            axios.get(query).then(res => this.items = res.data);
        },
        changeCategory(category) {
            localStorage.curCategory = category;
            if (category == 'Все') {
                this.loadItems();
            } else {
                axios.get(`http://localhost:8080/data?category=${category}`).then(res => {
                    this.items = res.data;
                    this.curCategory = category;
                    this.setCategoryFilter();
                });
            }
        },
        setCategoryFilter() {
            this.filtered = {}
            this.categoryFilter = {}

            this.items.forEach(item => {
                for (var key in item.props) {
                    this.categoryFilter[key] = [];
                    this.filtered[key] = [];
                }
            })
            this.items.forEach(item => {
                for (var key in item.props) {
                    if (this.categoryFilter[key].indexOf(item.props[key]) == -1) {
                        this.categoryFilter[key].push(item.props[key]);
                    }
                }
            })
        },
        addFilter(event) {
            if (event.target.checked) {
                this.filtered[event.target.name].push(event.target.id);
                this.checkedFilters[event.target.id] = true;
            } else {
                this.filtered[event.target.name] = this.filtered[event.target.name].filter(filter => filter != event.target.id);
                this.checkedFilters[event.target.id] = false;
            }

            localStorage.checkedFilters = JSON.stringify(this.checkedFilters);
            localStorage.filtered = JSON.stringify(this.filtered);

            this.filterItems();
        },
        sortItems(field) {
            if (this.isSorted == field) {
                if (this.isSorted == 'title') {
                    this.items = this.items
                        .sort((a, b) => a[this.isSorted] < b[this.isSorted] ? 1 : - 1);
                    this.isSorted = false;
                    return;
                } else {
                    if (this.items[0][field]) {
                        this.items = this.items
                            .sort((a, b) => Number(a[this.isSorted]) < Number(b[this.isSorted]) ? 1 : - 1);
                    } else {
                        this.items = this.items
                            .sort((a, b) => Number(a.props[this.isSorted]) < Number(b.props[this.isSorted]) ? 1 : - 1);
                    }
                }
                this.isSorted = false;
                return;
            }
            if (field == 'title') {
                this.items = this.items.sort((a, b) => a[field] > b[field] ? 1 : - 1);
                this.isSorted = 'title';
                return;
            }
            if (this.items[0][field]) {
                this.items = this.items.sort((a, b) => Number(a[field]) > Number(b[field]) ? 1 : - 1);
            } else {
                this.items = this.items.sort((a, b) => Number(a.props[field]) > Number(b.props[field]) ? 1 : - 1);
            }
            this.isSorted = field;
        },
        showCart() {
            this.showOrderList == false ? (this.showOrderList = true) : (this.showOrderList = false);
        },
        addToCart(item) {
            var itemInCart = new Object;
            itemInCart.title = item.title;
            itemInCart.img = item.img;
            itemInCart.price = item.price;
            itemInCart.color = item.props.Цвет;

            this.orderList.push(itemInCart);
            localStorage.orderList = JSON.stringify(this.orderList);
        },
        removeItem(item) {
            var title = item.title;
            var color = item.color;
            const index = this.orderList.findIndex(item => item.title == title && item.color == color)
            this.orderList.splice(index, 1);
            localStorage.orderList = JSON.stringify(this.orderList);
        }
    }
})