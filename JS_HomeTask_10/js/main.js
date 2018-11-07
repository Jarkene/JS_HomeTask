class Table {
    constructor(rows, cols) {
        this.DOM = this.createTable(rows, cols);
    }

    createTable(rows, cols) {
        var html = '<table><tbody>';
        for (var i = 0; i < rows; ++i) {
            html += '<tr>';
            for (var j = 0; j < cols; ++j) {
                html += '<td></td>';
            }
            html += '</tr>';
        }
        html += '</table></tbody>';
        document.write(html);

        return document.querySelector('table').firstChild;
    }

    getCell(row, col) {
        if (this.DOM.children[row - 1] && this.DOM.children[row - 1].children[col - 1]) {
            return {
                x: row,
                y: col,
                DOM: this.DOM.children[row - 1].children[col - 1],
            }
        } else return false;
    }

    getVectorInCol(col, row1, row2) {
        var vector = [];
        for (var row = row1; row <= row2; row++) {
            vector.push(this.getCell(row, col));
        }
        return vector;
    }

    getVectorInRow(row, col1, col2) {
        var vector = [];
        for (var col = col1; col <= col2; col++) {
            vector.push(this.getCell(row, col));
        }
        return vector;
    }

    getCellsFromVerticalVectors(...vectors) {
        var cells = [];
        for (var i = 0; i < vectors.length; ++i) {
            cells.push(...this.getVectorInCol(...vectors[i]));
        }
        return cells;
    }

    getCellsFromHorizontalVectors(...vectors) {
        var cells = [];
        for (var i = 0; i < vectors.length; ++i) {
            cells.push(...this.getVectorInRow(...vectors[i]));
        }
        return cells;
    }
}

class Playground {
    constructor(table) {
        this.table = table;
    }

    drawObstacles(cells) {
        cells.forEach(cell => cell.DOM.classList.add('obstacle'));
    }

    createStart(row, col) {
        var start = table.getCell(row, col);
        start.DOM.classList.add('start');

        return start;
    }

    createFinish(row, col) {
        var finish = table.getCell(row, col);
        finish.DOM.classList.add('finish');

        return finish;
    }
}

class Player {
    constructor(playground, start) {
        this.setCellPosition(start, 'player-up');
        this.playground = playground;

        this.eventListeners = {
            move: function (event) {
                if (event.code == 'ArrowUp') {
                    player.move.up();
                }

                if (event.code == 'ArrowLeft') {
                    player.move.left();
                }


                if (event.code == 'ArrowDown') {
                    player.move.down();
                }

                if (event.code == 'ArrowRight') {
                    player.move.right();
                }
            },

            win: () => {
                if (this.isWin()) {
                    System.winMsg(player.playground);
                    System.removeAllEventListeners(this);
                }
            },

            lose: () => {
                if (this.isLose()) {
                    System.loseMsg(player.playground);
                    System.removeAllEventListeners(this);
                }
            }

        }

        this.move = {
            up: () => {
                var nextUp = this.playground.table.getCell(this.curCell.x - 1, this.curCell.y);
                if (nextUp && !nextUp.DOM.classList.contains('obstacle')) {
                    this.setCellPosition(nextUp, 'player-up');
                }
            },

            left: () => {
                var nextLeft = this.playground.table.getCell(this.curCell.x, this.curCell.y - 1);
                if (nextLeft && !nextLeft.DOM.classList.contains('obstacle')) {
                    player.setCellPosition(nextLeft, 'player-left');
                }
            },

            down: () => {
                var nextDown = this.playground.table.getCell(this.curCell.x + 1, this.curCell.y);
                if (nextDown && !nextDown.DOM.classList.contains('obstacle')) {
                    player.setCellPosition(nextDown, 'player-down');
                }
            },

            right: () => {
                var nextRight = this.playground.table.getCell(this.curCell.x, this.curCell.y + 1);
                if (nextRight && !nextRight.DOM.classList.contains('obstacle')) {
                    player.setCellPosition(nextRight, 'player-right');
                }
            }
        }
    }

    setCellPosition(cell, className) {
        if (this.curCell) this.curCell.DOM.innerHTML = '';
        this.curCell = cell;
        this.curCell.DOM.innerHTML = `<img src="./img/player.png" class="player ${className}">`;
    }

    isLose() {
        if (this.curCell.DOM.classList.contains('enemy')) {
            return true;
        }
    }

    isWin() {
        if (this.curCell.DOM.classList.contains('finish')) {
            return true;
        }
    }
}

class System {

    static addEventListeners(player) {
        document.addEventListener('keydown', player.eventListeners.move);
        document.addEventListener('keydown', player.eventListeners.win);
        document.addEventListener('keydown', player.eventListeners.lose);
    }

    static removeAllEventListeners(player) {
        document.removeEventListener('keydown', player.eventListeners.move);
        document.removeEventListener('keydown', player.eventListeners.win);
        document.removeEventListener('keydown', player.eventListeners.lose);
    }

    static winMsg(playground) {
        playground.table.DOM.style.display = 'none';

        var winMsg = document.createElement('div');
        winMsg.innerHTML = 'Вы выиграли!';
        winMsg.classList.add('win');

        var body = document.querySelector('body');
        body.appendChild(winMsg);
    }

    static loseMsg(playground) {
        playground.table.DOM.style.display = 'none';

        var winMsg = document.createElement('div');
        winMsg.innerHTML = 'Вы проиграли!';
        winMsg.classList.add('win');

        var body = document.querySelector('body');
        body.appendChild(winMsg);
    }
}

var obstacles = {

    horizontal: [
        [1, 1, 8],
        [2, 12, 15],
        [3, 4, 5], [3, 7, 8],
        [4, 10, 15], [4, 19, 20],
        [5, 1, 2], [5, 4, 10],
        [6, 2, 4], [6, 6, 6], [6, 12, 17],
        [8, 2, 2], [8, 10, 13],
        [9, 1, 4], [9, 17, 18],
        [10, 8, 11], [10, 13, 15],
        [11, 2, 2], [11, 4, 6],
        [12, 2, 4], [12, 6, 6], [12, 10, 15], [12, 17, 18],
        [14, 2, 4], [14, 6, 8], [14, 10, 13],
    ],
    vertical: [
        [2, 3, 6], [2, 11, 12],
        [3, 12, 14],
        [4, 3, 6], [4, 7, 9],
        [6, 6, 11],
        [7, 14, 15],
        [8, 5, 8], [8, 12, 14],
        [10, 2, 6], [10, 8, 10], [10, 12, 14],
        [12, 2, 4], [12, 6, 8],
        [15, 4, 10], [15, 12, 15],
        [17, 1, 2], [17, 4, 10], [17, 12, 15],
        [19, 2, 6], [19, 8, 10], [19, 12, 12], [19, 14, 15]
    ]

}

var table = new Table(15, 20);
var playground = new Playground(table);
var start = playground.createStart(15, 16);
var finish = playground.createFinish(4, 1);
var player = new Player(playground, start);

playground.drawObstacles(table.getCellsFromHorizontalVectors(...obstacles.horizontal));
playground.drawObstacles(table.getCellsFromVerticalVectors(...obstacles.vertical));

System.addEventListeners(player);

class Enemy {
    constructor(playground, row, col) {
        this.playground = playground;
        this.setPosition(row, col);
        this.move();
    }

    setPosition(row, col) {
        if (this.curCell) {
            this.curCell.DOM.innerHTML = '';
            this.curCell.DOM.classList.remove('enemy');
        }
        this.curCell = this.playground.table.getCell(row, col);
        this.curCell.DOM.classList.add('enemy');
        this.curCell.DOM.innerHTML = '<img src="./img/enemy.png" class="enemy">';
    }

    move() {
        var directions = {
            up: this.playground.table.getCell(this.curCell.x - 1, this.curCell.y),
            left: this.playground.table.getCell(this.curCell.x, this.curCell.y - 1),
            down: this.playground.table.getCell(this.curCell.x + 1, this.curCell.y),
            right: this.playground.table.getCell(this.curCell.x, this.curCell.y + 1),
        }

        function getRandomInt(min, max) {
            return Math.round(Math.random() * (max - min)) + min;
        }

        function randomizeDirection() {
            return Object.keys(directions)[getRandomInt(0, 3)];
        }

        var randDirection = randomizeDirection();
        var curDirection = directions[randDirection];

        if (curDirection && !curDirection.DOM.classList.contains('obstacle')) {
            console.log(curDirection);
        }
    }
}

var enemies = [
    new Enemy(playground, 10, 1)
]

// var startEnemiesCells = [table.getCell(15, 1), table.getCell(13, 4), table.getCell(4, 8), table.getCell(3, 13), table.getCell(5, 20), table.getCell(7, 13)];

// startEnemiesCells.forEach(function (curEnemyCell) {
//     curEnemyCell.DOM.innerHTML = '<img src="./img/enemy.png" class="enemy">';

//     function enemyLogic() {

//         function getDirection() {
//             return {
//                 up: table.getCell(curEnemyCell.x - 1, curEnemyCell.y),
//                 left: table.getCell(curEnemyCell.x, curEnemyCell.y - 1),
//                 down: table.getCell(curEnemyCell.x + 1, curEnemyCell.y),
//                 right: table.getCell(curEnemyCell.x, curEnemyCell.y + 1),
//             }
//         }

//         function getRandomInt(min, max) {
//             return Math.round(Math.random() * (max - min)) + min;
//         }

        // var randDirection = randomizeDirection();
        // var curDirection = getDirection()[randDirection];

//         function move() {

//             curDirection = getDirection()[randDirection];

//             if (curDirection && !curDirection.DOM.classList.contains('obstacle')) {
//                 curEnemyCell.DOM.classList.remove('enemy');
//                 curEnemyCell.DOM.innerHTML = '';
//                 curEnemyCell = curDirection;
//                 curEnemyCell.DOM.innerHTML = '<img src="./img/enemy.png" class="enemy">';
//                 curDirection = getDirection()[randDirection];
//                 curEnemyCell.DOM.classList.add('enemy');
//                 var timer = setTimeout(move, 300);

//                 if (curCell.DOM.classList.contains('enemy')) {
//                     table.DOM.style.display = 'none';

//                     var winMsg = document.createElement('div');
//                     winMsg.innerHTML = 'Вы проиграли!';
//                     winMsg.classList.add('win');

//                     var body = document.querySelector('body');
//                     body.appendChild(winMsg);

//                     clearTimeout(timer);
//                 }

//             } else {
//                 randDirection = randomizeDirection();
//                 move();
//             }

//         }

//         move();

//     }

//     enemyLogic();
// })