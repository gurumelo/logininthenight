var crypto = require("crypto");
var path = require("path");
var fs = require("fs");

var decrypt = function(toDecrypt, relativeOrAbsolutePathtoPrivateKey) {
    var absolutePath = path.resolve(relativeOrAbsolutePathtoPrivateKey);
    var privateKey = fs.readFileSync(absolutePath, "utf8");
    var buffer = new Buffer(toDecrypt, "base64");
    var decrypted = crypto.privateDecrypt({"key" : privateKey, padding : crypto.constants.RSA_PKCS1_PADDING}, buffer);
    return decrypted.toString("utf8");
};

var final = decrypt(process.argv[1], './privada.key');

console.log(final)

