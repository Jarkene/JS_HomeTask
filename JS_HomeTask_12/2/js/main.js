function loadCategories() {
    document.querySelector('.container').innerHTML = '';

    var xhr = new XMLHttpRequest();
    xhr.open('GET', './data/categories.json', true);
    xhr.onload = function () {
        document.querySelector('.categories').innerHTML += JSON.parse(this.responseText).map(category => {
            return `<a class="category" href="${category.path}">${category.title.toUpperCase()}</a>`
        }).join('');
        document.querySelector('.categories').addEventListener('click', function (e) {
            if (e.target.classList.contains('category')) {
                loadSubCategories(e.target.getAttribute('href'));
                e.preventDefault();
            }
        })
    }
    xhr.send(null);
}

function loadSubCategories(path) {
    document.querySelector('.container').innerHTML = '';

    var xhr = new XMLHttpRequest();
    xhr.open('GET', path, true);
    xhr.onload = function () {
        document.querySelector('.container').innerHTML += JSON.parse(this.responseText).map(subCat => {
            return `<a href="#" class="subcat" data-path="${subCat.path}">
                        <img class="subcat-img" src="${subCat.img}" />
                        <div class="subcat-text">${subCat.title}</div>
                    </a>`
        }).join('');

        document.querySelector('.container').addEventListener('click', subCatClick);
    }
    xhr.send(null);
}

function subCatClick(e) {
    if (e.target.parentNode.classList.contains('subcat')) {
        loadArticlesList(e.target.parentNode.getAttribute('data-path'), e.target.parentNode.lastElementChild.innerHTML);
    }
}

function loadArticlesList(path, subCatName) {
    document.querySelector('.container').innerHTML = '';
    document.querySelector('.container').removeEventListener('click', subCatClick);
    document.querySelector('.container').innerHTML = `<h1 class="subcat-title">${subCatName}</h1>`;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', path, true);
    xhr.onload = function () {
        document.querySelector('.container').innerHTML += JSON.parse(this.responseText).map(preview => {
            return `<div class="article">
                        <img class="article-img" src="${preview.img}" />
                        <a href="${preview.fullText}" prev-path="${path}" class="article-title">${preview.title}</a>
                        <span class="article-short">${preview.shortText}</span>
                        <div class="article-info">
                            <div class="article-date">
                                <img class="article-icon" src="${preview.date.img}" />
                                <span>&nbsp;${preview.date.value}</span>
                            </div>
                            <div class="article-views">
                                <img class="article-icon" src="${preview.views.img}" />
                                <span>&nbsp;${preview.views.value}</span>
                            </div>
                            <div class="rating">
                                <img class="article-icon" src="${preview.rating.img}" />
                                <span>&nbsp;${preview.rating.value}</span>
                            </div>
                        </div>
                    </div>`
        }).join('');
        document.querySelector('.container').addEventListener('click', articleClick);
    }
    xhr.send(null);
}

function articleClick(e) {
    if (e.target.classList.contains('article-title')) {
        loadArticle(e.target.getAttribute('href'), e.target.getAttribute('prev-path'), e.target.parentNode.parentNode.firstElementChild.innerHTML);
        e.preventDefault();
    }
}

function loadArticle(path, prevPath, subCatName) {
    document.querySelector('.container').removeEventListener('click', articleClick);

    var xhr = new XMLHttpRequest();
    xhr.open('GET', path, true);
    xhr.onload = function () {
        document.querySelector('.container').innerHTML =
           `<div class="article-navigation">
                <a class="article-nav-btn" href=#>Вернуться назад</a>
            </div>`;

        document.querySelector('.container').innerHTML += this.responseText;

        document.querySelector('.article-nav-btn').addEventListener('click', function(e) {
            e.preventDefault();
            loadArticlesList(prevPath, subCatName);
        });
    }
    xhr.send(null);
}

function getIcon(elem) {
    var img = document.createElement('img');
    img.classList.add('icon');

    var xhr = new XMLHttpRequest();
    xhr.open('GET', './data/icons.json', true);
    xhr.onload = function () {
        var icons = JSON.parse(this.responseText);
        img.src = icons.filter(icon => elem.classList.contains(icon.title))[0].path;
        elem.appendChild(img);
    }
    xhr.send(null);
}

function loadStartPage() {
    document.querySelector('.container').innerHTML = '';

    var div = document.createElement('div');
    var container = document.querySelector('.container');

    var xhr = new XMLHttpRequest();
    xhr.open('GET', './data/start.json', true);
    xhr.onload = function () {
        var startMsg = JSON.parse(this.responseText).text;

        div.innerHTML = startMsg;
        div.classList.add('start');

        container.appendChild(div);
    }
    xhr.send(null);
}

document.querySelector('.logo').addEventListener('click', loadStartPage);

loadStartPage();

loadCategories();