// Vue.component('app-filter', {
//     template: `
//         <div class="app-filter">
//             <div class="filter-item">Год выпуска: 
//                 <div>
//                     <input type="checkbox" id="2016" name="year" @input="addYear" />
//                     <label for="2016">2016</label>
//                 </div>
//                 <div>
//                     <input type="checkbox" id="2017" name="year" @input="addYear" />
//                     <label for="2017">2017</label>
//                 </div>
//                 <div>
//                     <input type="checkbox" id="2018" name="year" @input="addYear" />
//                     <label for="2018">2018</label>
//                 </div>
//             </div>
//         </div>
//     `,
//     data() {
//         return {
//             filtered: {
//                 'Год выпуска': []
//             }
//         }
//     },
//     methods: {

//     },
//     created() {
//         console.log(this.filter);
//     },
//     props: ['filter']
// })

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
            <img class="item-img" :src="imgSrc" />
            <h3 class="item-title">{{ item.title }}</h3>
            <div class="item-price">Цена: {{ item.price }}</div>
            <div item-props>
                <div>Свойства:</div>
                <div class="item-prop" v-for="(prop, key) in item.props">{{ key }}: {{ prop }}</div>
            </div>
            <div class="bold item-category">Категория: {{ item.category }}</div>
        </div>
    `,
    data() {
        return {
            imgSrc: `./img/${this.item.img}`
        }
    },
    props: ['item']
})

new Vue({
    el: '#app',
    data: {
        items: [],
        filtered: [],
        curCategory: 'Все',
        categories: 'Все ',
        categoryFilter: false,
    },
    created() {
        this.loadItems();
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
            var query = `http://localhost:8080/data?category=${this.curCategory}`;
            for (var key in this.filtered) {
                query += '&' + key + '=' + this.filtered[key];
            }
            axios.get(query).then(res => this.items = res.data);
        },
        changeCategory(category) {
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
        addYear(event) {
            if (event.target.checked) {
                this.filtered[event.target.name].push(event.target.id);
            } else {
                this.filtered[event.target.name] = this.filtered[event.target.name].filter(filter => filter != event.target.id);
            }
            this.filterItems();
            console.log(this.filtered);
        }
    }
})