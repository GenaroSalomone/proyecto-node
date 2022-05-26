//Requerir node-postgres
const { Client } = require('pg');

//Función para la conección a la DB
const conectarDB = async () => {
    const cliente = new Client ({
        user: 'postgres',
        host: 'localhost',
        database: 'proyecto',
        password: 'root',
        port: 5432,
    });
    return cliente;
};

const insertarHabitacion = async (nro_hab = 0, cant_camas = '', cod_tipo_hab = 0) => {

    //Conección a la DB
    let client = await conectarDB();
    await client.connect();

    try {
        //Ejecucion de Query
        const text = 'INSERT INTO proyecto.habitaciones (nro_habitacion, cantidad_camas, cod_tipo_habitacion) VALUES ($1, $2, $3)';
        const values = [nro_hab, cant_camas, cod_tipo_hab];
        const res = await client.query(text, values);

        //Respuesta de Query
        const result = await client.query('SELECT * FROM proyecto.habitaciones');
        console.log ( 'Habitacion insertada con exito');

        //Muestra de datos actualizados
        console.log( result.rows );
        
        //Cerrar conexion
        await client.end();
        return result;
    }

    catch ( err ) {
        console.log('\n');
        console.log (`No se pudo ingresar la habitación. Detalles del error:`);
        console.log( err.stack );
        await client.end();
    };

};

const insertarFechaDeHoy = async () => {

    //Conección a la DB
    let client = await conectarDB();
    await client.connect();

    //Ejecucion de Querys
    const text = 'INSERT INTO proyecto.fecha (d_m_a) VALUES ( now() );';

    //La fecha se insertá si no devuelve un error
    //Si devuelve error -> la fecha de hoy está cargada en el sistema
    try {
        const res = await client.query( text );
        console.log('Se actualizó el sistema con la fecha de hoy');
        await client.end();
        return res;    
    }
    catch (err) {
        console.log('\n');
        console.log ('La fecha de hoy ya está registrada en el sistema. No se ejecutó la inserción de la fecha actual');
        await client.end();
    };
};


const insertarEnOcupa = async ( nrohab , DNI , monto , dias ) => {

    //Conección a la DB
    let client = await conectarDB();
    await client.connect();

    let fechaActual = 'now()';

    //Se intenta hacer el INSERT y se muestra por pantalla los resultados si no hay errores
    //Caso contrario, se muestra el stack de errores con un mensaje
    try {
        const text = 'INSERT INTO proyecto.ocupa (nro_habitacion, d_m_a, dni, monto, dias_permanecio) VALUES ($1, $2, $3, $4, $5);';
        const values = [nrohab, fechaActual, DNI, monto, dias];
        const res = await client.query(text, values);

        //Respuesta de Query
        console.log('\n');
        const result = await client.query('SELECT * FROM proyecto.ocupa; ');
        console.log ( 'El cliente fue registrado en la habitación con fecha de hoy exitosamente' );
        console.log( result.rows );
        
        //Cerrar conexion
        await client.end();
        return result;
    }

    catch ( err ) {
        console.log('\n');
        console.log ('Los datos que ingresó violan alguna restricción de la BDD. Detalles del error:');
        console.log( err.stack );
        await client.end();
    };
};

const listarClientesFechas = async ( habitacion = 0 ) => {

    //Conección a la DB
    let client = await conectarDB();
    await client.connect();

    //Ejecucion de la select
    const text = 'select nombre, apellido, dni, d_m_a from proyecto.persona inner join proyecto.ocupa using (dni) where (nro_habitacion = $1)';
    const values = [ habitacion ];
    const res = await client.query(text, values);
     
    //Cerrar conexion
    await client.end();
    return res;
};

module.exports = {
    insertarHabitacion,
    insertarEnOcupa,
    insertarFechaDeHoy,
    listarClientesFechas
}









