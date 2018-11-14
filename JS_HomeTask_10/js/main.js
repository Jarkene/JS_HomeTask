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
        var start = this.table.getCell(row, col);
        start.DOM.classList.add('start');

        return start;
    }

    createFinish(row, col) {
        var finish = this.table.getCell(row, col);
        finish.DOM.classList.add('finish');

        return finish;
    }
}

class Player {
    constructor(playground, start) {
        this.setCellPosition(start, 'player-up');
        this.playground = playground;

        this.eventListeners = {
            move: () => {
                if (event.code == 'ArrowUp') {
                    this.move.up();
                }

                if (event.code == 'ArrowLeft') {
                    this.move.left();
                }

                if (event.code == 'ArrowDown') {
                    this.move.down();
                }

                if (event.code == 'ArrowRight') {
                    this.move.right();
                }
            },

            win: () => {
                if (this.isWin()) {
                    System.winMsg(this.playground);
                    System.removeAllEventListeners(this);
                    this.curCell.DOM.classList.remove('player');
                }
            },

            lose: () => {
                if (this.isLose()) {
                    System.loseMsg(this.playground);
                    System.removeAllEventListeners(this);
                    this.curCell.DOM.classList.remove('player');
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
                    this.setCellPosition(nextLeft, 'player-left');
                }
            },

            down: () => {
                var nextDown = this.playground.table.getCell(this.curCell.x + 1, this.curCell.y);
                if (nextDown && !nextDown.DOM.classList.contains('obstacle')) {
                    this.setCellPosition(nextDown, 'player-down');
                }
            },

            right: () => {
                var nextRight = this.playground.table.getCell(this.curCell.x, this.curCell.y + 1);
                if (nextRight && !nextRight.DOM.classList.contains('obstacle')) {
                    this.setCellPosition(nextRight, 'player-right');
                }
            }
        }
    }

    setCellPosition(cell, className) {
        if (this.curCell) {
             this.curCell.DOM.innerHTML = '';
             this.curCell.DOM.classList.remove('player');
        }
        this.curCell = cell;
        this.curCell.DOM.innerHTML = `<img src="./img/player.png" class="player-img ${className}">`;
        this.curCell.DOM.classList.add('player');
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
        document.body.appendChild(winMsg);
    }

    static loseMsg(playground) {
        playground.table.DOM.style.display = 'none';

        var winMsg = document.createElement('div');
        winMsg.innerHTML = 'Вы проиграли!';
        winMsg.classList.add('lose');

        document.body.appendChild(winMsg);
    }

    static initDefault() {
        var obstacles = {

            horizontal: [
                [1, 1, 10],
                [2, 12, 15],
                [3, 4, 5], [3, 7, 8],
                [4, 10, 15], [4, 19, 20],
                [5, 1, 2], [5, 4, 10],
                [6, 6, 6], [6, 12, 17],
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
                [4, 3, 7],
                [6, 6, 7], [6, 9, 11],
                [7, 14, 15],
                [8, 5, 8], [8, 12, 14],
                [10, 1, 2], [10, 6, 10], [10, 12, 14],
                [12, 1, 4], [12, 6, 8],
                [15, 6, 10], [15, 12, 15],
                [17, 1, 2], [17, 4, 10], [17, 12, 15],
                [19, 2, 6], [19, 8, 10], [19, 12, 12], [19, 14, 15]
            ]
        }
        
        var table = new Table(15, 20);
        var playground = new Playground(table);
        var start = playground.createStart(15, 16);
        var finish = playground.createFinish(4, 1);
        var player = new Player(playground, start);
        console.log(table.getCell(9, 8).DOM.classList)
        
        playground.drawObstacles(table.getCellsFromHorizontalVectors(...obstacles.horizontal));
        playground.drawObstacles(table.getCellsFromVerticalVectors(...obstacles.vertical));
        
        var enemies = [
            new Enemy(player, 10, 1),
            new Enemy(player, 6, 7),
            new Enemy(player, 5, 20),
            new Enemy(player, 2, 1),
            new Enemy(player, 3, 20),
            new Enemy(player, 15, 8),
            new Enemy(player, 7, 13),
            new Enemy(player, 1, 13),
        ]
        
        System.addEventListeners(player);
    }
}

class Enemy {
    constructor(player, row, col) {
        this.player = player;
        this.setPosition(this.player.playground.table.getCell(row, col));

        this.enemyLogic();
    }

    getDirections() {
        return {
            up: this.player.playground.table.getCell(this.curCell.x - 1, this.curCell.y),
            left: this.player.playground.table.getCell(this.curCell.x, this.curCell.y - 1),
            down: this.player.playground.table.getCell(this.curCell.x + 1, this.curCell.y),
            right: this.player.playground.table.getCell(this.curCell.x, this.curCell.y + 1),
        }
    }

    setPosition(cell) {
        if (this.curCell) {
            this.curCell.DOM.innerHTML = '';
            this.curCell.DOM.classList.remove('enemy');
        }
        this.curCell = cell;
        this.curCell.DOM.classList.add('enemy');
        this.curCell.DOM.innerHTML = '<img src="./img/enemy.png" class="enemy">';
    }

    enemyLogic() {
        var getRandomInt = function(min, max) {
            return Math.round(Math.random() * (max - min)) + min;
        }

        var directions = this.getDirections();

        var randomizeDirection = function() {
            return Object.keys(directions)[getRandomInt(0, 3)];
        }

        var randDirection = randomizeDirection.bind(this)();
        var curDirection = directions[randDirection];

        if (curDirection && !curDirection.DOM.classList.contains('obstacle')) {
            this.timer = setInterval(() => {
                this.setPosition(curDirection);

                directions = this.getDirections();
                curDirection = directions[randDirection];

                if (!curDirection || curDirection.DOM.classList.contains('obstacle')) {
                    clearInterval(this.timer);
                    this.enemyLogic();
                };

                if (this.curCell.DOM.classList.contains('player')) {
                    this.player.curCell.DOM.classList.remove('player');
                    System.loseMsg(this.player.playground);
                    System.removeAllEventListeners(this.player);
                }
            }, 180);
        } else {
            this.enemyLogic();
        }
    }
}

System.initDefault();