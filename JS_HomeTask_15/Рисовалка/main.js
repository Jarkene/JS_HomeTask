;(function() {
    class App {
        static init() {
            var app = new App();
            app.canvas = document.querySelector('canvas');
            app.context = app.canvas.getContext('2d');
            app.coords = [];
            app.loadCoords();
            app.addCanvasEventListeners();
        }
        addCanvasEventListeners() {
            const app = this;
            var isMouseDown = false;
            app.canvas.addEventListener('mousedown', function(e) {
                isMouseDown = true;
                app.context.beginPath();
                app.drawTo(e.clientX - app.canvas.offsetLeft, e.clientY - app.canvas.offsetTop)
                app.coords.push( {
                    x: e.clientX - app.canvas.offsetLeft,
                    y: e.clientY - app.canvas.offsetTop,
                    color: app.context.fillStyle,
                    width: app.context.lineWidth,
                } );
            })
            app.canvas.addEventListener('mouseup', function(e) {
                isMouseDown = false;
                app.coords.push('mouseup');
                console.log(app.coords.length);
                localStorage.coords = JSON.stringify(app.coords);
            })
            app.canvas.addEventListener('mousemove', function(e) {
                if (isMouseDown) {
                    app.coords.push( {
                        x: e.clientX - app.canvas.offsetLeft,
                        y: e.clientY - app.canvas.offsetTop,
                        color: app.context.fillStyle,
                        width: app.context.lineWidth,
                    } );
                    app.drawTo(e.clientX - app.canvas.offsetLeft, e.clientY - app.canvas.offsetTop);
                }
            })
        }
        loadCoords() {
            const app = this;
            window.onload =  function() {
                if (localStorage.coords != 'undefined') {
                    app.coords = JSON.parse(localStorage.coords);
                    app.coords.forEach(coord => {
                        app.drawTo(coord.x, coord.y, coord.color, coord.width);
                    })
                }
            }
        }
        drawTo(x, y, color, width) {
            this.context.fillStyle = this.context.strokeStyle = color ? color : document.querySelector('.color').value;
            this.context.lineWidth = width ? width : document.querySelector('.line-width').value;

            this.context.lineTo(x, y);
            this.context.stroke();
            
            this.context.beginPath();
            this.context.arc(x, y, this.context.lineWidth / 2, 0, Math.PI * 2);
            this.context.fill();

            this.context.beginPath();
            this.context.moveTo(x, y);
        }
    }

    App.init();
})()