module.exports = function(app, socket, io) {

    ////modelo de la base de datos para la coleccion "clientes", sirve para mapear los resultados de las consultas en el modelo respectivo
    var Clientes = require('../modelos/clientes.js');


/*


    socket.on('obtener_licores', function(codigo_empresa) { //obtiene los licores de la empresa

        Licor.find({ codigo_empresa: codigo_empresa }, function(err, resultado) {
            if (!err) {

                console.log('se obtuvieron los licores ' + resultado);

                io.sockets.in(codigo_empresa.toUpperCase()).emit('listar_licores', resultado); //se emite para que solo escuche la empresa(ladmin)
            } else {
                console.log('ERROR AL CONSULTAR el licor: ' + err);
            }
        });
    });


    socket.on("modificar_licor", function(data, resultado) {


        Licor.update({ codigo_empresa: data.codigo_empresa, codigo_licor: data.codigo_licor }, {

            $set: {

                codigo_empresa: data.codigo_empresa,
                nombre: data.nombre,
                tipo: data.tipo,
                marca: data.marca,
                fecha_ingreso: data.fecha_ingreso, //fecha en que se hizo el ingreso
                precio1: data.precio1,
                precio2: data.precio2,
                precio3: data.precio3
            }

        }, function(err) { //el upsert indica que si no encuentra ningun registro, lo crea

            if (err) {
                console.log('ocurrio un error al actualizar el licor' + err);
                resultado({ ok: false, error: true });

            } else {

                console.log('el licor actualizado correctamente');
                resultado({ ok: true, error: false });

                //EJEMPLO DE ACTUALIZAR VARIOS REGISTROS A LA VEZ, SI CAMBIA EL NOMBRE DEL LICOR, TAMBIEN SE CAMBIARÁ EN LOS MODULOS QUE CONTENGA DICHO LICOR

                Modulo.find({ codigo_empresa: data.codigo_empresa, codigo_licor: data.codigo_licor }).cursor()
                    .on('data', function(modulos) { //el cursor nos permite iterar sobre varios registros a la vez (es un foreach)


                        Modulo.update({codigo_empresa:data.codigo_empresa, nombre_modulo: modulos.nombre_modulo }, { //modificamos el nombre de licor en los modulos de la empresa

                            $set: {

                                nombre_licor: data.nombre

                            }

                        }, function(err) {

                            if (err) {
                                console.log('ocurrio un error al actualizar el licor del modulo' + err);

                            } else {

                                console.log('el licor se actualizo correctamente en el modulo');


                                //io.sockets.in(data.nombre_modulo.toUpperCase()).emit('listar_configuracion', data); //se emite para que solo escuche el modulo


                                //console.log(socket.rooms[data.nombre_modulo.toUpperCase()]); //socket.rooms contiene las rooms activas, si no hay clientes en una room, esta se cierra


                            }


                        });



                    });


            }


        });





    });



    socket.on('nuevo_licor', function(data, resultado) {

        console.log(data);

        //salva un licor en la base de datos, los simbolos regex nos ayuda a que la consulta ignore mayusculas y minusculas


        Licor.findOne({ codigo_empresa: data.codigo_empresa, nombre: new RegExp(["^", data.nombre, "$"].join(""), "i")}, function(err, result) {//verificamos que el nombre no exista
            if (!err) {

                if(!result){//no existe


        var licor = {

            codigo_empresa: data.codigo_empresa,
            nombre: data.nombre,
            tipo: data.tipo,
            marca: data.marca,
            fecha_ingreso: data.fecha_ingreso, //fecha en que se hizo el ingreso
            precio1: data.precio1,
            precio2: data.precio2,
            precio3: data.precio3



        };


        var nuevo_licor = new Licor(licor);

        nuevo_licor.save(function(err) {
            if (!err) {


                Licor.findOne({ //ubicamos el registro creado para obtener su codigo de licor (que es random)

                    codigo_empresa: data.codigo_empresa,
                    nombre: data.nombre,
                    tipo: data.tipo,
                    marca: data.marca,
                    precio1: data.precio1,
                    precio2: data.precio2,
                    precio3: data.precio3

                }, function(err, licor) {

                    if (!err) {
                        resultado({ ok: true, error: false, codigo_licor: licor.codigo_licor });
                        console.log('el codigo de licor es ' + licor.codigo_licor);


                    } else
                        resultado({ ok: false, error: true, msg: "No se pudo guardar el licor, intentelo más tarde..." });

                });


            } else {


                resultado({ ok: false, error: true, msg: "No se pudo guardar el licor, intentelo más tarde..." });
                console.log('ERROR AL GUARDAR EL LICOR EN LA BASE DE DATOS: ' + err);

            }
        });


                } else{resultado({ ok: false, error: true, msg: "El nombre del licor ya existe!, por favor eliga otro" });}

            } else {
                console.log('ERROR AL CONSULTAR el licor: ' + err);
            }
        });



    });


    socket.on('obtener_nombre_licor', function(codigo_licor, resultado) { //obtiene el nombre de un licor

        Licor.findOne({
            codigo_licor: codigo_licor

        }, function(err, licor) {

            if (!err) {

                console.log('el nombre de licor es ' + licor.nombre);
                resultado({ ok: true, error: false, nombre_licor: licor.nombre });


            } else
                resultado({ ok: false, error: true });

        });

    });


*/

}; //fin del controlador de licores
