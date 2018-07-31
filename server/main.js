var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server); 

var mongoose = require('mongoose');

//INICIALIZA TODO EL SERVER---LA CONEXION CON EL SOCKET Y LA CONEXION CON MONGO

mongoose.Promise = global.Promise;


////se conecta a la base de datos mongoDB en MLABS
mongoose.connect('mongodb://hugestudioteam:#HUGEstudio123@ds259361.mlab.com:59361/alarmas');

//para hacer request con httpGet sin necesidad de estar conectado a un socket (io.on(connection)) con el objetivo de que retorne un dato (cosa que no hace los sockets por ser asincronicos)
//require('./obtener_http/get_transaccion')(app);

//servir archivos estaticos(.js .html...) en un directorio publico para que puedan ser descargables
app.use(express.static('public'));


//se recibe el evento de conexion del socket y declaramos los controladores que estaran a la escucha de los eventos del socket
io.on('connection', function(socket) {

    //espera cualquier evento relacionado con alarmas
    require('./controladores/ctrl_alarmas')(app, socket, io);

    //espera cualquier evento relacionado con clientes
   require('./controladores/ctrl_clientes')(app, socket, io);

    //espera cualquier evento relacionado con notificaciones
	require('./controladores/ctrl_notificaciones')(app, socket, io);


});

server.listen((process.env.PORT || 8080), function() {
    console.log('servidor corriendo en localhost:' + process.env.PORT || 8080); //esto es por si queremos un server corriendo en el local host con npm start
});
