var mongoose = require('mongoose');
var Schema = mongoose.Schema;


////definicion de la "tabla" (coleccion) de la base de datos alarmas
var esquemaClientes = new Schema({

clienteid: String, // en un cuarto con el nombre de clienteid es donde estara conectado el cliente
nombrecliente: String, 
telefono: String,
correo: String,
direccion: String,
pais: String,
provincia: String,
canton: String,
distrito: String,
alarmas:[{ //un cliente puede tener mas de una alarma
codigo_alarma:String,
nombre_alarma:String,
estado:Boolean //activo, inactivo, bloqueada...etc
}]

}, { timestamps: true });


//exportacion del modelo a nuestra db en el server, recibe 2 parametros nombre de la coleccion y el esquema al que pertenece......
module.exports = mongoose.model('clientes', esquemaClientes);