var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ShortId = require('mongoose-shortid-nodeps'); //generador de codigos cortos unicos, si existe vuelve a intentarlo con otro codigo (solo funciona con .save y sin pasarle dicho campo....con update no)


////definicion de la "tabla" (coleccion) de la base de datos alarmas
var esquemaAlarmas = new Schema({
    codigo: { //genera un codigo de local random inexistente
        type: ShortId,
        len: 5, // 5 caracteres de largo
        base: 64, // Web-safe base 64 encoded string 
        alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', // solo letras mayusculas
        retries: 10 // Four retries on collision 
    }, // id del local

   // nombre: { type: String, unique: true, required: true }, //funciona cuando hacemos save, ya que verifica si existe el id (con update no)
    clienteid: String, //cedula del cliente, los emits se haran al cuarto "clienteid"
    nombre_alarma: String, 
    tipo: String, //basica, intermedia, avanzada
    fecha_ingreso: Date,
    descripcion: String,
    sonido: Boolean,
    ubicacion: String, //coordenadas
    estado: String, //activo, inactiva, bloqueada, enrevision
    logerrores: [{excepcion:String, fecha:Date}]

}, { timestamps: true });


//exportacion del modelo a nuestra db en el server, recibe 2 parametros nombre de la coleccion y el esquema al que pertenece......
module.exports = mongoose.model('alarmas', esquemaAlarmas);
