var Company = {
    employees: [{
        name: 'Alex',
        age: 17,
        salary: 320,
        department: 'Cleaning',
    }, {
        name: 'John',
        age: 19,
        salary: 900,
        department: 'Development',
    }, {
        name: 'Jack',
        age: 24,
        salary: 1200,
        department: 'Development',
    }, {
        name: 'Kate',
        age: 22,
        salary: 800,
        department: 'Security',
    }, {
        name: 'Vasya',
        age: 27,
        salary: 500,
        department: 'Cleaning',
    }, {
        name: 'Petya',
        age: 25,
        salary: 600,
        department: 'Security',
    }],

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

        function getAvgMaxSalary() {
            return Company.employees.map(el => getMaxDepSalary(el.department).salary)
                .sort((a, b) => a - b)
                .filter((el, i, arr) => el != arr[i-1])
                .reduce((p, c) => p + c) / getNamesOfDeps().length;
        }

        getNamesOfDeps().forEach(dep => console.log(`Max salary of ${dep}: ${getMaxDepSalary(dep).name}, ${getMaxDepSalary(dep).salary}`));

        console.log('');

        getNamesOfDeps().forEach(dep => console.log(`Average salary of ${dep}: ${calcDepAvgSalary(dep)}`));

        console.log('');

        getNamesOfDeps().forEach(dep => console.log(`Average age of ${dep}: ${calcAvgAge(dep)}`));

        console.log('');

        console.log(`Average of Max salaries: ${getAvgMaxSalary()}`);
    }
}

Company.depInfo();