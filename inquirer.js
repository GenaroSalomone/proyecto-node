const inquirer = require('inquirer');

const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Qué desea hacer?',
        choices: [
            {
                value: '1',
                name: `${'1.'} Insertar habitación`
            },
            {
                value: '2',
                name: `${'2.'} Registrar un cliente en una habitación en la fecha actual`
            },
            {
                value: '3',
                name: `${'3.'} Listar todos los clientes y fechas en que se registraron en una
                determinada habitación.`,
            },
            {
                value: '0',
                name: `${'0.'} Salir`
            },
        ]
    }
];

const inquirerMenu = async () => {

    console.clear();
    console.log('==========================');
    console.log('  Seleccione una opción');
    console.log('==========================\n');

    const { opcion } = await inquirer.prompt(preguntas);

    return opcion;

}

const pausa = async () => {

    const question = [
        {
            type: 'input',
            name: 'enter',
            message: `Presione ENTER para continuar`,

        }
    ];
    console.log('\n');
    await inquirer.prompt( question );
}

const leerHabitacion = async( message ) => {

    const question = [
        {
            type: 'number',
            name: 'nro_habitacion',
            message,
            validate ( value ){
                if (value.length === 0){
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        },
        {
            type: 'input',
            name: 'cantidad_camas',
            message,
            validate ( value ){
                if (value.length === 0){
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        },
        {
            type: 'number',
            name: 'cod_tipo_habitacion',
            message,
            validate ( value ){
                if (value.length === 0){
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }
    ];

    const {nro_habitacion, cantidad_camas, cod_tipo_habitacion} = await inquirer.prompt(question);
    return {nro_habitacion, cantidad_camas, cod_tipo_habitacion};
}

const leerRegistroOcupa = async( message ) => {

    const ocupa = [
        {
            type: 'number',
            name: 'Nro_habitacion',
            message,
            validate ( value ){
                if (value.length === 0){
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        },
        {
            type: 'number',
            name: 'DNI_Cliente',
            message,
            validate ( value ){
                if (value.length === 0){
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        },
        {
            type: 'number',
            name: 'Monto',
            message,
            validate ( value ){
                if (value.length === 0){
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        },
        {
            type: 'number',
            name: 'dias_permanecio',
            message,
            validate ( value ){
                if (value.length === 0){
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }
    ];

    const {Nro_habitacion, DNI_Cliente, Monto, dias_permanecio} = await inquirer.prompt( ocupa );
    //console.log({nro_habitacion, DNI_Cliente, Monto, dias_permanecio});
    return {Nro_habitacion, DNI_Cliente, Monto, dias_permanecio};
}

const leerNroDeHab = async ( mensaje ) => {
    const numero = [
        {
            type: 'number',
            name: 'Nro_de_habitacion',
            message: mensaje,
            validate ( value ){
                if (value.length === 0){
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }
    ]
    const {Nro_de_habitacion} = await inquirer.prompt ( numero );
    return {Nro_de_habitacion};
}

module.exports = {
    inquirerMenu,
    pausa,
    leerHabitacion,
    leerRegistroOcupa,
    leerNroDeHab
}
    















