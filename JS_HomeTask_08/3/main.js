var input = document.getElementById('input')
var converted = document.getElementById('converted');
var inputCurrency = document.getElementById('input-currency');
var convertedCurrency = document.getElementById('converted-currency');

function convert() {
    const values = {
        usd: 1,
        eur: 1.14,
        byn: 0.47,
        rub: 0.015,
    }
    var convertingCurrency = inputCurrency.value;
    var currencyToConvert = convertedCurrency.value;
    converted.value = (values[convertingCurrency] * input.value / values[currencyToConvert]).toFixed(4);
}

input.addEventListener('input', convert);
inputCurrency.addEventListener('change', convert);
convertedCurrency.addEventListener('change', convert);