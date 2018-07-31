module.exports = function(app, socket, io) {

    ////modelo de la base de datos para la coleccion "alarmas"//// sirve para mapear los resultados de las consultas en el modelo respectivo
    var Alarmas = require('../modelos/alarmas.js');


    var bcrypt = require('bcrypt'); //encripta la clave del usuario
    var nodemailer = require('nodemailer'); //utilizaremos nodemailer para enviar correos electronicos
    var SALT_WORK_FACTOR = 10; //genera una encriptacion de 10


    socket.on("conectar_alarma", function(clienteid) { //conecta la alarma a un nuevo cuarto para que escuche en el mismo


        console.log('se conecto al cuarto de ' + clienteid);
        socket.leave(socket.id); //el socket conecta por defecto a un cuarto random...por eso debemos salir de dicho cuarto para entrar a uno propio
        socket.join(clienteid.toUpperCase()); //crea un nuevo cuarto nombrado "clienteid", cualquiera que se conecte en este cuarto escuchara los emits realizados dentro del mismo
        io.sockets.in(clienteid.toUpperCase()).emit('alarma_conectada', {conectado:true}); //se emitira los datos a la función alarma_conectada en el lado del cliente

    });

/*
//http://ourcodeworld.com/articles/read/264/how-to-send-an-email-gmail-outlook-and-zoho-using-nodemailer-in-node-js

    socket.on("enviar_email", function(datos, resultado) { //envia un correo


        var transporter = nodemailer.createTransport({
            host: datos.provider, //smtp-mail.outlook.com , ...gmail etc
            secureConnection: false, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
            tls: {
                ciphers: 'SSLv3'
            },
            auth: {
                user: datos.email, //pongalamusic@outlook.com
                pass: datos.password //1q2w3e4r5t
            }
        });


        var mailOptions = {
            from: datos.email,
            to: datos.client,
            subject: datos.subject,
            text: datos.content
        };


        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
                resultado({ ok: false, error: true }); //devuelve al cliente una confirmacion de consulta exitosa..  
            } else {
                console.log('Email sent: ' + info.response);
                resultado({ ok: true, error: false }); //devuelve al cliente una confirmacion de consulta exitosa..  

            }
        });


    });


    socket.on("fecha_hora", function(fecha_hora) { //confirmamos que la mostra tiene seteada una buena hora

        console.log('la fecha y hora de la mostra es ' + fecha_hora);

    });



    socket.on("GMT-6", function(nombre_modulo, fn) { //fecha/hora/minutos actuales


        var d = new Date();

        var fecha = {

            dia: Number,
            mes: Number,
            anio: Number,
            hora: Number, //gtm -6  
            minutos: Number,
            segundos: Number,
            sigla_mes: String
        };

        //


        console.log("la hora es: " + (d.getUTCHours() - 6) + " y minutos: " + d.getUTCMinutes() + " y segundos: " + d.getUTCSeconds());


        console.log((d.getUTCMonth() + 1) + "/" + d.getUTCDate() + "/" + d.getUTCFullYear());

        if (d.getUTCHours >= 0 & d.getUTCHours <= 6) { //restarle -1 al dia

            console.log("-1 al dia de la fecha ");

            if (d.getUTCDate === 1) { //cambio de mes
                ////

                if ((d.getUTCMonth() + 1) === 3 || (d.getUTCMonth() + 1) === 5 || (d.getUTCMonth() + 1) === 7 || (d.getUTCMonth() + 1) === 8 || (d.getUTCMonth() + 1) === 10 || (d.getUTCMonth() + 1) === 12) {
                    //marzo, mayo, julio, agosto, octubre, diciembre (31)

                    fecha.dia = 31;
                    fecha.mes = d.getUTCMonth();
                    fecha.anio = d.getUTCFullYear();
                    fecha.hora = (d.getUTCHours() + 12) - 6; //para hacer la resta correctamente
                    fecha.minutos = d.getUTCMinutes();
                    fecha.segundos = d.getUTCSeconds();


                } else if ((d.getUTCMonth() + 1) === 2) { //febrero (se determina si es bisiesto)


                    if ((d.getUTCFullYear() % 4) === 0 & (d.getUTCFullYear() % 100) !== 0 || (d.getUTCFullYear() % 400) === 0) {


                        fecha.dia = 29;
                        fecha.mes = d.getUTCMonth();
                        fecha.anio = d.getUTCFullYear();
                        fecha.hora = (d.getUTCHours() + 12) - 6;
                        fecha.minutos = d.getUTCMinutes();
                        fecha.segundos = d.getUTCSeconds();


                    } else {

                        fecha.dia = 28;
                        fecha.mes = d.getUTCMonth();
                        fecha.anio = d.getUTCFullYear();
                        fecha.hora = (d.getUTCHours() + 12) - 6;
                        fecha.minutos = d.getUTCMinutes();
                        fecha.segundos = d.getUTCSeconds();



                    }





                } else if ((d.getUTCMonth() + 1) === 1) { // 1 de enero, cambio de año (31)


                    fecha.dia = 31;
                    fecha.mes = 12;
                    fecha.anio = d.getUTCFullYear() - 1;
                    fecha.hora = (d.getUTCHours() + 12) - 6;
                    fecha.minutos = d.getUTCMinutes();
                    fecha.segundos = d.getUTCSeconds();

                } else {


                    fecha.dia = 30;
                    fecha.mes = d.getUTCMonth();
                    fecha.anio = d.getUTCFullYear();
                    fecha.hora = (d.getUTCHours() + 12) - 6;
                    fecha.minutos = d.getUTCMinutes();
                    fecha.segundos = d.getUTCSeconds();


                }




            } else {



                fecha.dia = d.getUTCDate() - 1;
                fecha.mes = d.getUTCMonth() + 1;
                fecha.anio = d.getUTCFullYear();
                fecha.hora = (d.getUTCHours() + 12) - 6;
                fecha.minutos = d.getUTCMinutes();
                fecha.segundos = d.getUTCSeconds();

            }




        } else { //aun son menos de las 24 horas UTC


            fecha.dia = d.getUTCDate();
            fecha.mes = d.getUTCMonth() + 1;
            fecha.anio = d.getUTCFullYear();
            fecha.hora = d.getUTCHours() - 6;
            fecha.minutos = d.getUTCMinutes();
            fecha.segundos = d.getUTCSeconds();


        }


        switch (fecha.mes) {
            case 1:

                fecha.sigla_mes = "JAN";
                break;
            case 2:
                fecha.sigla_mes = "FEB";
                break;

            case 3:
                fecha.sigla_mes = "MAR";
                break;

            case 4:
                fecha.sigla_mes = "APR";
                break;

            case 5:
                fecha.sigla_mes = "MAY";
                break;

            case 6:
                fecha.sigla_mes = "JUN";
                break;

            case 7:
                fecha.sigla_mes = "JUL";
                break;

            case 8:
                fecha.sigla_mes = "AUG";
                break;

            case 9:
                fecha.sigla_mes = "SEPT";
                break;

            case 10:
                fecha.sigla_mes = "OCT";
                break;

            case 11:
                fecha.sigla_mes = "NOV";
                break;

            case 12:
                fecha.sigla_mes = "DEC";
                break;

        }

        //io.sockets.in(nombre_modulo.toUpperCase()).emit('fecha_actual', fecha);
        fn(fecha); //callback que le indica al cliente que todo salio correctamente (siempre y cuando el cliente emita con una funcion adicional: socketIO.emit('prueba_callback', "", on_transaccion_completa)) y socketIO.wait_for_callbacks(seconds=3) para darle un chance de 3 segundos para la respuesta...si no hay respuesta el programa continua
        //es la misma cosa que el parametro resultado que enviamos desde ladmin al emitir, solo que de otra forma (se pasa la funcion no anonima!!)






    });


    socket.on("cantidad_vendida", function(datos, resultado) { //datos (fechaINI-fechaFin-horaINI-horaFin-minutosINI-minutosFin-codigo_empresa-nombre_mostra-cantidad_actual-codigo_licor-nombre_licor) 

        var resumen_licor = []; //si existe el codigo de licor, se actualizan los campos, de lo contrario se añade el registro

        var detalles_transaccion = []; //guarda el detalle de las transacciones para concatenarlo al resumen final que sera enviado


        var nueva_transaccion = false; // bandera que indica que hay una nueva transaccion

        //el aggregate se utiliza para consultar de manera sencilla los arreglos de objetos (usa pipelines por defecto $...que dan una funcionalidad, como el $match)
        //el gte y lte , establecen el rango de busqueda (es un between), contando el rango inicial y final

        //consulta los registros que estan entre un rango de fechas
        Empresa.aggregate({ $match: { codigo_empresa: datos.codigo_empresa } }, { $unwind: "$ventas_locales" }, { $sort: { "ventas_locales.fecha": 1 } }, { $match: { 'ventas_locales.fecha': { $gte: new Date(datos.fecha_ini), $lte: new Date(datos.fecha_fin) } } }, { $group: { "_id": "$_id", "ventas_locales": { $push: "$ventas_locales" } } }, function(err, ventas) {

            if (!err) {

                //facilita la comparacion entre horas y minutos

                var fecha_inicial = datos.fecha_ini;
                var fecha_final = datos.fecha_fin;
                var hora_inicial = new Date("2011", "01", "01", String(datos.hora_ini), String(datos.minutos_ini)); //establecemos la hora inicial con minutos incluidos
                var hora_final = new Date("2011", "01", "01", String(datos.hora_fin), String(datos.minutos_fin));

                console.log("hora inicial " + hora_inicial);
                console.log("hora final " + hora_final);


                if (ventas.length > 0) { //EXISTEN VENTAS                


                    Modulo.find({ codigo_empresa: datos.codigo_empresa }, function(err, modulos) {

                        if (!err) {
                            console.log(modulos);

                            //datos.modulo contiene el codigo de verificacion del modulo que es único

                            ventas[0].ventas_locales.forEach(function(transaccion) {


                                var transaccion_hora_completa = new Date("2011", "01", "01", String(transaccion.hora), String(transaccion.minutos)); //establecemos la hora junto con minutos para la comparacion

                                // console.log("hora transaccion" +);

                                var trans_fecha = (transaccion.fecha.getMonth() + 1) + "/" + transaccion.fecha.getDate() + "/" + transaccion.fecha.getUTCFullYear();



                                if (transaccion.codigo_modulo == datos.modulo || datos.modulo == "todos") { //filtramos por codigo del modulo

                                    //si las fechas son iguales y la hora esta dentro del rango

                                    if (trans_fecha == datos.fecha_ini && trans_fecha == datos.fecha_fin && transaccion_hora_completa >= hora_inicial && transaccion_hora_completa <= hora_final) {

                                        console.log("se encontro una transaccion con fechas iguales");

                                        transaccion.hora = transaccion.hora + ":" + transaccion.minutos; //damos formato
                                        transaccion.fecha = trans_fecha; //formateamos la fecha
                                        detalles_transaccion.push(transaccion);
                                        nueva_transaccion = true; //hay una transaccion


                                    }


                                    //si la fecha es igual a la fecha inicial y la hora es mayor o igual a la hora inicial establecida y las fecha no es igual a la fecha final

                                    if (trans_fecha == datos.fecha_ini && transaccion_hora_completa >= hora_inicial && trans_fecha != datos.fecha_fin) {


                                        console.log("se encontro una transaccion con la fecha inicial valida");

                                        transaccion.hora = transaccion.hora + ":" + transaccion.minutos; //damos formato
                                        transaccion.fecha = trans_fecha; //formateamos la fecha
                                        detalles_transaccion.push(transaccion);
                                        nueva_transaccion = true; //hay una transaccion


                                    }

                                    //si la fecha es igual a la fecha final y la hora es menor o igual a la hora final establecida y las fecha no es igual a la fecha inicial

                                    if (trans_fecha == datos.fecha_fin && transaccion_hora_completa <= hora_final && trans_fecha != datos.fecha_ini) {


                                        console.log("se encontro una transaccion con la fecha final valida");

                                        transaccion.hora = transaccion.hora + ":" + transaccion.minutos; //damos formato
                                        transaccion.fecha = trans_fecha; //formateamos la fecha
                                        detalles_transaccion.push(transaccion);
                                        nueva_transaccion = true; //hay una transaccion


                                    }

                                    //de lo contrario esta dentro del rango de fechas

                                    if (trans_fecha != fecha_final && trans_fecha != fecha_inicial) {

                                        console.log("se encontro una transaccion entre las fechas establecidas");

                                        transaccion.hora = transaccion.hora + ":" + transaccion.minutos;
                                        transaccion.fecha = trans_fecha;
                                        detalles_transaccion.push(transaccion);
                                        nueva_transaccion = true; //hay una transaccion

                                    }

                                    //ARMAMOS EL RESUMEN DE TRANSACCIONES


                                    if (nueva_transaccion) {

                                        console.log("codigo_modulo " + transaccion.codigo_modulo);

                                        nueva_transaccion = false;

                                        var cantidad_disponible = modulos[modulos.findIndex(function(obj) {
                                            return obj.codigo_verificacion == transaccion.codigo_modulo;
                                        })].cantidad_disponible; //ubicamos la cantidad disponible del modulo;


                                        if (resumen_licor.findIndex(function(obj) {
                                                return obj.codigo_modulo == transaccion.codigo_modulo;
                                            }) === -1) { //el registro no existe, lo añadimos

                                            console.log("entre a nueva transaccion");

                                            var venta_licor = { //agrega un nuevo registro al resumen_licor
                                                codigo_modulo: transaccion.codigo_modulo,
                                                nombre_modulo: transaccion.nombre_modulo,
                                                codigo_licor: transaccion.codigo_licor,
                                                nombre_licor: transaccion.nombre_licor,
                                                cantidad_vendida: transaccion.cantidad_ml,
                                                ganancia: transaccion.precio,
                                                cantidad_disponible: cantidad_disponible

                                            };

                                            resumen_licor.push(venta_licor);



                                        } else { //existe el registro, debemos actualizar sus campos

                                            console.log("entre a editar la transaccion");

                                            var indice = resumen_licor.findIndex(function(obj) { //obtenemos el indice en donde esta el registro
                                                return obj.codigo_modulo == transaccion.codigo_modulo;
                                            });



                                            //editamos el resumen

                                            resumen_licor[indice].cantidad_vendida = resumen_licor[indice].cantidad_vendida + transaccion.cantidad_ml; //acumulamos la cantidad
                                            resumen_licor[indice].ganancia = resumen_licor[indice].ganancia + transaccion.precio;


                                        }

                                    }

                                }





                            });


                            resultado({ ok: true, error: false, detalles: detalles_transaccion, resumen: resumen_licor }); //devuelve al cliente una confirmacion de consulta exitosa..         

                            console.log(resumen_licor);

                        } else {

                            console.log("error al buscar modulos");
                            resultado({ ok: false, error: true, msg: "ocurrio un error intentelo más tarde" });


                        }





                    });




                } else {

                    resultado({ ok: false, error: true, msg: "No existe registros de ventas" });
                }



            } else {



                console.log("ocurrio el siguiente error al consultar la cantidad vendida " + err);

                resultado({ ok: false, error: true, msg: "ocurrio un error intentelo más tarde" });
            }


        });




    });

    /*


    socket.on("cantidad_vendida", function(datos, resultado) { //datos (fechaINI-fechaFin-horaINI-horaFin-minutosINI-minutosFin-codigo_empresa-nombre_mostra-cantidad_actual-codigo_licor-nombre_licor) 

            var resumen_licor = []; //si existe el codigo de licor, se actualizan los campos, de lo contrario se añade el registro

            var detalles_transaccion = []; //guarda el detalle de las transacciones para concatenarlo al resumen final que sera enviado


            var nueva_transaccion = false; // bandera que indica que hay una nueva transaccion

            //el aggregate se utiliza para consultar de manera sencilla los arreglos de objetos (usa pipelines por defecto $...que dan una funcionalidad, como el $match)
            //el gte y lte , establecen el rango de busqueda (es un between), contando el rango inicial y final

            //consulta los registros que estan entre un rango de fechas
            Empresa.aggregate({ $match: { codigo_empresa: datos.codigo_empresa } }, { $unwind: "$ventas_locales" }, { $sort: { "ventas_locales.fecha": 1 } }, { $match: { 'ventas_locales.fecha': { $gte: new Date(datos.fecha_ini), $lte: new Date(datos.fecha_fin) } } }, { $group: { "_id": "$_id", "ventas_locales": { $push: "$ventas_locales" } } }, function(err, ventas) {

                if (!err) {

                    var fecha_inicial = datos.fecha_ini;
                    var fecha_final = datos.fecha_fin;

                    if (ventas.length > 0) { //EXISTEN VENTAS



                        Modulo.find({ codigo_empresa: datos.codigo_empresa }, function(err, modulos) {

                            if (!err) {
                                console.log(modulos);

                                //datos.modulo contiene el codigo de verificacion del modulo que es único

                                ventas[0].ventas_locales.forEach(function(transaccion) {

                                    var bandera = false; //evita que exista una duplicacion de registros si la hora inicial y final y los minutos iniciales y finales son iguales

                                    var trans_fecha = (transaccion.fecha.getMonth() + 1) + "/" + transaccion.fecha.getDate() + "/" + transaccion.fecha.getUTCFullYear();

                                     if (transaccion.codigo_modulo == datos.modulo || datos.modulo == "todos") { //filtramos por codigo del modulo



                                        //condicion - fecha igual, hora inicial y final iguales, y los minutos mayor o igual a los minutos iniciales y los minutos menor o igual a los minutos finales

                                        if(trans_fecha ==fecha_inicial && datos.hora_ini == datos.hora_fin && transaccion.minutos >=datos.minutos_ini  &&  transaccion.minutos<=datos.minutos_fin){





                                        }


                                        //condiciones -fecha igual Y entre las horas "O" igual a la hora final y menor o igual a los minutos finales, igual a la hora inicial y los minutos mayor o igual a los minutos iniciales
                                        // si se cumple la condicion esta entre el rango de horas

                                        if (trans_fecha == fecha_inicial && transaccion.hora > datos.hora_ini && transaccion.hora <datos.hora_fin || trans_fecha == fecha_inicial && transaccion.hora == datos.hora_fin && transaccion.minutos<=datos.minutos_fin || trans_fecha == fecha_inicial && transaccion.hora == datos.hora_ini && transaccion.minutos >= datos.minutos_ini) {
                                            transaccion.hora = transaccion.hora + ":" + transaccion.minutos; //damos formato
                                            transaccion.fecha = trans_fecha; //formateamos la fecha
                                            detalles_transaccion.push(transaccion);
                                            nueva_transaccion = true; //hay una transaccion
                                            bandera = true;

                                            console.log("se encontro una transaccion igual a la hora inicial valida");


                                        } //si la fecha es igual a la final y la hora es menor a la hora final "o" la fecha es igual a la final y la hora es igual a la hora final y los minutos son menores o iguales a los minutos finales

                                        if (!bandera) { //si entra al if de arriba, evita que entre a este if, para evitar registros duplicados
                                            if (trans_fecha == fecha_final && transaccion.hora < datos.hora_fin && transaccion.hora >datos.hora_ini || trans_fecha == fecha_inicial && transaccion.hora == datos.hora_ini && transaccion.minutos>=datos.minutos_ini  || trans_fecha == fecha_final && transaccion.hora == datos.hora_fin && transaccion.minutos <= datos.minutos_fin) {

                                                transaccion.hora = transaccion.hora + ":" + transaccion.minutos;
                                                transaccion.fecha = trans_fecha;
                                                detalles_transaccion.push(transaccion);
                                                nueva_transaccion = true; //hay una transaccion

                                                console.log("se encontro una transaccion igual a la hora final valida");


                                            }

                                        }

                                        if (trans_fecha != fecha_final && trans_fecha != fecha_inicial) //de lo contrario esta dentro del rango de fechas
                                        {

                                            console.log("se encontro una transaccion entre las fechas establecidas");

                                            transaccion.hora = transaccion.hora + ":" + transaccion.minutos;
                                            transaccion.fecha = trans_fecha;
                                            detalles_transaccion.push(transaccion);
                                            nueva_transaccion = true; //hay una transaccion




                                        }

                                        //ARMAMOS EL RESUMEN DE TRANSACCIONES


                                        if (nueva_transaccion) {

                                            nueva_transaccion = false;

                                            var cantidad_disponible = modulos[modulos.findIndex(function(obj) {
                                                return obj.codigo_verificacion == transaccion.codigo_modulo;
                                            })].cantidad_disponible; //ubicamos la cantidad disponible del modulo;


                                            if (resumen_licor.findIndex(function(obj) {
                                                    return obj.codigo_modulo == transaccion.codigo_modulo;
                                                }) === -1) { //el registro no existe, lo añadimos

                                                console.log("entre a nueva transaccion");

                                                var venta_licor = { //agrega un nuevo registro al resumen_licor
                                                    codigo_modulo: transaccion.codigo_modulo,
                                                    nombre_modulo: transaccion.nombre_modulo,
                                                    codigo_licor: transaccion.codigo_licor,
                                                    nombre_licor: transaccion.nombre_licor,
                                                    cantidad_vendida: transaccion.cantidad_ml,
                                                    ganancia: transaccion.precio,
                                                    cantidad_disponible: cantidad_disponible

                                                };

                                                resumen_licor.push(venta_licor);



                                            } else { //existe el registro, debemos actualizar sus campos

                                                console.log("entre a editar la transaccion");

                                                var indice = resumen_licor.findIndex(function(obj) { //obtenemos el indice en donde esta el registro
                                                    return obj.codigo_modulo == transaccion.codigo_modulo;
                                                });



                                                //editamos el resumen

                                                resumen_licor[indice].cantidad_vendida = resumen_licor[indice].cantidad_vendida + transaccion.cantidad_ml; //acumulamos la cantidad
                                                resumen_licor[indice].ganancia = resumen_licor[indice].ganancia + transaccion.precio;


                                            }

                                        }

                                    }





                                });


                                    resultado({ ok: true, error: false, detalles: detalles_transaccion, resumen: resumen_licor }); //devuelve al cliente una confirmacion de consulta exitosa..         

                                    console.log(resumen_licor);

                            } else {

                                console.log("error al buscar modulos");
                                resultado({ ok: false, error: true, msg: "ocurrio un error intentelo más tarde" });


                            }





                        });



                    } else {

                        resultado({ ok: false, error: true, msg: "No existe registros de ventas" });
                    }



                } else {



                    console.log("ocurrio el siguiente error al consultar la cantidad vendida " + err);

                    resultado({ ok: false, error: true, msg: "ocurrio un error intentelo más tarde" });
                }


            });




        });
    */


    socket.on('nueva_empresa', function(data, resultado) { //el resultado retorna una respuesta al cliente

        console.log(data);

        //crea un ojeto empresa nuevo con los datos recibidos
        var local_nuevo = new Empresa(data);

        //salva un Local en la base de datos
        local_nuevo.save(function(err) {
            if (!err) {

                console.log('se guardo la empresa: ');
                resultado({ ok: true, error: false });

            } else {


                if (err.code == 11000) {
                    resultado({
                        msg: 'El nombre de la empresa ya existe, por favor eliga otro...',
                        error: true
                    });
                } else {

                    resultado({ msg: 'Error al guardar la empresa, evite los caracteres especiales', error: true });


                }


                console.log('ERROR AL GUARDAR UNA EMPRESA EN LA BASE DE DATOS: ' + err);

            }
        });
    });



    socket.on('obtener_datos_empresa', function(codigo_empresa) { //obtiene la informacion de la empresa

        Empresa.find({ codigo_empresa: codigo_empresa }, function(err, info) {
            if (!err) {

                console.log('se obtuvo la informacion de la empresa ' + info);

                io.sockets.in(codigo_empresa.toUpperCase()).emit('listar_datos_empresa', info); //se emite para que solo escuche la empresa(ladmin)
            } else {
                console.log('ERROR AL CONSULTAR LA INFORMACION DE LA EMPRESA: ' + err);
            }
        });
    });


    socket.on("actualizar_empresa", function(data, resultado) {

        console.log("data ", data);
        console.log("codigo EMPRESA ", data.codigo_empresa);



        //modificamos la configuracion existente de la empresa

        Empresa.update({ codigo_empresa: data.codigo_empresa }, {

            $set: {

                razon_social: data.razon_social,
                nombre: data.nombre,
                direccion: data.direccion,
                latitud: data.latitud,
                longitud: data.longitud,
                telefono: data.telefono,
                email: data.email,
                provincia: data.provincia,
                canton: data.canton,
                distrito: data.distrito
            }

        }, function(err) {

            if (err) {

                if (err.code == 11000) {
                    resultado({
                        msg: 'El nombre de la empresa ya existe, por favor eliga otro...',
                        error: true,
                        ok: false
                    });
                } else {

                    console.log('ocurrio un error al actualizar la configuracion de la empresa' + err);
                    resultado({ ok: false, error: true, msg: "No se pudo actualizar la empresa, intentelo más tarde" });
                }



            } else {

                console.log('empresa actualizada correctamente');

                resultado({ ok: true, error: false, msg: "Se guardó los datos de la empresa 👍 " });

                //io.sockets.in(data.nombre_modulo.toUpperCase()).emit('listar_configuracion', data); //se emite para que solo escuche el modulo


                //console.log(socket.rooms[data.nombre_modulo.toUpperCase()]); //socket.rooms contiene las rooms activas, si no hay clientes en una room, esta se cierra


            }


        });



    });
    //

    socket.on("nueva_persona", function(datos, resultado) { //agrega una nueva persona (datos = nombre_empresa y objeto persona)

        var pass; //guarda el pass encriptado

        //ubicamos la empresa en donde se guardara el usuario

        //determinamos si el id de la persona existe, ya que es unico, el regex ignora mayusculas y minusculas
        Empresa.findOne({ nombre: datos.nombre_empresa }, { personas: { $elemMatch: { codigo_persona: new RegExp(["^", datos.codigo_persona, "$"].join(""), "i") } } }, { personas: 1 }, function(err, personas) { //solo el registro personas traera la consulta

            if (!err) {

                console.log(personas); ////

                if (personas === null || !personas.personas[0]) { //la persona no existe(esta consulta arroja null...hay que ir probando que arrojan las consultas, ya que al null no podemos hacerle.lenght pero a un undefined si!!)


                    // Genera el salt para encriptar
                    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {

                        if (err) {
                            resultado({ error: true, msg: "no se pudo guardar la contraseña" });

                            return err;

                        } else {


                            bcrypt.hash(datos.password, salt, function(err, hash) {

                                if (err) {
                                    resultado({ error: true, msg: "no se pudo guardar la contraseña" });

                                    return err;
                                } else {

                                    // sobreescribe el password 
                                    pass = hash;


                                    Empresa.update({ nombre: datos.nombre_empresa }, { //como es un arreglo dentro del modelo empresa (no se podria guardar con save), se le hace push y con el upsert nos aseguramos que cree el registro si no existe

                                        $push: {
                                            'personas': {

                                                codigo_persona: datos.codigo_persona,
                                                nombre_completo: datos.nombre_completo,
                                                email: datos.email,
                                                telefono: datos.telefono,
                                                celular: datos.celular,
                                                usuario: datos.usuario,
                                                password: pass,
                                                foto_url: datos.foto_url,
                                                activo: datos.activo, //por defecto esta activa
                                                rol: datos.rol, //dueño o administradoor

                                            }
                                        }

                                    }, { "upsert": true }, function(err) {

                                        if (err) {
                                            console.log('ocurrio un error al crear persona' + err);
                                            resultado({ error: true, msg: "ocurrio un error en el registro, intentelo más tarde..." });
                                        } else {

                                            console.log('persona creada correctamente');

                                            resultado({ ok: true });


                                        }


                                    });


                                }

                            });


                        }



                    });





                } else {
                    console.log('la persona ya existe');
                    resultado({ error: true, msg: "La identificacion ya se encuentra registrada, por favor utilice otra..." });
                }




            } else { console.log('ocurrio el siguiente error ' + err); }



        });



    });


    socket.on("consultar_persona", function(datos) { //lista una persona (codigo_persona, codigo_empresa)


        //consultamos la persona
        Empresa.findOne({ codigo_empresa: datos.codigo_empresa }, { personas: { $elemMatch: { codigo_persona: datos.codigo_persona } } }, { personas: 1 }, function(err, personas) { //solo el registro personas traera la consulta

            if (!err) {



                console.log("la persona es: " + personas.personas[0]);
                io.sockets.in(datos.codigo_empresa.toUpperCase()).emit('listar_persona', personas.personas[0]); //se emite para que solo escuche la empresa(ladmin)



            } else { console.log('ocurrio el siguiente error ' + err); }



        });



    });




    socket.on("personas_por_empresa", function(codigo_empresa) { //lista las personas (codigo_empresa)



        //consultamos la persona
        Empresa.find({ codigo_empresa: codigo_empresa }, { personas: 1 }, function(err, personas) { //solo el registro personas traera la consulta

            if (!err) {

                console.log(codigo_empresa);

                io.sockets.in(codigo_empresa.toUpperCase()).emit('listar_personas', personas[0].personas); //se emite para que solo escuche la empresa(ladmin)



            } else { console.log('ocurrio el siguiente error ' + err); }



        });



    });

    socket.on("actualizar_persona", function(datos, resultado) { //todo el objeto persona


        var pass; //conserva la nueva contraseña

        // Genera el salt para encriptar
        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
            if (err) { console.log("ocurrio un error al encriptar " + err); } else {

                // encripta el password con el nuevo salt generado
                bcrypt.hash(datos.password, salt, function(err, hash) {
                    if (err) {
                        console.log("ocurrio un error al encriptar " + err);
                        resultado({ error: true });
                    } else {

                        // sobreescribe el password 
                        pass = hash;

                        console.log(datos.codigo_empresa);
                        console.log(datos.codigo_persona);

                        //se debe actualizar de estar forma porque es un array de objetos y se usa findOneAndUpdate

                        Empresa.findOneAndUpdate({ codigo_empresa: datos.codigo_empresa, 'personas.codigo_persona': datos.codigo_persona }, {
                            $set: {
                                "personas.$.nombre_completo": datos.nombre_completo,
                                "personas.$.email": datos.email,
                                "personas.$.telefono": datos.telefono,
                                "personas.$.celular": datos.celular,
                                "personas.$.usuario": datos.usuario,
                                "personas.$.password": pass,
                                "personas.$.foto_url": datos.foto_url,
                                // "personas.$.activo": datos.activo,
                                //  "personas.$.rol": datos.rol

                            }
                        }, function(err, result) {

                            if (err) {
                                console.log("no se pudo actualizar la persona " + err);
                                resultado({ error: true });
                            } else {

                                if (result === null) {
                                    console.log("la persona no existe");
                                    resultado({ error: true });
                                } else {
                                    console.log("persona actualizada correctamente" + result);

                                    resultado({ ok: true });

                                }
                            }

                        });


                    }


                });


            }

        });


    });

    //

    socket.on("actualizar_usuario", function(datos, resultado) { //para el administrador en ladmin para que actualice la info de un usuario


        //se debe actualizar de estar forma porque es un array de objetos y se usa findOneAndUpdate

        Empresa.findOneAndUpdate({ codigo_empresa: datos.codigo_empresa, 'personas.codigo_persona': datos.codigo_persona }, {
            $set: {
                "personas.$.nombre_completo": datos.nombre_completo,
                "personas.$.email": datos.email,
                "personas.$.telefono": datos.telefono,
                "personas.$.celular": datos.celular,
                "personas.$.usuario": datos.usuario,
                "personas.$.foto_url": datos.foto_url,

            }
        }, function(err, result) {

            if (err) {
                console.log("no se pudo actualizar la persona " + err);
                resultado({ error: true });
            } else {

                if (result === null) {
                    console.log("la persona no existe");
                    resultado({ error: true });
                } else {
                    console.log("persona actualizada correctamente" + result);

                    resultado({ ok: true });

                    //Emitimos para que se refrezque los cammbios en los usuarios

                    Empresa.find({ codigo_empresa: datos.codigo_empresa }, { personas: 1 }, function(err, personas) { //solo el registro personas traera la consulta

                        if (!err) {


                            io.sockets.in(datos.codigo_empresa.toUpperCase()).emit('listar_personas', personas[0].personas); //se emite para que solo escuche la empresa(ladmin)



                        } else { console.log('ocurrio el siguiente error ' + err); }



                    });

                }
            }

        });


    });



    socket.on("cambiar_estado", function(datos, resultado) { //deshabilita o habilita a una persona para que no pueda logearse

        //se debe actualizar de estar forma porque es un array de objetos y se usa findOneAndUpdate

        Empresa.findOneAndUpdate({ codigo_empresa: datos.codigo_empresa, 'personas.codigo_persona': datos.codigo_persona }, {
            $set: {

                "personas.$.activo": datos.activo, //inactiva a la persona, el dolar es necesario porque es un arreglo

            }
        }, function(err, result) {

            if (err) { console.log("no se pudo deshabilitar la persona " + err); } else {

                if (result === null) {


                    console.log("la persona no existe");

                } else {

                    resultado({ ok: true, error: false });

                    //refrezcamos la lista de personas

                    Empresa.find({ codigo_empresa: datos.codigo_empresa }, { personas: 1 }, function(err, personas) { //solo el registro personas traera la consulta

                        if (!err) {


                            io.sockets.in(datos.codigo_empresa.toUpperCase()).emit('listar_personas', personas[0].personas); //se emite para que solo escuche la empresa(ladmin)



                        } else { console.log('ocurrio el siguiente error ' + err); }



                    });

                    console.log("persona deshabilitada correctamente");

                }


            }

        });




    });


    socket.on("cambiar_password", function(datos, resultado) { //cambia el pass de una persona

        //se debe actualizar de estar forma porque es un array de objetos y se usa findOneAndUpdate

        var pass; //clave

        //genera el salt para encriptar
        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
            if (err) { console.log("ocurrio un error al encriptar " + err); } else {

                // encripta el password con el nuevo salt generado
                bcrypt.hash(datos.password, salt, function(err, hash) {
                    if (err) {
                        console.log("ocurrio un error al encriptar " + err);
                        resultado({ error: true });
                    } else {

                        // sobreescribe el password 
                        pass = hash;

                        //se debe actualizar de estar forma porque es un array de objetos y se usa findOneAndUpdate

                        Empresa.findOneAndUpdate({ codigo_empresa: datos.codigo_empresa, 'personas.codigo_persona': datos.codigo_persona }, {
                            $set: {

                                "personas.$.password": pass

                            }
                        }, function(err, result) {

                            if (err) {
                                console.log("no se pudo actualizar la contraseña " + err);
                                resultado({ error: true });
                            } else {

                                if (result === null) {
                                    console.log("la persona no existe");
                                    resultado({ error: true });
                                } else {
                                    console.log("contraseña actualizada correctamente" + result);

                                    resultado({ ok: true });

                                }
                            }

                        });


                    }


                });



            }

        });

    });


    socket.on('login', function(datos, resultado) { ///cuando se logea una persona (codigo_persona - pass - codigo_empresa) (retorna un resultado, el emit desde el cliente debe hacerse con function(err,resultado) para que retorne un dato)

        //se hace de esta forma para consultar un usuario de la empresa, ya que es un arreglo de objetos
        Empresa.findOne({ codigo_empresa: datos.codigo_empresa }, { personas: { $elemMatch: { codigo_persona: datos.codigo_persona } } }, { personas: 1 },

            function(err, personas) {

                if (!err) {

                    console.log(personas);
                    console.log(datos.codigo_empresa);
                    console.log(datos.password);
                    console.log(datos.codigo_persona);

                    if (personas !== null && personas.personas[0]) { //si hay registros, el usuario existe y determinamos si calzan las claves (esta consulta arroja null...hay que ir probando que arrojan las consultas, ya que al null no podemos hacerle.lenght pero a un undefined si!!)


                        if (personas.personas[0].activo == "activo") { //si la persona esta activa, de lo contrario fue deshabilitada y no puede logearse

                            bcrypt.compare(datos.password, personas.personas[0].password, function(err, isMatch) {
                                if (err) {
                                    console.log('ocurrio un error al comparar claves ' + err);
                                    resultado({ msg: 'Error al ingresar, server caído', error: true });
                                } else if (isMatch) { //COINCIDEN LAS CLAVES 

                                    Empresa.findOne({ codigo_empresa: datos.codigo_empresa }, function(err, empresa) { //recuperamos el nombre de la empresa

                                        if (!err) {
                                            resultado({ ok: true, coincide: true, usuario: personas.personas[0].usuario, nombre_empresa: empresa.nombre, rol: personas.personas[0].rol });
                                            console.log('nombre empresa ' + empresa.nombre);
                                        } else { resultado({ msg: 'La empresa no existe', error: true }); }

                                    });



                                } else {
                                    console.log('no coinciden');
                                    resultado({ msg: 'La clave es inválida', error: true });
                                }


                            });



                        } else {
                            console.log('usuario deshabilitado ');


                            resultado({ msg: 'El usuario fue deshabilitado', error: true });
                        }



                    } else {


                        resultado({ msg: 'Error al ingresar, la identificación ó el código es inválido', error: true }); //RETORNA EL RESULTADO AL LADMIN (EL SOCKET EMIT DEBE HACERSE CON UN FUNCTION PARA QUE RETORNE, en inicio.js se puede apreciar)

                        console.log('no existe');




                    }


                } else {

                    resultado({ msg: 'Error al ingresar', error: true }); //RETORNA EL RESULTADO AL LADMIN (EL SOCKET EMIT DEBE HACERSE CON UN FUNCTION PARA QUE RETORNE)
                    console.log("ocurrio el siguiente error " + err);
                }


            }
        );
    });


    socket.on("nueva_transaccion", function(data, fn) { //nueva transaccion (VENTA-ID-FECHA-HORA-MINUTOS-NOMBRE_MODULO-CANTIDAD_ML)

        var datos = JSON.parse(data); //parseamos los datos enviados desde el cliente(como es python es necesario, con otros lenguajes mas modernos no!)
        console.log('*************NUEVA TRANSACCION**********');
        console.log('venta id: ' + datos.venta_id);
        console.log('nombre_modulo: ' + datos.nombre_modulo);
        console.log('fecha de transaccion: ' + datos.fecha);
        console.log('hora de transaccion ' + datos.hora);
        console.log('minutos de transaccion ' + datos.minutos);
        console.log('cantidad_ml ' + datos.cantidad_ml);
        console.log('codigo_verificacion: ' + datos.codigo_verificacion);
        console.log('tipo_precio: ' + datos.tipo_precio);

        if (datos.venta_id !== null && datos.codigo_verificacion !== null && datos.cantidad_ml !== null) {


            var cantidad_actual = 0; //conserva la cantidad actual de ml que tiene la mostra

            var precio = 0; //conserva el precio

            //obtenemos el codigo y nombre del licor

            Modulo.find({ codigo_verificacion: datos.codigo_verificacion }, function(err, modulo) {

                if (!err) {

                    /* console.log('se obtuvo el codigo y nombre licor ' + modulo);

                     //
                     console.log('modulo codigo licor ' + modulo[0].codigo_licor);*/


                    //determinamos si la transaccion existe para evitar duplicarla


                    Empresa.findOne({ codigo_empresa: modulo[0].codigo_empresa }, { ventas_locales: { $elemMatch: { venta_id: datos.venta_id } } }, {
                        ventas_locales: 1
                    }, function(err, venta) {

                        console.log('ventas_locales' + venta);



                        if (!err) {


                            if (venta.ventas_locales.length === 0) { // si es igual a 0 significa que no existe el registro (si es indefinido soporta el .length...si es null tira error (por eso ojo al resultado que arroja la consulta (con print podemos verlo si es null o undefined)))

                                // console.log(venta.ventas_locales);

                                Licor.findOne({ codigo_licor: modulo[0].codigo_licor }, function(err, resultado) {
                                    if (!err) {

                                        console.log("nombre del licor " + resultado.nombre);

                                        //el precio se calcula en base a la cantidad de ml vendidos (medida1 -2 -3)

                                        /*console.log('modulo medida1' + modulo[0].medida1 + ' datos.cantidad_ml ' + datos.cantidad_ml);*/


                                        if (datos.tipo_precio == 1) { //es el precio1

                                            console.log("el precio 1 del licor es: " + resultado.precio1);

                                            precio = resultado.precio1;


                                        }

                                        if (datos.tipo_precio == 2) { // precio 2


                                            console.log("el precio 2 del licor es: " + resultado.precio2);

                                            precio = resultado.precio2;

                                        }


                                        if (datos.tipo_precio == 3) { //precio 3


                                            console.log("el precio 3 del licor es: " + resultado.precio3);

                                            precio = resultado.precio3;

                                        }

                                        //determinamos el distrito y canton de la empresa
                                        Empresa.find({ codigo_empresa: modulo[0].codigo_empresa }, function(err, empresa) {

                                            if (!err) { //actualizamos las ventas locales de la empresa si no hay error



                                                Empresa.update({ codigo_empresa: modulo[0].codigo_empresa }, { //como es un arreglo dentro del modelo empresa (no se podria guardar con save), se le hace push y con el upsert nos aseguramos que cree el registro si no existe


                                                    $push: {
                                                        'ventas_locales': {
                                                            venta_id: datos.venta_id,
                                                            fecha: datos.fecha,
                                                            hora: parseInt(datos.hora),
                                                            minutos: parseInt(datos.minutos),
                                                            nombre_modulo: datos.nombre_modulo,
                                                            codigo_modulo: datos.codigo_verificacion,
                                                            codigo_licor: modulo[0].codigo_licor,
                                                            nombre_licor: modulo[0].nombre_licor,
                                                            cantidad_ml: datos.cantidad_ml,
                                                            precio: precio
                                                            // distrito: empresa[0].distrito,
                                                            // canton: empresa[0].canton,
                                                            // provincia: empresa[0].provincia

                                                        }
                                                    }

                                                }, { "upsert": true }, function(err) { //lo crea si no existe

                                                    if (err) { console.log('ocurrio un error en la transaccion' + err); } else {

                                                        cantidad_actual = parseFloat(modulo[0].cantidad_disponible) - parseFloat(datos.cantidad_ml); //cantidad actual de ml en el modulo

                                                        console.log('La cantidad_actual de licor en la db es: ', cantidad_actual);

                                                        if (cantidad_actual < 0) { cantidad_actual = 0; } //si es menor a cero, lo seteamos en cero


                                                        console.log('transaccion exitosa');

                                                        // io.sockets.in(datos.nombre_modulo.toUpperCase()).emit('transaccion_completa', datos.venta_id); //se emite para que solo escuche la MOSTRA con el id a borrar

                                                        //Creamos un nuevo registro en ventas (globales)

                                                        var venta = {

                                                            fecha: Date,
                                                            hora: Number,
                                                            minutos: Number,
                                                            nombre_modulo: String,
                                                            codigo_modulo: String,
                                                            codigo_empresa: String,
                                                            cantidad_ml: Number,
                                                            nombre_licor: String,
                                                            distrito: String,
                                                            canton: String,
                                                            provincia: String
                                                        };

                                                        venta.fecha = datos.fecha;
                                                        venta.hora = parseInt(datos.hora);
                                                        venta.minutos = parseInt(datos.minutos);
                                                        venta.nombre_modulo = datos.nombre_modulo;
                                                        venta.codigo_modulo = datos.codigo_verificacion;
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



                                                                Modulo.update({ codigo_verificacion: datos.codigo_verificacion }, { //modificamos el campo cantidad_disponible

                                                                    $set: {

                                                                        cantidad_disponible: cantidad_actual
                                                                    }

                                                                }, function(err) {

                                                                    if (err) { console.log('ocurrio un error al actualizar la cantidad_ml del modulo' + err); } else {

                                                                        console.log('cantidad_ml del modulo actualizado correctamente');

                                                                        fn(datos.venta_id); //callback que le indica al cliente que todo salio correctamente (siempre y cuando el cliente emita con una funcion adicional: socketIO.emit('prueba_callback', "", on_transaccion_completa)) y socketIO.wait_for_callbacks(seconds=3) para darle un chance de 3 segundos para la respuesta...si no hay respuesta el programa continua
                                                                        //es la misma cosa que el parametro resultado que enviamos desde ladmin al emitir, solo que de otra forma (se pasa la funcion no anonima!!)
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
                                //
                                console.log('el registro existe');
                                fn(datos.venta_id); //callback que le indica al cliente que todo salio correctamente (siempre y cuando el cliente emita con una funcion adicional: socketIO.emit('prueba_callback', "", on_transaccion_completa)) y socketIO.wait_for_callbacks(seconds=3) para darle un chance de 3 segundos para la respuesta...si no hay respuesta el programa continua
                                //es la misma cosa que el parametro resultado que enviamos desde ladmin al emitir, solo que de otra forma (se pasa la funcion no anonima!!)
                                //io.sockets.in(datos.nombre_modulo.toUpperCase()).emit('transaccion_completa', datos.venta_id); //se emite para que borre el registro existente
                            }


                        }


                    });





                } else {
                    console.log('ERROR EN NUEVA TRANSACCION: ' + err);
                }
            });







        } else { console.log("hay un registro vacio en la transaccion"); }


    });

*/


}; //fin del controlador de empresas