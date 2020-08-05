const fs = require('fs'),
    crypto = require('crypto');

const prvKey = fs.readFileSync('./rsa_prv.pem', 'utf8');
const mac = '60:45:cb:19:6c:c3';

let encryptedString = crypto
    .privateEncrypt(prvKey, Buffer.from(mac, 'utf8'))
    .toString('hex');
console.log(encryptedString);
