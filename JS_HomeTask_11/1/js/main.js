var xhr = new XMLHttpRequest();

xhr.open('GET', 'data/data.txt', true);

xhr.onload = function (str) {
    document.body.innerHTML = this.responseText;

    var numsArr = this.responseText.split(' ').map(el => +el);

    var avg = numsArr.reduce((p, c) => p + c) / numsArr.length;
    var harmonicMean = numsArr.length / numsArr.reduce((p, c) => 1/c + p, 0);
    
    console.log('Среднее арифметическое: ' + avg);
    console.log('Среднее гармоническое: ' + harmonicMean);
}

xhr.send(null);