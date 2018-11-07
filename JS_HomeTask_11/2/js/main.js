var xhr = new XMLHttpRequest();

xhr.open('GET', './data/countries.csv', true);

xhr.onload = function (str) {
	var countries = [];

	var rows = this.responseText.split('\n');
	var headers = rows[0].split(', ');
	var data = rows.slice(1);

	for (var i in data) {
		var fields = data[i].split(', ');
		var country = {};
		for (var j in fields) {
			country[headers[j]] = fields[j];
		}
		countries.push(country);
	}

	countries = countries.sort((a, b) => a.population - b.population);

	var table = createTable(countries.length, 4);

	for (var i = 0; i < countries.length; ++i) {
		table.children[i + 1].firstElementChild.innerHTML = countries[i].country;
		table.children[i + 1].children[1].innerHTML = `<img src=${countries[i].flag} style="width: 240px; height: 150px;"/>`;
		table.children[i + 1].children[2].innerHTML =  countries[i].code;
		table.children[i + 1].children[3].innerHTML = countries[i].population;
	}

}

xhr.send(null);

function createTable(rows, cols) {
	var html = '<table style="background-color: #efefef; margin: 20px auto; border-collapse: collapse;"><tbody>';
	html += `<tr style="border: 1px solid black;">
				<th>Country</th>
				<th>Flag</th>
				<th>Code</th>
				<th>Population</th>
			 </tr>`
	for (var i = 0; i < rows; ++i) {
		html += '<tr>';
		for (var j = 0; j < cols; ++j) {
			html += '<td style ="border: 1px solid black; padding: 10px"></td>';
		}
		html += '</tr>';
	}
	html += '</table></tbody>';
	document.write(html);

	return document.querySelector("tbody");
}