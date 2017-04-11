var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var usuarisSchema = new Schema({
    correo: { type: String, unique: true, required: true },
    contrasena: { type: String, required: true }
});

module.exports = mongoose.model('Usuaris', usuarisSchema);
