; (function () {
    class App {

        static init(canvas) {
            var app = new App();
            app.canvas = document.getElementById('canvas');
            app.fileInput = document.querySelector('.img-input');
            app.context = app.canvas.getContext('2d');

            app.context.font = "16px Arial";
            app.context.fillText("Перетащите картинку сюда....", 10, 75);

            app.img = document.querySelector('.img');
            app.addDragListeners();
            app.addInputListener();
            app.addFilters();
        }

        readFile(img) {
            var app = this;
            const reader = new FileReader();
            reader.onload = function () {
                app.img.src = this.result;
                app.img.onload = function () {
                    document.querySelector('.filters').style.display = 'block';
                    app.canvas.width = app.img.width;
                    app.canvas.height = app.img.height;
                    app.context.drawImage(app.img, 0, 0);
                }
            }
            reader.readAsDataURL(img);
        }

        addDragListeners() {
            var app = this;
            app.canvas.addEventListener('dragenter', function () {
                canvas.style.borderColor = 'green';
            });
            app.canvas.addEventListener('dragleave', function () {
                canvas.style.removeProperty('border-color');
            });
            app.canvas.addEventListener('dragover', function (e) {
                e.preventDefault();
            });
            app.canvas.addEventListener('drop', function (e) {
                e.preventDefault();
                app.canvas.style.removeProperty('border-color');
                app.readFile(e.dataTransfer.files[0]);
            });
        }

        addInputListener() {
            var app = this;
            app.fileInput.addEventListener('change', function () {
                var file = app.fileInput.files[0];
                app.readFile(file);
            })
        }

        addFilters() {
            var app = this;
            document.querySelector('.negative').addEventListener('click', function () {
                app.addNegative();
            })
            document.querySelector('.grayscale').addEventListener('click', function () {
                app.addGrayscale();
            })
            document.querySelector('.sepia').addEventListener('click', function () {
                app.addSepia();
            })
            document.querySelector('.cancel').addEventListener('click', function () {
                app.removeFilter();
            })
        }

        addNegative() {
            this.removeFilter();

            var imageData = this.context.getImageData(0, 0, canvas.width, canvas.height);
            var pixels = imageData.data;
            for (var i = 0; i < pixels.length; i += 4) {
                pixels[i] = 255 - pixels[i];
                pixels[i + 1] = 255 - pixels[i + 1];
                pixels[i + 2] = 255 - pixels[i + 2];
            }
            this.context.putImageData(imageData, 0, 0);
        }

        addGrayscale() {
            this.removeFilter();

            var imageData = this.context.getImageData(0, 0, canvas.width, canvas.height);
            var pixels = imageData.data;

            for (var i = 0; i < pixels.length; i += 4) {
                var r = pixels[i];
                var g = pixels[i + 1];
                var b = pixels[i + 2];

                var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                pixels[i] = pixels[i + 1] = pixels[i + 2] = v;
            }
            this.context.putImageData(imageData, 0, 0);
        }

        addSepia() {
            this.removeFilter();

            var imageData = this.context.getImageData(0, 0, canvas.width, canvas.height);
            var pixels = imageData.data;

            for (var i = 0; i < pixels.length; i += 4) {

                var r = pixels[i];
                var g = pixels[i + 1];
                var b = pixels[i + 2];

                pixels[i] = (r * 0.393) + (g * 0.769) + (b * 0.189); // red
                pixels[i + 1] = (r * 0.349) + (g * 0.686) + (b * 0.168); // green
                pixels[i + 2] = (r * 0.272) + (g * 0.534) + (b * 0.131); // blue
            }
            this.context.putImageData(imageData, 0, 0);
        }

        removeFilter() {
            var app = this;
            this.context.drawImage(app.img, 0, 0);
        }

    }

    App.init();
})()