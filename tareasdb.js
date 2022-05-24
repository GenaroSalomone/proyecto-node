//Requerir node-postgre
const { Client } = require('pg');

const insertarHabitacion = async (nro_hab = 0, cant_camas = '', cod_tipo_hab = 0) => {
    //Conección a la DB
    const client = new Client ({
        user: 'postgres',
        host: 'localhost',
        database: 'proyecto',
        password: 'root',
        port: 5432,
    });
    await client.connect()

    //Ejecucion de Querys
    const text = 'INSERT INTO proyecto.habitaciones (nro_habitacion, cantidad_camas, cod_tipo_habitacion) VALUES ($1, $2, $3)';
    const values = [nro_hab, cant_camas, cod_tipo_hab];
    const res = await client.query(text, values);

    //Respuesta de Query
    const result = await client.query('SELECT * FROM proyecto.habitaciones');
    //console.log( result.rows[0] );
     
    //Cerrar conexion
    await client.end();
    return result;
};

async function insertarFechaDeHoy() {
    //Conección a la DB
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'proyecto',
        password: 'root',
        port: 5432,
    });
    await client.connect();

    //Ejecucion de Querys
    const text = 'INSERT INTO proyecto.fecha (d_m_a) VALUES ( now() );';

    //La fecha se insertá si no devuelve un error
    //Si devuelve error -> la fecha de hoy está cargada en el sistema
    const res = await client.query( text, ( err, res ) => {
        if ( err ) {
            console.log('La fecha de hoy ya está registrada. No se ejecutó la inserción de la fecha actual.')
          } else {
            console.log('Se actualizó el sistema con la fecha de hoy');
          }
        }
    );

    //Respuesta de Query
    const result = await client.query('SELECT * FROM proyecto.fecha;');
    //console.log( result.rows[0] );
    //Cerrar conexion
    await client.end();
    return result;
}


const insertarEnOcupa = async ( nrohab , DNI , monto , dias ) => {

    //Conección a la DB
    const client = new Client ({
        user: 'postgres',
        host: 'localhost',
        database: 'proyecto',
        password: 'root',
        port: 5432,
    });
    await client.connect();

    let fechaActual = 'now()';
    //Se intenta hacer un INSERT suponiendo que la habitación está desocupada (no está registrada en OCUPA)
    //Caso contrario, se realiza un UPDATE
    try {
        const text = 'INSERT INTO proyecto.ocupa (nro_habitacion, d_m_a, dni, monto, dias_permanecio) VALUES ($1, $2, $3, $4, $5);';
        const values = [nrohab, fechaActual, DNI, monto, dias];
        const res = await client.query(text, values)
    }

    catch ( err ) {
        const text2 = 'UPDATE proyecto.ocupa SET dni = $1, monto = $2, dias_permanecio = $3, d_m_a = $4 WHERE (nro_habitacion = $5);';
        const values2 = [DNI, monto, dias, fechaActual, nrohab];
        const res2 = await client.query(text2, values2)
    }

    //Respuesta de Query
    const result = await client.query('SELECT * FROM proyecto.ocupa; ');
    //console.log( result.rows[0] );
     
    //Cerrar conexion
    await client.end();
    return result;
}

const listarClientesFechas = async ( habitacion = 0 ) => {

    //Conección a la DB
    const client = new Client ({
        user: 'postgres',
        host: 'localhost',
        database: 'proyecto',
        password: 'root',
        port: 5432,
    });
    await client.connect()

    //Ejecucion de la select

    const text = 'select nombre, apellido, dni, d_m_a from proyecto.persona inner join proyecto.ocupa using (dni) where (nro_habitacion = $1)';
    const values = [ habitacion ];
    const res = await client.query(text, values);
     
    //Cerrar conexion
    await client.end();
    return res;
}

module.exports = {
    insertarHabitacion,
    insertarEnOcupa,
    insertarFechaDeHoy,
    listarClientesFechas
}









