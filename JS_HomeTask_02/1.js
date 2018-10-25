// 1. Проверить правильность расстановки скобок в строке

var inpStr = prompt('Input string: ');

function checkBrackets(str) {
    var brackets = '';

    for (var i = 0; i < str.length; ++i) {
        if (str[i] == '(' || str[i] == ')') {
            brackets += str[i];
        }
    }

    for (var i = 0; i < brackets.length; ++i) {
        if (brackets[i] == '(' && brackets[i + 1] == ')') {
            var arr = brackets.split('');
            arr.splice(i, 2);
            brackets = arr.join('');
            i -= 2;
        }
    }

    if (brackets) return false;
    return true;
}

if (inpStr) {
    document.write(`Your string: ${inpStr} <br>`);

    if (checkBrackets(inpStr)) {
        document.write('Correct string');
    } else {
        document.write('Incorrect string');
    }
}