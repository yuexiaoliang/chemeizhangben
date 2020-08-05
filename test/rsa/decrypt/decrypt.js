const fs = require('fs'),
    crypto = require('crypto');

const pubKey = fs.readFileSync('./rsa_pub.pem', 'utf8');
const mac = '60:45:cb:19:6c:c3';
const encryptedString =
    '18fdbd60de49f3389bb58acd52eb663e71eb8d0ffdeb32e0c84af29958bb7956bbb746e2d6c1faf84742ca9ce286cb90c6186c3f9ae72141c36ee72c126b5a106a5841b386d8e4598b03842d822a4c6f660e063a54db226f5aabdaf3b90f3c3ee73ac2ed14cfa2105e2b48cd365e78995ecd26774debe83705d0fb29dff9bc06af55bdbe0223caa2136410da50c019db7056fa8f54359c0a2ba241e00f3fc7548b7f2900ca7e6281a97d31561f317130daf8ae419fcaa6994e67b28d90de72c8b1a4b3acc2dabcbe977de21d50773cc9176ae4e098fb0ef8ab852a125fcd71ddf7f929c83a8ecf7269f6699a07c2e340aa2d9bdf148db768692a5685f021ce36';

let decryptedString = crypto
    .publicDecrypt(pubKey, Buffer.from(encryptedString, 'hex'))
    .toString('utf8');

console.log(decryptedString === mac);
