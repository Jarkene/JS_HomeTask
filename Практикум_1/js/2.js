var str = 'ru_name, en_name, native_lang, population, square, capital, timezone, average_GDP\nАвстралия, Australia, Английский, 24130000, 7692000, Канберра, +11, 49927\nГермания, Germany, Немецкий, 82670000, 357386, Берлин, +2, 41936\nСША, USA, Английский, 325700000, 9834000, Вашингтон, -4, 57466\nБеларусь, Belarus, Белорусский, 9507000, 207595, Минск, +3, 4989\nРоссия, Russia, Русский, 144300000, 17100000, Москва, +3, 8748\nАнглия, Great Britain, Английский, 53010000, 130279, Лондон, +1, 38889';

var arr = str.split('\n').map(el => el.split(', '));

console.log(arr);

var countries = [];
for (i = 1; i < arr.length; ++i) {
    var obj = new Object();
    for (j = 0; j < 8; ++j) {
        obj[arr[0][j]] = arr[i][j];
    }
    countries.push(obj);
}

console.log(countries);

//----------------------A

var maxPopDensity = countries.reduce((p, c) => {
    var curPopDensity = c.population / c.square;
    var prevPopDensity = p.population / p.square;

    return curPopDensity > prevPopDensity ? c : p;

})

var minPopDensity = countries.reduce((p, c) => {
    var curPopDensity = c.population / c.square;
    var prevPopDensity = p.population / p.square;

    return curPopDensity < prevPopDensity ? c : p;

})

console.log('\tМакс/мин плотность населения:');
console.log(`${maxPopDensity.ru_name}: ${maxPopDensity.population / maxPopDensity.square}`);
console.log(`${minPopDensity.ru_name}: ${minPopDensity.population / minPopDensity.square}`);

var maxGDP = countries.reduce((p, c) => {
    var curGDP = c.average_GDP * c.population;
    var prevGDP = p.average_GDP / p.population;

    return curGDP > prevGDP ? c : p;

})

var minGDP = countries.reduce((p, c) => {
    var curGDP = c.average_GDP * c.population;
    var prevGDP = p.average_GDP / p.population;

    return curGDP < prevGDP ? c : p;

})

console.log('\tМакс/мин ВВП:');
console.log(`${maxGDP.ru_name}: ${maxGDP.average_GDP * maxGDP.population}`);
console.log(`${minGDP.ru_name}: ${minGDP.average_GDP * minGDP.population}`);

var arrGDP = countries.sort((a, b) => a.average_GDP - b.average_GDP).map(el => +el.average_GDP);

var medGDP = calcMedian(arrGDP);

console.log('\tМед. значение ВВП: ');
console.log(medGDP);

arrGDP = countries.sort((a, b) => {
    var am = Math.abs(a.average_GDP - medGDP);
    var bm = Math.abs(b.average_GDP - medGDP);

    return am - bm;
});

console.log('\tОтклонения от мед. значения ВВП: ');

for (var i = 0; i < 3; ++i) {
    console.log(arrGDP[i].ru_name + ': ' + Math.abs(arrGDP[i].average_GDP - medGDP));
}

function calcMedian(args) {
    var n = args.length;
    if (n % 2 == 0) {
        return (args[n / 2 - 1] + args[n / 2]) / 2;
    } else {
        return args[(n - 1) / 2];
    }
}

//---------------B

var offLangs = countries.map(el => el.native_lang)
    .sort((a, b) => a > b)
    .filter((el, i, arr) => el != arr[i - 1]);

var objLangs = {};
countries.forEach(country => {
    offLangs.forEach(lang => {
        if (country.native_lang == lang) {
            if (!objLangs[lang]) {
                objLangs[lang] = {};
                objLangs[lang].countries = [];
                objLangs[lang].amount = 0;
            }
            objLangs[lang].countries.push(country.ru_name);
            objLangs[lang].amount += +country.population;
        }
    })
});
console.log(' ');

console.log('\tЯзык, страны, население: ');

for (var key in objLangs) {
    console.log(`${key} - ${objLangs[key].amount}`);
    for (var i in objLangs[key].countries) {
        console.log(' ' + objLangs[key].countries[i]);
    }
}

//--------------------------   C

console.log(' ');

var objTime = {};

var randCountries = [];
for (var i = 0; i < 3; ++i) {
    var randCountry = countries[getRandomInt(0, countries.length - 1)]
    if (randCountries.filter(country => country.ru_name == randCountry.ru_name).length) {
        --i;
        continue;
    } else {
        randCountries.push(randCountry);
    }
}

randCountries.forEach(country => {
    objTime[country.capital] = getTime(country.timezone);
});

function getTime(offset) {
    var d = new Date();
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    var nd = new Date(utc + (3600000 * offset));
    return nd.toLocaleTimeString();
}

function getRandomInt(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

console.log(objTime);

//-----------------   D
console.log('');
var engRuName = countries.filter(country => country.en_name.length - country.ru_name.length > 1);
console.log('\tАнглийское название длиннее русского:');
console.log(engRuName);