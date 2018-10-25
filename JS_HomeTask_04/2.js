var House = {
    apartments: [{
        square: 62,
        floor: 4,
        people: [{
            name: 'Alex',
            age: 32
        }, {
            name: 'John',
            age: 12
        }, {
            name: 'Mary',
            age: 19
        }]
    }, {
        square: 78,
        floor: 3,
        people: [{
            name: 'Paul',
            age: 30
        }, {
            name: 'Vasya',
            age: 18
        }]
    }, {
        square: 82,
        floor: 5,
        people: [{
            name: 'Petya',
            age: 25
        }, {
            name: 'Kostya',
            age: 14
        }]
    }],

    addResident: function (number, name, age) {
        var n = --number;
        if (!this.apartments[n]) {
            alert('Такой квартиры нет');
            return;
        }
        this.apartments[n].people.push({ name, age });
    },

    removeResident: function (number, name) {
        var n = --number;
        if (!this.apartments[n]) {
            alert('Такой квартиры нет');
            return;
        }
        var arr = this.apartments[n].people;
        arr = arr.filter(el => el.name != name);
        this.apartments[n].people = arr;
    },

    removeAllResidents: function (number) {
        var n = --number;
        if (!this.apartments[n]) {
            alert('Такой квартиры нет');
            return;
        }
        this.apartments[n].people = [];
    },

    comExpenses: function (money) {
        var totalSquare = this.apartments.map(el => el.square).reduce((p, c) => p + c);

        function calcAnte(square) {
            return (square / totalSquare) * money;
        }

        var apartments = this.apartments;
        apartments.forEach(el => el.ante = calcAnte(el.square));

        var payableApartments = apartments.filter(ap => {
            return ap.people.length && ap.people.some(el => el.age >= 18);
        });

        var nullApartments = apartments.filter(ap => {
            return !ap.people.length || ap.people.every(el => el.age < 18);
        });

        if (nullApartments.length) {
            var anteNull = nullApartments.map(el => el.ante).reduce((p, c) => p + c);
            nullApartments.forEach(el => el.ante = 0);
            payableApartments.forEach(el => el.ante += anteNull / payableApartments.length);
        }

        payableApartments.forEach(ap => {
            var numAdult = ap.people.filter(el => el.age >= 18).length;
            ap.people.forEach(peo => {
                if (peo.age >= 18) {
                    peo.ante = ap.ante / numAdult;
                } else {
                    peo.ante = 0;
                }
            });
        });

        apartments.forEach(ap => {
            ap.people.forEach(peo => {
                console.log(peo.name + ' - ' + peo.age + ' years' + ' - ' + peo.ante);
            })
        });


    }
}

House.addResident(3, 'Nick', 23);
House.removeResident(2, 'Paul');
House.removeAllResidents(2);
House.comExpenses(1000);