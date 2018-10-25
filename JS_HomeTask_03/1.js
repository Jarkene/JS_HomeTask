var names = ['Andrew', 'Alex', 'John', 'Paul', 'Antony', 'Nick'];
var cities = ['New York', 'Minsk', 'London', 'Moscow', 'Paris', 'Brest'];

var people = [];

var n = names.length - 1;
for (var i = 0; i < n; ++i) {
    people.push({
        name: names[getRandomInt(0, n)],
        city: cities[getRandomInt(0, cities.length - 1)],
        age: getRandomInt(0, 90),
    });
}

people.sort((a, b) => b.age - a.age);

function getRandomInt(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

people.forEach(el => {
    console.log(el.name + ', ' + el.city + ', ' + el.age);
});