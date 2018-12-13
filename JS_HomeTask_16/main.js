;(function() {
    class App {

        constructor(canvas) {
            this.context = canvas.getContext('2d');
            this.radius = canvas.width / 2;
            Object.defineProperty(this, 'centerPoint', {
                get() {
                    return {
                        x: canvas.width / 2,
                        y: canvas.height / 2
                    }
                }
            })
        }
    
        static init() {
            var app = new App(document.getElementById('canvas'));
            console.log(app.context);
            
            app.drawClocks();
        }

        drawClocks() {
            this.context.clearRect(0, 0, canvas.width, canvas.height);
            this.drawLayout();
            this.drawPointers();

            requestAnimationFrame(this.drawClocks.bind(this));
        }

        drawLayout() {
            this.context.beginPath();
            this.context.strokeStyle = 'black';
            this.context.lineWidth = 3;
            this.context.arc(this.centerPoint.x, this.centerPoint.y, this.radius, 0, Math.PI * 2);
            this.context.stroke();

            this.context.save();
            this.context.globalCompositeOperation = 'destination-over';
            this.context.beginPath();
            this.context.arc(this.centerPoint.x, this.centerPoint.y, this.radius * 0.03, 0, Math.PI * 2);
            this.context.fill();
            this.context.restore();

            this.drawSegments();
            this.drawNumbers();
        }

        drawSegments() {
            this.context.save();

            this.context.translate(this.centerPoint.x, this.centerPoint.y);
            this.context.strokeStyle = 'black';

            for (var i = 1; i <= 60; ++i) {
                this.context.beginPath();
                this.context.rotate(Math.PI / 180 * 6);
                this.context.moveTo(0, -this.radius * 0.97);

                if (i % 5 == 0) {
                    this.context.lineWidth = 3;
                    this.context.lineTo(0, -this.radius * 0.87)
                } else {
                    this.context.lineWidth = 1;
                    this.context.lineTo(0, -this.radius * 0.92)
                }
                this.context.stroke();
            }

            this.context.restore();
        }

        drawNumbers() {
            this.context.save();

            this.context.translate(this.centerPoint.x, this.centerPoint.y);
            this.context.font = this.radius * 0.11 + "px impact";
            this.context.textBaseline = "middle";
            this.context.textAlign = "center";

            for (var i = 1; i <= 12; ++i) {
                this.context.rotate(Math.PI / 180 * 30);
                this.context.fillText(i.toString(), 0, -this.radius * 0.8);
            }

            this.context.restore();
        }

        drawPointers() {
            const curDate = new Date();
            this.drawSecondPointer(curDate);
            this.drawMinutePointer(curDate);
            this.drawHourPointer(curDate);
        }

        drawSecondPointer(curDate) {
            const seconds = curDate.getSeconds();

            this.context.save();

            this.context.strokeStyle = 'black';
            this.context.lineWidth = 1;
            this.context.beginPath();
            this.context.translate(this.centerPoint.x, this.centerPoint.y);
            this.context.rotate(Math.PI / 180 * seconds * 6);
            this.context.moveTo(0, 0);
            this.context.lineTo(0, -this.radius * 0.8);
            this.context.stroke();

            this.context.restore();
        }

        drawMinutePointer(curDate) {
            const minutes = curDate.getMinutes();

            this.context.save();

            this.context.strokeStyle = 'black';
            this.context.lineWidth = 3;
            this.context.beginPath();
            this.context.translate(this.centerPoint.x, this.centerPoint.y);
            this.context.rotate(Math.PI / 180 * (minutes * 6 + curDate.getSeconds() / 10));
            this.context.moveTo(0, 0);
            this.context.lineTo(0, -this.radius * 0.65);
            this.context.stroke();

            this.context.restore();
        }

        drawHourPointer(curDate) {
            var hours = curDate.getHours();

            this.context.save();

            this.context.strokeStyle = 'black';
            this.context.lineWidth = 5;
            this.context.beginPath();
            this.context.translate(this.centerPoint.x, this.centerPoint.y);

            if (hours >= 12) hours -= 12;
            this.context.rotate(Math.PI / 180 * (hours * 30 + curDate.getMinutes() / 2));

            this.context.moveTo(0, 0);
            this.context.lineTo(0, -this.radius * 0.55);
            this.context.stroke();

            this.context.restore();
        }
    
    }

    App.init();
})()