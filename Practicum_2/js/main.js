;(function () {
    class HttpRequest {
        static httpGet(path) {
            return new Promise(function(onResolve, onReject) {
                const xhr = new XMLHttpRequest();
                xhr.open("GET", path, true);
                xhr.onload = function() {
                    onResolve(this.responseText);
                }
                xhr.onerror = function() {
                    onReject(this.statusText);
                }
                xhr.send(null);
            })
        }
    }

    class CSV {
        static parse(data) {
            const props = data.split('\r\n')[0].split(', ');
            return data
                .split('\r\n')
                .slice(1)
                .map(string => string.split(', '))
                .map(values => {
                    return values
                        .map((str, i) => { return { [props[i]]: str } })
                        .reduce((p, c) => Object.assign(p, c), {});
                })
        }
    }

    class EmployeesTable {
        constructor() {
            var table = document.createElement('table')
                , thead = document.createElement('thead')
                , tbody = document.createElement('tbody')
                , tr = document.createElement('tr');

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

            document.querySelector('.table-container').appendChild(table);

            const eventListener = new TableEventListener(this);
            eventListener.addAll();
        }
        addEmployee(employee) {
            this._employees.push(employee);
            this.render();
            return this;
        }
        sort(field) {
            const isSorted = this._employees.every((value, index, array) => {
                return index === 0 || array[index - 1][field] <= value[field];
            })
            isSorted ? this._employees.sort((a, b) => a[field] < b[field] ? 1 : -1) : this._employees.sort((a, b) => a[field] > b[field] ? 1 : -1);
            this.render();
        }
        render() {
            var tbody = this.DOM.querySelector('tbody');
            tbody.innerHTML = '';
            this._employees.forEach(employee => tbody.appendChild(employee.html()));
            this.updateInfo();
            this.DOM.appendChild(tbody);
        }

        updateInfo() {
            var info = document.querySelector('.info-container');

            this._checkedEmployees = Array.from(document.querySelectorAll('.checked'))
                .map(checked => {
                    return this._employees.filter(emp => {
                        return emp.id == checked.parentNode.nextElementSibling.innerHTML;
                    })[0];
                });

            if (!this._checkedEmployees.length) {
                this._checkedEmployees = this._employees;
            }

            const infoObj = {
                'Выбрано сотрудников': this._checkedEmployees.length,
                'Средний возраст сотрудников': (this._checkedEmployees.reduce((age, emp) => {
                    return emp.age + age;
                }, 0) / this._checkedEmployees.length).toFixed(1),
                'Средняя ЗП': (this._checkedEmployees.reduce((salary, emp) => {
                    return emp.salary + salary;
                }, 0) / this._checkedEmployees.length).toFixed(2),
                'Суммарная ЗП': this._checkedEmployees.reduce((salary, emp) => {
                    return emp.salary + salary;
                }, 0),
                'Пенсия': this._checkedEmployees.map((emp) => {
                    return `<div><em>${emp.name}</em> - ${(new Date().getFullYear() - emp.entry_date.getFullYear()) * emp.salary * 0.01}</div>`;
                }, 0).join(''),
            }

            info.innerHTML = Object.keys(infoObj).map(key => {
                return `<div><b>${key}:</b> ${infoObj[key]}</div>`;
            }).join('');
        }
    }

    class Auxiliary {
        static getZero(num) {
            return num < 10 ? '0' + num : num;
        }
        static getTimeFrom(date) {
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
        static calcTimeToPension(dateBirth) {
            return this.getTimeFrom(new Date(new Date(dateBirth.getFullYear() + 57, dateBirth.getMonth(), dateBirth.getDay())));
        }
    }

    class TableEventListener {
        constructor(table) {
            this.table = table;
        }
        sortBtnClick(event) {
            if (event.target.classList.contains('sort-btn')) {
                this.sort(event.target.getAttribute('sortBy'));
            }
        }
        chooseEmployee(event) {
            this._checkedEmployees = [];

            if (event.target.classList.contains('choose-emp')) {
                event.target.classList.contains('checked') ? event.target.classList.remove('checked') : event.target.classList.add('checked');
            }

            this.updateInfo();
        }
        showContextMenu(event) {
            if (event.target.parentNode.classList.contains('employee')) {
                event.preventDefault();
                var contextMenu = document.querySelector('.context-menu');
                contextMenu.setAttribute('emp-id', event.target.parentNode.firstElementChild.nextElementSibling.innerText);
                contextMenu.style.display = 'inline-block';
                contextMenu.style.top = event.clientY + 'px';
                contextMenu.style.left = event.clientX + 'px';
            }
        }
        chooseEmployeeFromMenu(event) {
            if (event.target.classList.contains('check')) {
                this._checkedEmployees = [];

                var checkEl = Array.from(document.querySelectorAll('.id'))
                    .filter(id => {
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
        }
        layOff() {
            if (event.target.classList.contains('lay-off')) {
                this._employees = this._employees.filter(emp => {
                    return emp.id != event.target.parentNode.getAttribute('emp-id');
                });
                this.render();
            }
        }
        closeProps() {
            if (event.target.classList.contains('close-props')) {
                document.querySelector('.prop-container').style.display = 'none';
                document.querySelector('.shadow-block').style.display = 'none';
            }
        }
        showProperties() {
            if (event.target.classList.contains('properties')) {
                document.querySelector('.prop-container').style.display = 'flex';
                document.querySelector('.shadow-block').style.display = 'block';

                const choosed = this._employees.filter(emp => {
                    return emp.id == event.target.parentNode.getAttribute('emp-id');
                })[0];

                const employeeProps = {
                    'ID': choosed.id,
                    'Имя': choosed.name,
                    'Возраст': choosed.age,
                    'Дата поступления': `${Auxiliary.getZero(choosed.entry_date.getDate())}-${Auxiliary.getZero(choosed.entry_date.getMonth() + 1)}-${choosed.entry_date.getFullYear()}`,
                    'Дата рождения': `${Auxiliary.getZero(choosed.birth_date.getDate())}-${Auxiliary.getZero(choosed.birth_date.getMonth() + 1)}-${choosed.birth_date.getFullYear()}`,
                    'Зарплата': `${choosed.salary}`,
                    'Отдел': `${choosed.department}`,
                    'Должность': `${choosed.position}`,
                    'Время работы в компании': `${Auxiliary.getTimeFrom(choosed.entry_date)}`,
                    'Пенсия': `${(new Date().getFullYear() - choosed.entry_date.getFullYear()) * choosed.salary * 0.01}`,
                    'Налог с ЗП': `${choosed.salary * 0.13}`,
                    'Время до пенсии': `${Auxiliary.calcTimeToPension(choosed.birth_date)}`
                }

                var html = '<div class="close-props">&times;</div>';
                html += Object.keys(employeeProps).map(key => {
                    return `<div><b>${key}:</b> ${employeeProps[key]}</div>`;
                }).join('');

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
            document.body.addEventListener('click', this.closeProps);
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
            tr.innerHTML += Object.keys(this).map(key => {
                return this[key] instanceof Date ?
                    `<td class="${key}">${Auxiliary.getZero(this[key].getDate())}-${Auxiliary.getZero(this[key].getMonth() + 1)}-${this[key].getFullYear()}</td>` :
                    `<td class="${key}">${this[key]}</td>`;
            }).join('');
            return tr;
        }
    }

    class App {
        static init() {
            HttpRequest.httpGet('./data/employees.csv')
                .then(function(data) {
                    CSV.parse(data)
                        .map(employee => new Employee(employee))
                        .reduce((p, c) => p.addEmployee(c), new EmployeesTable);
                })
        }
    }

    App.init();
})();