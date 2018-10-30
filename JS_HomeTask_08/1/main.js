const encryptBtn = document.getElementById('encrypt-btn');
const decryptBtn = document.getElementById('decrypt-btn');
const text = document.getElementById('text');
const encryptedText = document.getElementById('encrypted-text');

function encrypt() {
    const symbols = text.value.split('');
    const encryptedStr = symbols.map((el) => String.fromCharCode(el.charCodeAt(0) + 1)).join('');
    encryptedText.value = encryptedStr;
}

function decrypt() {
    const symbols = encryptedText.value.split('');
    const decryptedStr = symbols.map((el) => String.fromCharCode(el.charCodeAt(0) - 1)).join('');
    text.value = decryptedStr;
}

encryptBtn.addEventListener('click', encrypt);
decryptBtn.addEventListener('click', decrypt);