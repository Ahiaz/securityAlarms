var mongoose = require('mongoose');
var Schema = mongoose.Schema;


////definicion de la "tabla" (coleccion) de la base de datos alarmas
var esquemaNotificaciones = new Schema({

clienteid: String, // en un cuarto con el nombre de clienteid es donde estara conectado el cliente
permanentes:[{//historico de notificaciones

imagen: String,
color: String,
titulo: String,
texto: String,
tipo: String, //sensor de movimiento, cierre central,
fecha: Date



}],


pendientes:[{ //se emite la notificacion, si el usuario respondio que la recibio, se borra, de lo contrario queda en cola

imagen: String,
color: String,
titulo: String,
texto: String,
tipo: String, //sensor de movimiento, cierre central,
fecha: Date

}]



}, { timestamps: true });


//exportacion del modelo a nuestra db en el server, recibe 2 parametros nombre de la coleccion y el esquema al que pertenece......
module.exports = mongoose.model('notificaciones', esquemaNotificaciones);