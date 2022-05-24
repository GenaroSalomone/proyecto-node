
//Requerir node-postgre
const { Client } = require('pg');
const { inquirerMenu,
        pausa,
        leerHabitacion,
        leerCliente,
        leerRegistroOcupa,
        leerNroDeHab
         } = require('./inquirer');

//Requerir trabajos con la base de datos
const { insertarHabitacion,
        insertarFechaDeHoy,
        insertarEnOcupa,
        listarClientesFechas 
        }= require('./tareasdb');

//Main
const main = async () => {

    let opt = '';
    do {
        opt = await inquirerMenu();
        
        switch (opt){
            case '1':
                //Insercion de la nueva habitacion
                console.log('Ingrese los datos de la nueva habitación')
                const {nro_habitacion, cantidad_camas, cod_tipo_habitacion} = await leerHabitacion();
                const nuevahab = await insertarHabitacion(nro_habitacion, cantidad_camas, cod_tipo_habitacion);
                
                //Muestra de datos actualizados
                console.log ( nuevahab.rows );
                console.log ( 'Habitacion insertada con exito');
            break;

            case '2':

                //Insercion de la fecha actual, por si no estuviese cargada no permitiría insertar en Ocupa.
                const fechadehoy = await insertarFechaDeHoy();

                //Inserción tupla ocupa
                const {Nro_habitacion, DNI_Cliente, Monto, dias_permanecio} = await leerRegistroOcupa();
                const nuevoOcupaRegis = await insertarEnOcupa( Nro_habitacion, DNI_Cliente, Monto, dias_permanecio );

                //Muestra de datos tabla ocupa (Opcional)
                console.log( nuevoOcupaRegis.rows );
                console.log ( 'El cliente fue registrado en la habitación con fecha de hoy exitosamente' );
                    
            break;
            
            case '3': 

                console.log('Ingrese el numero de habitacion');
                const {Nro_de_habitacion} = await leerNroDeHab();
                //console.log( numero );
                const listado = await listarClientesFechas( Nro_de_habitacion );
                console.log( listado.rows );

            break;
        }

        await pausa();
    } while ( opt !== '0');
}

main();






