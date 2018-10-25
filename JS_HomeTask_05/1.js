function getRandomInt(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

var arr = (function() {
    return new Array(30000)
    .fill(0)
    .map(el => {
        return {
            x: getRandomInt(-10, 10),
            y: getRandomInt(-10, 10),
            z: getRandomInt(-10, 10)
        }
    })
    .filter(el => {
        return (el.x >= -1 && el.x <= 1) && el.y > 0 && el.z > 0
    })
    .filter(el => {
        function len() {
            return Math.sqrt(el.x ** 2 + el.y ** 2 + el.z ** 2);
        }
        return len() >= 0 && len() <= 3;
    })
    .sort((a, b) => {
        function lenA() {
            return  Math.sqrt(a.x ** 2 + a.y ** 2 + a.z ** 2);
        }
        function lenB() {
            return Math.sqrt(b.x ** 2 + b.y ** 2 + b.z ** 2);
        }
        return lenA() - lenB();
    });
})();

function result() {
    return arr.slice(arr.length/2, arr.length)
              .reduce((p, c) => {
                  return {
                    x: c.x + p.x,
                    y: c.y + p.y,
                    z: c.z + p.z
                  }
              });
}

console.log(result());