
//Requerir node-postgre
const { Client } = require('pg');

const { inquirerMenu,
        pausa,
        leerHabitacion,
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
                console.log('Ingrese los datos de la nueva habitación');
                const {nro_habitacion, cantidad_camas, cod_tipo_habitacion} = await leerHabitacion();
                await insertarHabitacion(nro_habitacion, cantidad_camas, cod_tipo_habitacion);
                
            break;

            case '2':

                //Insercion de la fecha actual, por si no estuviese cargada no permitiría insertar en Ocupa.
                await insertarFechaDeHoy();

                //Inserción tupla ocupa
                console.log('Inserte los siguientes datos:');
                const {Nro_habitacion, DNI_Cliente, Monto, dias_permanecio} = await leerRegistroOcupa();
                await insertarEnOcupa( Nro_habitacion, DNI_Cliente, Monto, dias_permanecio );
                    
            break;
            
            case '3': 

                console.log('Ingrese el numero de habitacion');
                const {Nro_de_habitacion} = await leerNroDeHab();
                const listado = await listarClientesFechas( Nro_de_habitacion );
                console.log( listado.rows );

            break;
        };

        await pausa();
    } while ( opt !== '0');
}

main();






