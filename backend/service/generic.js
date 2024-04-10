const crypto = require('crypto');
let algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
const password_generator = require('generate-password');
const { userModel } = require('../model/user');

codeLengthPad = (code, length) => {
    var str = '' + code;
    while(str.length < length) {
        str = '0' + str;
    }
    return str;
}

genRandomPassword = async (len, uCase, numb, symb) => {
    let passwd = password_generator.generate({
        length: len,
        uppercase: uCase,
        numbers: numb,
        symbols: symb
    });
    // console.log('user password ', passwd); //cricital - remove this in production
    return passwd;
}

getEncrypt = (value) => {
    let cipher = crypto.createCipheriv(algorithm, process.env.CRYPTO_KEY, process.env.CRYPTO_IV);  
    let encrypted = cipher.update(value, 'utf8', 'hex') + cipher.final('hex');
    return encrypted;
}

getDecrypt = (value) => {
    let decipher = crypto.createDecipheriv(algorithm, process.env.CRYPTO_KEY, process.env.CRYPTO_IV);
    let decrypted = decipher.update(value, 'hex', 'utf8') + decipher.final('utf8');
    return decrypted;
}

function toCamelCase(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

module.exports = {
    codeLengthPad,
    genRandomPassword,
    getEncrypt,
    getDecrypt,
    toCamelCase
}