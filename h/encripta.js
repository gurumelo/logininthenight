var crypto = require("crypto");
var path = require("path");
var fs = require("fs");

console.log('cifrando: '+ process.argv[2]);


var encrypt = function(toEncrypt, relativeOrAbsolutePathToPublicKey) {
    var absolutePath = path.resolve(relativeOrAbsolutePathToPublicKey);
    var publicKey = fs.readFileSync(absolutePath, "utf8");
    var buffer = new Buffer(toEncrypt);
    var encrypted = crypto.publicEncrypt({"key" : publicKey, padding : crypto.constants.RSA_PKCS1_PADDING}, buffer);
    return encrypted.toString("base64");
};

var fin = encrypt(process.argv[2], './publica.key')
console.log(encodeURIComponent(fin));
//console.log(fin);
