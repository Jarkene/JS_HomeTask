var Company = {
    employees: [{
        name: 'Alex',
        age: 17,
        salary: 320,
        department: 'Cleaning',
        experience: 10,
        print: function () {
            console.log(`${this.name} - ${this.salary}`);
        }
    }, {
        name: 'John',
        age: 19,
        salary: 900,
        department: 'Development',
        experience: 12,
        print: function () {
            console.log(`${this.name} - ${this.salary}`);
        }
    }, {
        name: 'Jack',
        age: 24,
        salary: 1200,
        department: 'Development',
        experience: 15,
        print: function () {
            console.log(`${this.name} - ${this.salary}`);
        }
    }, {
        name: 'Kate',
        age: 22,
        salary: 800,
        department: 'Security',
        experience: 9,
        print: function () {
            console.log(`${this.name} - ${this.salary}`);
        }
    }, {
        name: 'Vasya',
        age: 27,
        salary: 500,
        department: 'Cleaning',
        experience: 8,
        print: function () {
            console.log(`${this.name} - ${this.salary}`);
        }
    }, {
        name: 'Petya',
        age: 25,
        salary: 600,
        department: 'Security',
        experience: 9,
        print: function () {
            console.log(`${this.name} - ${this.salary}`);
        }
    }],

    printAll: function () {
        this.employees.forEach(el => el.print());
    },

    addWorker: function (name, age, salary, department, experience) {
        this.employees.push({
            name,
            age,
            salary,
            department,
            experience,
            print: function () {
                console.log(`${this.name} - ${this.salary}`);
            }
        });
    },

    removeWorker: function (name) {
        this.employees = this.employees.filter(el => el.name != name);
    },

    printSorted: function() {
        var arr = this.employees;
        var sorted = arr.sort((a, b) => a.salary - b.salary);
        var sum = arr.map(el => el.salary).reduce((p, c) => p + c);

        console.log('');
        console.log('SORTED:');
        sorted.forEach(el => el.print());
        console.log(`TOTAL SALARY: ${sum}`);
    },

    minMaxAvgSalary: function () {
        var arr = this.employees;

        var min = arr.reduce((p, c) => c.salary < p.salary ? c : p);
        var max = arr.reduce((p, c) => c.salary > p.salary ? c : p);

        var avg = arr.map(el => el.salary).reduce((p, c) => p + c) / arr.length;

        console.log(`Min: ${min.name}, ${min.salary}; Max: ${max.name}, ${max.salary}; Avg: ${avg}`);
    },

    depInfo: function() {
        function getNamesOfDeps() {
            return Company.employees.map(el => el.department)
                .sort((a, b) => a > b)
                .filter((el, i, arr) => el != arr[i-1]);
        }

        function getDep(dep) {
            return Company.employees.filter(el => el.department == dep);
        }
        
        function getMaxDepSalary(dep) {
            return getDep(dep).reduce((p, c) => p.salary > c.salary ? p : c);
        }

        function calcDepAvgSalary(dep) {
            return getDep(dep)
                .map(el => el.salary)
                .reduce((p, c) => p + c) / getDep(dep).length;
        }

        function calcAvgAge(dep) {
            return getDep(dep)
                .map(el => el.age)
                .reduce((p, c) => p + c) / getDep(dep).length;
        }

        function getMaxExpEmployee(dep) {
            return getDep(dep).reduce((p, c) => p.age > c.age ? p : c);
        }

        console.log('');

        getNamesOfDeps().forEach(dep => console.log(`Max salary of ${dep}: ${getMaxDepSalary(dep).name}, ${getMaxDepSalary(dep).salary}`));

        console.log('');

        getNamesOfDeps().forEach(dep => console.log(`Average salary of ${dep}: ${calcDepAvgSalary(dep)}`));

        console.log('');

        getNamesOfDeps().forEach(dep => console.log(`Amount of employees of ${dep}: ${getDep(dep).length}`));

        console.log('');

        getNamesOfDeps().forEach(dep => console.log(`Average age of ${dep}: ${calcAvgAge(dep)}`));

        console.log('');

        getNamesOfDeps().forEach(dep => console.log(`Max experienced employee of ${dep}: ${getMaxExpEmployee(dep).name}, ${getMaxExpEmployee(dep).experience}`));
    }
}

Company.addWorker('Nick', 19, 1000, 'Development', 12);
Company.removeWorker('Kate');
Company.printAll();
Company.printSorted();
Company.depInfo();