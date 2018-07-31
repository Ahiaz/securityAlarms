 module.exports = function(app) {

    ////modelo de la base de datos para la coleccion "empresas"
    var Empresa = require('../modelos/empresas.js');
    var Modulo = require('../modelos/modulos.js'); //para poder hacerle CRUD a modulos
    var Licor = require('../modelos/licores.js'); //para poder hacerle CRUD a licores
    var Venta = require('../modelos/ventas.js'); //para poder hacerle CRUD a ventas globales


	//escuchara peticiones HTTPGET en dicho link: http://lamostra.heroku.com/get_transaccion/id 
    //RECORDAR QUE ESTO ES INSEGURO

     app.get('/get_transaccion/:id&id2', function(req, res) {
        var cantidad_actual = 0; //conserva la cantidad actual de ml que tiene la mostra

        var precio = 0; //conserva el precio

      console.log(req.query.id);
      console.log(req.query.id2);

        res.send('listo');

      /*  Modulo.find({ nombre_modulo: datos.nombre_modulo }, function(err, modulo) {

            if (!err) {

                console.log('se obtuvo el codigo y nombre licor ' + modulo);

//
                console.log('modulo codigo licor ' + modulo[0].codigo_licor);



                Licor.findOne({ codigo_licor: modulo[0].codigo_licor }, function(err, resultado) {
                    if (!err) {

                        console.log("licor " + resultado);

                        //el precio se calcula en base a la cantidad de ml vendidos (medida1 -2 -3)

                        console.log('modulo medida1'+modulo[0].medida1+ ' datos.cantidad_ml '+datos.cantidad_ml);
                        
                        if (String(modulo[0].medida1) === String(datos.cantidad_ml)) { //es el precio1

                            console.log("el precio 1 es: " + resultado.precio1);

                            precio = resultado.precio1;


                        }

                        if (String(modulo[0].medida2) === String(datos.cantidad_ml)) {// precio 2


                            console.log("el precio 2 es: " + resultado.precio2);

                            precio = resultado.precio2;

                        }


                        if (String(modulo[0].medida3) === String(datos.cantidad_ml)) { //precio 3


                            console.log("el precio 3 es: " + precio3);

                            precio = resultado.precio3;

                        }

                        //determinamos el distrito y canton de la empresa
                        Empresa.find({ codigo_empresa: modulo[0].codigo_empresa }, function(err, empresa) {

                            if (!err) { //actualizamos las ventas locales de la empresa si no hay error


                                Empresa.update({ codigo_empresa: modulo[0].codigo_empresa }, { //como es un arreglo dentro del modelo empresa (no se podria guardar con save), se le hace push y con el upsert nos aseguramos que cree el registro si no existe


                                    $push: {
                                        'ventas_locales': {

                                            fecha: datos.fecha,
                                            hora: datos.hora,
                                            minutos: datos.minutos,
                                            nombre_modulo: datos.nombre_modulo,
                                            codigo_licor: modulo[0].codigo_licor,
                                            nombre_licor: modulo[0].nombre_licor,
                                            cantidad_ml: datos.cantidad_ml,
                                            precio: precio,
                                            distrito: empresa[0].distrito,
                                            canton: empresa[0].canton,
                                            provincia: empresa[0].provincia

                                        }
                                    }

                                }, { "upsert": true }, function(err) { //lo crea si no existe

                                    if (err) { console.log('ocurrio un error en la transaccion' + err); } else {

                                        cantidad_actual = parseFloat(modulo[0].cantidad_disponible) - parseFloat(datos.cantidad_ml); //cantidad actual de ml en el modulo

                                        console.log('cantidad_actual ',cantidad_actual);

                                        if (cantidad_actual < 0) { cantidad_actual = 0; } //si es menor a cero, lo seteamos en cero


                                        console.log('transaccion exitosa');

                                        res.send("completa"); //transaccion completa

                                        //io.sockets.in(datos.nombre_modulo.toUpperCase()).emit('transaccion_completa', null); //se emite para que solo escuche la MOSTRA

                                        //Creamos un nuevo registro en ventas (globales)

                                        var venta = {

                                            fecha: Date,
                                            hora: Number,
                                            minutos: Number,
                                            nombre_modulo: String,
                                            codigo_empresa: String,
                                            cantidad_ml: Number,
                                            nombre_licor: String,
                                            distrito: String,
                                            canton: String,
                                            provincia: String
                                        };

                                        venta.fecha = datos.fecha;
                                        venta.hora = datos.hora;
                                        venta.minutos = datos.minutos;
                                        venta.nombre_modulo = datos.nombre_modulo;
                                        venta.codigo_empresa = modulo[0].codigo_empresa;
                                        venta.cantidad_ml = datos.cantidad_ml;
                                        venta.nombre_licor = resultado.nombre_licor;
                                        venta.distrito = empresa[0].distrito;
                                        venta.canton = empresa[0].canton;
                                        venta.provincia = empresa[0].provincia;

                                        var venta_nueva = new Venta(venta); //creamos un nuevo registro de venta

                                        //salva la venta global en la base de datos
                                        venta_nueva.save(function(err) {
                                            if (!err) {


                                                console.log('se guardo la venta global ');



                                                Modulo.update({ nombre_modulo: datos.nombre_modulo }, { //modificamos el campo cantidad_disponible

                                                    $set: {

                                                        cantidad_disponible: cantidad_actual
                                                    }

                                                }, function(err) {

                                                    if (err) { console.log('ocurrio un error al actualizar la cantidad_ml del modulo' + err); } else {

                                                        console.log('cantidad_ml del modulo actualizado correctamente');

                                                    }


                                                });


                                            } else {



                                                console.log('ERROR AL GUARDAR la venta global EN LA BASE DE DATOS: ' + err);

                                            }
                                        });


                                    }


                                });


                            } else {

                                console.log("error al encontrar empresa");


                            }


                        });



                    } else {
                        console.log('ERROR AL CONSULTAR LOS LICORES: ' + err);

                    }
                });




            } else {
                console.log('ERROR EN NUEVA TRANSACCION: ' + err);
            }
        });
*/





     });


 };
