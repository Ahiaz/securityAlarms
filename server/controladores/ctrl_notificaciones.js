module.exports = function(app, socket, io) {

    ////modelo de la base de datos para la coleccion "notificaciones" sirve para mapear los resultados de las consultas en el modelo respectivo
    var Notificaciones = require('../modelos/notificaciones.js');


/*



    socket.on('disconnect', function(data) { //evento que nos indica cuando se desconecto un usuario
        console.log('se desconecto un cliente ');
        //cuando un cliente se desconecta, se desconecta de todos los cuartos en donde estaba, por lo tanto el socketid (clienteid) pasaria a ser undefined (desconectado)

    });
    // *****IMPORTANTE****

    socket.on("mensaje", function(msj) { //esta funcion indica que el cliente sigue activo (ya que si pasan 55 segundos de inactividad con el server, se desconecta al cliente del mismo)
        //tambien cabe destacar que heroku tiene un timeout por defecto de 30 segundos en cada peticion, de lo contrario lanza la excepcion y se puede caer el server (por eso es bueno tener una reconexion en el socket(como este server!!))

        console.log(msj);

        //socket.leave(data.nombre_modulo); //sacamos al cliente del cuarto para que ya no puede escuchar los cambios que se realizan en el mismo

    });


    socket.on("prueba_callback", function(msj, fn) {

        if (msj !== "")

            fn(true);

        console.log(msj);

        //socket.leave(data.nombre_modulo); //sacamos al cliente del cuarto para que ya no puede escuchar los cambios que se realizan en el mismo

    });



    socket.on("enviar_mostraip", function(data) { //obtiene el ip de la mostra (nombre_modulo y ip)


        var datos = JSON.parse(data); //parseamos los datos enviados desde el cliente(como es python es necesario, con otros lenguajes mas modernos no!)


        console.log('EL IP DE LA MOSTRA: ' + datos.nombre_modulo + ' ES: ' + datos.ip);


        //socket.leave(data.nombre_modulo); //sacamos al cliente del cuarto para que ya no puede escuchar los cambios que se realizan en el mismo

    });


    socket.on("problema_script", function(nombre) { //para saber si hubo un problema

        console.log("problema con script " + nombre);

        //socket.leave(data.nombre_modulo); //sacamos al cliente del cuarto para que ya no puede escuchar los cambios que se realizan en el mismo

    });

    socket.on("scripts_conectados", function(nombre) { //para saber si todos los py conectaron al server

        console.log("script conectado " + nombre);

        //socket.leave(data.nombre_modulo); //sacamos al cliente del cuarto para que ya no puede escuchar los cambios que se realizan en el mismo

    });

    socket.on("scripts_reconectados", function(nombre) { //para saber si un script reconecto al server

        console.log("script reconectado " + nombre);

        //socket.leave(data.nombre_modulo); //sacamos al cliente del cuarto para que ya no puede escuchar los cambios que se realizan en el mismo

    });

    //EDITAR EN LA MAQUINA (CODIGO DE verificacion)

    socket.on("conectar_modulo", function(codigo_verificacion) {

        console.log('se conecto al modulo ' + codigo_verificacion);
        socket.leave(socket.id); //el socket conecta por defecto a un cuarto random...por eso debemos salir de dicho cuarto para entrar a uno propio
        socket.join(codigo_verificacion.toUpperCase()); //crea un nuevo cuarto y une a la mostra al mismo
        //todos los clientes conectado a dicho cuarto, escuchara los emits (en este caso solo la mostra)
        io.sockets.in(codigo_verificacion.toUpperCase()).emit('modulo_conectado', null);
        console.log(socket.rooms);

        //socket.leave(data.nombre_modulo); //sacamos al cliente del cuarto para que ya no puede escuchar los cambios que se realizan en el mismo

    });

    //EDITAR EN LA MAQUINA (CODIGO DE verificacion)

    socket.on('cambiar_a_recibido', function(codigo_verificacion) { //cambia el estado de la configuracion a recibido por la mostra

        Modulo.update({ codigo_verificacion: codigo_verificacion }, { //modificamos el campo para informar que el modulo tiene la ultima configuracion

            $set: {

                configuracion_enviada: true //cambiamos a true
            }

        }, function(err) {

            if (err) { console.log('ocurrio un error al actualizar el estado del modulo' + err); } else {

                console.log('se cambio el estado de la configuracion a recibida');

            }


        });



    });

    //EDITAR EN LA MAQUINA (CODIGO DE MODULO)

    socket.on('cambiar_a_recargado', function(codigo_verificacion) { //cambia el estado de la recarga a recibido por la mostra

        Modulo.update({ codigo_verificacion: codigo_verificacion }, { //modificamos el campo para informar que el modulo tiene la ultima configuracion

            $set: {

                recarga_pendiente: false //cambiamos a false
            }

        }, function(err) {

            if (err) { console.log('ocurrio un error al actualizar el estado del modulo' + err); } else {

                console.log('se cambio el estado del modulo a recargado');

            }


        });



    });

    //EDITAR EN LA MAQUINA (CODIGO DE verificacion)

    socket.on('estado_configuracion', function(codigo_verificacion, fn) { //checkea si la configuracion fue enviada o esta pendiente


        Modulo.find({ codigo_verificacion: codigo_verificacion }, function(err, configuracion) {
            if (!err) {

                /*console.log('la configuracion enviada es', configuracion[0].configuracion_enviada);
                console.log('consultando configuracion....');

                if (configuracion[0].configuracion_enviada === false) { //si esta en false

                    console.log("hay un cambio en la configuracion");

                    fn(configuracion); //callback que le indica al cliente que todo salio correctamente (siempre y cuando el cliente emita con una funcion adicional: socketIO.emit('prueba_callback', "", on_transaccion_completa)) y socketIO.wait_for_callbacks(seconds=3) para darle un chance de 3 segundos para la respuesta...si no hay respuesta el programa continua
                    //es la misma cosa que el parametro resultado que enviamos desde ladmin al emitir, solo que de otra forma (se pasa la funcion no anonima!!)

                    //io.sockets.in(nombre_modulo.toUpperCase()).emit('cambiar_configuracion', configuracion); //se emite para que solo escuche el modulo y obtenga la nueva configuracion


                } else { console.log("no hay ningun cambio en la configuracion"); }



            } else {
                console.log('ERROR AL CONSULTAR LA CONFIGURACION DEL MODULO: ' + err);
            }
        });
    });



    //EDITAR EN LA MAQUINA (CODIGO DE verificacion)
    socket.on('obtener_configuracion', function(datos) { //obtiene la configuracion del modulo, datos contiene el nombre del modulo y el codigo de la empresa

        Modulo.find({ codigo_verificacion: datos.codigo_verificacion }, function(err, configuracion) {
            if (!err) {

                console.log('se obtuvo la configuracion de los modulos ' + configuracion);

                io.sockets.in(datos.codigo_empresa.toUpperCase()).emit('listar_configuracion', configuracion); //se emite para que solo escuche la empresa(ladmin)
            } else {
                console.log('ERROR AL CONSULTAR LA CONFIGURACION DEL Modulo: ' + err);
            }
        });
    });



    socket.on("recargar_modulo", function(data, resultado) { //recarga el modulo (codigo_verificacion, nombre_modulo, cantidad_recargada, cantidad_disponible, fecha_recarga,codigo_persona,codigo_licor,nombre_licor, codigo_empresa)

        //modificamos la configuracion existente

        Modulo.update({ codigo_empresa: data.codigo_empresa, codigo_verificacion: data.codigo_verificacion }, {

            $set: {
                cantidad_disponible: data.cantidad_disponible, //despues de la suma de la cantidad disponible anterior + la cantidad recargada en ladmin
                configuracion_enviada: false, //siempre guardara la configuracion como no enviada (hasta que la mostra indique lo contrario)
                recarga_pendiente: true //se debe recargar
            }

        }, function(err) {

            if (err) {
                console.log('ocurrio un error al recargar la configuracion del modulo' + err);
                resultado({ ok: false, error: true, msg: "no se pudo recargar el modulo" });

            } else {

                //distrito-canton-provincia para llenar el arreglo de recargas
                Empresa.find({ codigo_empresa: data.codigo_empresa }, { ventas_locales: 0, personas: 0, recargas: 0 }, function(err, emp) {

                    if (!err) {


                        Empresa.update({ codigo_empresa: data.codigo_empresa }, { //como es un arreglo dentro del modelo empresa (no se podria guardar con save), se le hace push y con el upsert nos aseguramos que cree el registro si no existe

                            $push: {
                                'recargas': {
                                    codigo_modulo: data.codigo_verificacion,
                                    nombre_modulo: data.nombre_modulo,
                                    cantidad: data.cantidad_recargada,
                                    fecha_recarga: data.fecha_recarga,
                                    codigo_persona: data.codigo_persona,
                                    codigo_licor: data.codigo_licor,
                                    nombre_licor: data.nombre_licor,
                                    distrito: emp[0].distrito,
                                    canton: emp[0].canton,
                                    provincia: emp[0].provincia, //

                                }
                            }
                            //
                        }, { "upsert": true }, function(err) {

                            if (err) { console.log('ocurrio un error al recargar el modulo' + err); } else {


                                console.log('modulo recargado correctamente');

                                resultado({ ok: true, error: false });


                                Modulo.find({ codigo_empresa: data.codigo_empresa }, function(err, modulos) { //listamos los modulos de la empresa
                                    if (!err) {

                                        console.log('se obtuvo los modulos de la empresa ' + modulos);


                                        io.sockets.in(data.codigo_empresa.toUpperCase()).emit('listar_modulos', modulos); //se emite para que solo escuche la empresa(ladmin) y enliste los modulos 


                                    } else {
                                        console.log('ERROR AL CONSULTAR LOS MODULOS: ' + err);
                                    }
                                });

                            }


                        });



                    } else { Console.log("error al encontrar empresa"); }

                });



            }


        });


    });


    socket.on('verificar_modulo', function(codigo_verificacion, resultado) { //verifica el codigo de verificacion del módulo, si es correcto se registra el módulo

        //el find devuelve un arreglo, mientras que findone un registro

        Modulo.findOne({ codigo_verificacion: codigo_verificacion }, function(err, modulo) {
            if (!err) {

                if (modulo) { //existe, por lo tanto el codigo de verificacion es correcto

                    //verificar aca si el modulo esta en uso, de lo contrario podria dar problemas si otro consigue el codigo de verificacion
                    resultado({ ok: true, error: false });

                } else { resultado({ ok: false, error: true }); }

            } else {
                console.log('ERROR AL CONSULTAR LOS MODULOS: ' + err);
            }
        });
    });



    socket.on('crear_modulo', function(data, resultado) { //crea un nuevo modulo (para los encargados de registrar modulos...los diseñadores de modulos)

        //no proporcionar el codigo, el nombre debera ser unico, la configuracion enviada debera estar en false al igual que la recarga pendiente

        Modulo.findOne({ nombre_modulo: data.nombre_modulo }, function(err, mod) {


            if (!mod) { //no existe, se creara


                var nuevo_modulo = new Modulo(data);

                nuevo_modulo.save(function(err) {

                    if (!err) {

                        Modulo.findOne({ nombre_modulo: data.nombre_modulo }, function(err, mod) { //recuperamos el codigo del modulo y todo el modulo (random)

                            if (!err)
                                resultado({ ok: true, error: false, modulo: mod, msg: "Módulo creado correctamente" });
                            else
                                resultado({ ok: false, error: true, msg: "No se pudo obtener el código del módulo" });


                        });


                    } else { resultado({ ok: false, error: true, msg: "no se pudo guardar el módulo intentelo más tarde" }); }


                });

            } else {

                resultado({ ok: false, error: true, msg: "el nombre de modulo ya existe, eliga otro!" });

            }

        });


    });



    socket.on("adjudicar_modulo", function(data, resultado) { //adjudica el modulo a una empresa, si el mismo fue correctamente verificado

        //codigo_verificacion

        console.log("adjudicar modulo");
        console.log(data);

        Modulo.update({ codigo_verificacion: data.codigo_verificacion }, {

            $set: {
                codigo_empresa: data.codigo_empresa,
                codigo_area: data.codigo_area,
                nombre_modulo: data.nombre_modulo,
                cantidad_disponible: data.cantidad_disponible,
                cantidad_minima: data.cantidad_minima,
                medida1: data.medida1,
                medida2: data.medida2,
                medida3: data.medida3,
                codigo_verificacion: data.codigo_verificacion,
                codigo_licor: data.codigo_licor,
                nombre_licor: data.nombre_licor,
                configuracion_enviada: false, //siempre guardara la configuracion como no enviada (hasta que la mostra indique lo contrario)
                recarga_pendiente: true //si es la primera creacion, se debe recargar
            }

        }, function(err) {

            if (err) {
                console.log('ocurrio un error al actualizar la configuracion del modulo' + err);
                resultado({ ok: false, error: true, msg: "no se pudo guardar el módulo, intentelo más tarde" });

            } else {

                console.log('modulo actualizado correctamente');

                resultado({ ok: true, error: false });


            }


        });





    });



    socket.on("guardar_configuracion", function(data, resultado) { //edita la configuracion de un modulo


        //solo es un registro de módulo, modificamos la configuracion existente del modulo (si no existe el modulo, lo crea con el upsert:true)

        //determinamos si el nombre del modulo existe en la empresa, el regex es para que ignore mayusculas y minusculas y codigo de verificacion no sea igual al existente (si encuentra el nombre en otro modulo de la empresa)

        Modulo.findOne({ codigo_empresa: data.codigo_empresa, nombre_modulo: new RegExp(["^", data.nombre_modulo, "$"].join(""), "i"), $and: [{ codigo_verificacion: { $ne: data.codigo_verificacion } }] }, function(err, result) {

            if (!err) {


                if (!result) { //no existe el nombre del modulo en otro modulo de la empresa, procedemos a guardarlo



                    Modulo.update({ codigo_empresa: data.codigo_empresa, codigo_verificacion: data.codigo_verificacion }, {

                        $set: {
                            codigo_empresa: data.codigo_empresa,
                            codigo_area: data.codigo_area,
                            nombre_modulo: data.nombre_modulo,
                            cantidad_disponible: data.cantidad_disponible,
                            cantidad_minima: data.cantidad_minima,
                            medida1: data.medida1,
                            medida2: data.medida2,
                            medida3: data.medida3,
                            codigo_verificacion: data.codigo_verificacion,
                            codigo_licor: data.codigo_licor,
                            nombre_licor: data.nombre_licor,
                            configuracion_enviada: false, //siempre guardara la configuracion como no enviada (hasta que la mostra indique lo contrario)
                            recarga_pendiente: false //si es la primera creacion, se debe recargar
                        }

                    }, function(err) {

                        if (err) {
                            console.log('ocurrio un error al actualizar la configuracion del modulo' + err);
                            resultado({ ok: false, error: true, msg: "no se pudo guardar el módulo, intentelo más tarde" });

                        } else {

                            console.log('modulo actualizado correctamente');

                            resultado({ ok: true, error: false });


                            Modulo.find({ codigo_empresa: data.codigo_empresa }, function(err, modulos) { //listamos los modulos de la empresa
                                if (!err) {

                                    console.log('se obtuvo los modulos de la empresa ' + modulos);


                                    io.sockets.in(data.codigo_empresa.toUpperCase()).emit('listar_modulos', modulos); //se emite para que solo escuche la empresa(ladmin) y enliste los modulos 


                                } else {
                                    console.log('ERROR AL CONSULTAR LOS MODULOS: ' + err);
                                }
                            });



                        }


                    });

                } else {


                    resultado({ ok: false, error: true, msg: "El nombre del módulo existe!...por favor eliga otro" });

                }



            } else { resultado({ ok: false, error: true, msg: "no se pudo guardar el módulo, intentelo más tarde" }); }



        });


    });




    socket.on('cantidad_disponible', function(datos, resultado) { //datos: codigo empresa y codigo verificacion del modulo

        Modulo.findOne({ codigo_empresa: datos.codigo_empresa, codigo_verificacion: datos.codigo_modulo}, function(err, modulo) {
            if (!err) {

                resultado({ ok: true, error: false, cantidad_disponible: modulo.cantidad_disponible });


                console.log('se obtuvo la cantidad_disponible del modulo ');


            } else {
                resultado({ ok: false, error: true });

                console.log('ERROR AL CONSULTAR cantidad disponible: ' + err);
            }
        });
    });



    socket.on('modulos_por_empresa', function(codigo_empresa) { //obtiene los modulos de la empresa (para un combobox en ladmin)

        Modulo.find({ codigo_empresa: codigo_empresa }, function(err, modulos) {
            if (!err) {

                console.log('se obtuvo los modulos de la empresa ' + modulos);

                io.sockets.in(codigo_empresa.toUpperCase()).emit('listar_modulos', modulos); //se emite para que solo escuche la empresa(ladmin)
            } else {
                console.log('ERROR AL CONSULTAR LOS MODULOS: ' + err);
            }
        });
    });

*/
};