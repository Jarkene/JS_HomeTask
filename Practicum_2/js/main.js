class Request {
    constructor(path) {
        this.xhr = new XMLHttpRequest();
        this.xhr.open("GET", path, true);
        this.xhr.send(null);
    }
    then(callback) {
        this.xhr.onload = function () {
            callback(this.responseText);
        }
    }
}

class CSV {
    static parse(data) {
        var props = data.split('\r\n')[0].split(', ');
        var valuesArr = data.split('\r\n').slice(1).map(string => string.split(', '));
        return valuesArr.map(values => {
            var obj = {};
            values.forEach((value, i) => {
                obj[props[i]] = value;
            })
            return obj;
        })
    }
}

class EmployeesTable {
    constructor() {
        var table = document.createElement('table');
        var thead = document.createElement('thead');
        var tbody = document.createElement('tbody');
        var tr = document.createElement('tr');

        table.appendChild(thead);
        table.appendChild(tbody);
        thead.appendChild(tr);

        tr.innerHTML =
            `<th>Выбрать</th>
             <th class="sort-btn" sortBy="id" id="emp-id">ID</th>
             <th class="sort-btn" sortBy="name">Имя</th>
             <th class="sort-btn" sortBy="age">Возраст</th>
             <th class="sort-btn" sortBy="entry_date">Дата поступления</th>
             <th class="sort-btn" sortBy="birth_date">Дата рождения</th>
             <th class="sort-btn" sortBy="salary">Зарплата</th>
             <th class="sort-btn" sortBy="department">Отдел</th>
             <th class="sort-btn" sortBy="position">Должность</th>`;

        this.DOM = table;
        this._employees = [];
        this._checkedEmployees = [];

        var eventListener = new TableEventListener(this);
        eventListener.addAll();
    }
    addEmployee(employee) {
        this._employees.push(employee);
    }
    sort(field) {
        this._employees.sort((a, b) => a[field] > b[field] ? 1 : -1);
        this.render();
    }
    render() {
        var container = document.querySelector('.table-container');
        container.innerHTML = '';

        if (this.DOM.querySelector('tbody')) {
            this.DOM.removeChild(this.DOM.querySelector('tbody'));
        }

        var tbody = document.createElement('tbody');
        this.DOM.appendChild(tbody);
        tbody.innerHTML = '';

        this._employees.forEach(employee => {
            tbody.appendChild(employee.html());
        });

        this.updateInfo();
        container.appendChild(this.DOM);
    }

    updateInfo() {
        var info = document.querySelector('.info-container');
        var table = this;

        Array.from(document.querySelectorAll('.checked')).forEach(checked => {
            table._checkedEmployees.push(table._employees.filter(emp => {
                return emp.id == checked.parentNode.nextElementSibling.innerHTML;
            })[0]);
        });

        var checkedEmployees = this._checkedEmployees;
        if (!checkedEmployees.length) {
            checkedEmployees = this._employees;
        }
        info.innerHTML = 
            `<div><b>Выбрано сотрудников:</b> ${checkedEmployees.length}<br></div>
             <div><b>Средний возраст сотрудников:</b> ${(checkedEmployees.reduce((age, emp) => {
                return emp.age + age;
             }, 0) / checkedEmployees.length).toFixed(1)}<br></div>
             <div><b>Средняя ЗП:</b> ${(checkedEmployees.reduce((salary, emp) => {
                return emp.salary + salary;
             }, 0) / checkedEmployees.length).toFixed(2)}<br></div>
             <div><b>Суммарная ЗП:</b> ${checkedEmployees.reduce((salary, emp) => {
                return emp.salary + salary;
             }, 0)}<br></div>
             <div><b>&nbsp;Пенсия:</b><br> ${checkedEmployees.map((emp) => {
                return `<em>${emp.name}</em> - ${(new Date().getFullYear() - emp.entry_date.getFullYear()) * emp.salary * 0.01}<br>`;
             }, 0).join('')}<br></div>`
    }
}

function getZero(num) {
    if (num < 10) {
        return '0' + num;
    }
    return num;
}

function getTimeFrom(date) {
    var curDate = new Date();
    if (curDate.getTime() > date.getTime()) {
        var years = (curDate - date) / 1000 / 60 / 60 / 24 / 365;
    } else {
        var years = (date - curDate) / 1000 / 60 / 60 / 24 / 365;
    }
    
    var deltaYears = years - Math.floor(years);
    var months = deltaYears * 12;
    
    return `${Math.floor(years)} г. ${Math.floor(months)} мес.`;
}

function calcTimeToPension(date) {
    var pensionDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return getTimeFrom(pensionDate);
}

class TableEventListener {
    constructor(table) {
        this.table = table;
    }
    sortBtnClick(event) {
        if (event.target.classList.contains('sort-btn')) {
            var sortBy = event.target.getAttribute('sortBy');
            this.sort(sortBy);
        }
    }
    chooseEmployee(event) {
        var table = this;
        table._checkedEmployees = [];

        if (event.target.classList.contains('choose-emp')) {
            if (event.target.classList.contains('checked')) {
                event.target.classList.remove('checked')
            } else {
                event.target.classList.add('checked');
            }
        }

        table.updateInfo();
    }
    showContextMenu(event) {
        if (event.target.parentNode.classList.contains('employee')) {
            event.preventDefault();
            var contextMenu = document.querySelector('.context-menu');
            contextMenu.setAttribute('emp-id', event.target.parentNode.firstElementChild.nextElementSibling.innerHTML);
            contextMenu.style.display = 'inline-block';
            contextMenu.style.top = event.clientY + 'px';
            contextMenu.style.left = event.clientX + 'px';
        }
    }
    chooseEmployeeFromMenu(event) {
        if (event.target.classList.contains('check')) {
            this._checkedEmployees = [];

            var checkEl = Array.from(document.querySelectorAll('.id')).filter(id => {
                return id.innerHTML == event.target.parentNode.getAttribute('emp-id');
            })[0].previousElementSibling.firstElementChild;

            checkEl.checked = true;
            checkEl.classList.add('checked');

            this.updateInfo();
        }
    }
    chooseAll() {
        if (event.target.classList.contains('check-all')) {
            this._checkedEmployees = [];

            Array.from(document.querySelectorAll('.id')).forEach(id => {
                var check = id.previousElementSibling.firstElementChild;
                if (id.innerHTML != event.target.parentNode.getAttribute('emp-id')) {
                    check.checked = true;
                    check.classList.add('checked');
                } else {
                    check.checked = false;
                    check.classList.remove('checked');
                }
            });

            this.updateInfo();
        }
    }
    closeMenu() {
        document.querySelector('.context-menu').style.display = 'none';
        document.querySelector('.prop-container').style.display = 'none';
    }
    layOff() {
        if (event.target.classList.contains('lay-off')) {
            this._employees = this._employees.filter(emp => {
                return emp.id != event.target.parentNode.getAttribute('emp-id');
            });
            this.render();
        }
    }
    showProperties() {
        if (event.target.classList.contains('properties')) {
            document.querySelector('.prop-container').style.display = 'block';
            var choosed = this._employees.filter(emp => {
                return emp.id == event.target.parentNode.getAttribute('emp-id');
            })[0];

            var html = `
                <div><b>ID:</b> ${choosed.id}</div>
                <div><b>Имя:</b> ${choosed.name}</div>
                <div><b>Возраст:</b> ${choosed.age}</div>
                <div><b>Дата поступления:</b> ${choosed.entry_date.getDate()}-${getZero(choosed.entry_date.getMonth() + 1)}-${choosed.entry_date.getFullYear()}</div>
                <div><b>Дата рождения:</b> ${choosed.birth_date.getDate()}-${getZero(choosed.birth_date.getMonth() + 1)}-${choosed.birth_date.getFullYear()}</div>
                <div><b>Зарплата:</b> ${choosed.salary}</div>
                <div><b>Отдел:</b> ${choosed.department}</div>
                <div><b>Должность:</b> ${choosed.position}</div>
                <div><b>Время работы в компании:</b> ${getTimeFrom(choosed.entry_date)}</div>
                <div><b>Пенсия:</b> ${(new Date().getFullYear() - choosed.entry_date.getFullYear()) * choosed.salary * 0.01}</div>
                <div><b>Налог с ЗП:</b> ${choosed.salary * 0.13}</div>
                <div><b>Время до пенсии:</b> ${calcTimeToPension(choosed.birth_date)}</div><br><br>
                <h3>Клините ЛКМ, чтобы закрыть</h3>`;

            document.querySelector('.prop-container').innerHTML = html;
        }
    }
    addAll() {
        this.table.DOM.addEventListener('click', this.sortBtnClick.bind(this.table));
        this.table.DOM.addEventListener('click', this.chooseEmployee.bind(this.table));
        this.table.DOM.addEventListener('contextmenu', this.showContextMenu.bind(this.table));

        document.addEventListener('click', this.showProperties.bind(this.table));
        document.addEventListener('click', this.layOff.bind(this.table));
        document.addEventListener('click', this.chooseEmployeeFromMenu.bind(this.table));
        document.addEventListener('click', this.chooseAll.bind(this.table));
        document.body.addEventListener('click', this.closeMenu);
    }
}

class Employee {
    constructor(employee) {
        if (!Employee.count) {
            Employee.count = 0;
        }
        Employee.count++;
        
        this.id = Employee.count;
        this.name = employee.name;
        this.age = parseInt(employee.age);
        this.entry_date = new Date(employee.entry_date);
        this.birth_date = new Date(employee.birth_date);
        this.salary = parseFloat(employee.salary);
        this.department = employee.department;
        this.position = employee.position;
    }
    html() {
        var tr = document.createElement('tr');
        tr.classList.add('employee');
        tr.innerHTML += '<td><input type="checkbox" class="choose-emp" /></td>'
        Object.keys(this).forEach(key => {
            if (this[key] instanceof Date) {
                tr.innerHTML += `<td class="${key}">${this[key].getDate()}-${getZero(this[key].getMonth() + 1)}-${this[key].getFullYear()}</td>`;
            } else {
                tr.innerHTML += `<td class="${key}">${this[key]}</td>`;
            }
        })
        return tr;
    }
}

var request = new Request('./data/employees.csv');
request.then(function (data) {
    var data_arr = CSV.parse(data);
    var employees = data_arr.map(employee => new Employee(employee));
    var table = new EmployeesTable();
    employees.forEach(employee => table.addEmployee(employee));
    table.render();
})