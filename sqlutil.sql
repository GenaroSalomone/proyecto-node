--Lucas Toledo

-- Ejercicios completados:
/*
3. Definir el diccionario de datos creando:
- La base de datos.
- Las tablas componentes con todas las restricciones que el problema
requiere (claves primarias, claves foráneas indicando que hacer al
borrar o actualizar, etc.). Implementar las restricciones de tipos.
4. Generar un script SQL para la carga de información en la base de datos
(archivo de texto con el código SQL para la inserción de datos).
*/

DROP SCHEMA IF EXISTS proyecto CASCADE;
CREATE SCHEMA proyecto;

DROP TABLE IF EXISTS proyecto.persona;
CREATE TABLE proyecto.persona(
dni   int NOT NULL,
nombre   varchar (25),
apellido   varchar (25),
fecha_nac   date,
PRIMARY KEY (dni)	
);

DROP TABLE IF EXISTS proyecto.personal;
CREATE TABLE proyecto.personal(
dni   int NOT NULL,
antiguedad   int,
sueldo   decimal(9,3),  
PRIMARY KEY (dni),
CONSTRAINT fk_dni_personal FOREIGN KEY (dni) REFERENCES proyecto.persona (dni)
);

DROP TABLE IF EXISTS proyecto.gerente;
CREATE TABLE proyecto.gerente(
dni   int NOT NULL,
comision   varchar (50),
PRIMARY KEY (dni),
CONSTRAINT fk_dni_gerente FOREIGN KEY (dni) REFERENCES proyecto.persona (dni)
);

DROP TABLE IF EXISTS proyecto.mucama;
CREATE TABLE proyecto.mucama (
dni   int NOT NULL,
PRIMARY KEY (dni),
CONSTRAINT fk_dni_mucama FOREIGN KEY (dni) REFERENCES proyecto.persona (dni)
);

DROP TABLE IF EXISTS proyecto.cliente;
CREATE TABLE proyecto.cliente (
dni   int NOT NULL,
fecha_pri_hospedaje   date,
PRIMARY KEY (dni),
CONSTRAINT fk_dni_cliente FOREIGN KEY (dni) REFERENCES proyecto.persona (dni)	
);

DROP TABLE IF EXISTS proyecto.tipo_habitacion;
CREATE TABLE proyecto.tipo_habitacion (
cod_tipo_habitacion   int NOT NULL,
descripcion   varchar (400), -- el atributo descpricion puede alojar hasta 400 caracteres para dar una buena informacion sobre el tipo de habitacion.
costo   decimal(9,3),
PRIMARY KEY (cod_tipo_habitacion)
);

-- se crea un nuevo dominio llamado 'dominioCama'
DROP DOMAIN IF EXISTS dominioCama;
CREATE DOMAIN dominioCama as varchar (20)
CONSTRAINT renom_dominioCama CHECK (VALUE IN ('Simple', 'Doble', 'Triple', 'Cuadruple'));

DROP TABLE IF EXISTS proyecto.habitaciones;
CREATE TABLE proyecto.habitaciones (
nro_habitacion   int NOT NULL,
cantidad_camas   dominioCama NOT NULL, -- cantidad_camas es de 'dominioCama'
cod_tipo_habitacion   int NOT NULL,
PRIMARY KEY (nro_habitacion),
CONSTRAINT fk_cod_tipo_habitacion FOREIGN KEY (cod_tipo_habitacion) REFERENCES proyecto.tipo_habitacion (cod_tipo_habitacion)
);

DROP TABLE IF EXISTS proyecto.fecha;
CREATE TABLE proyecto.fecha (
d_m_a   date NOT NULL, -- variable d_m_a es dia_mes_año
PRIMARY KEY (d_m_a)
);

DROP TABLE IF EXISTS proyecto.atiende;
CREATE TABLE proyecto.atiende (
dni   int NOT NULL, -- dni_mucama
nro_habitacion   int NOT NULL,
PRIMARY KEY (dni, nro_habitacion),
CONSTRAINT fk1_dni_mucama FOREIGN KEY (dni) REFERENCES proyecto.mucama (dni),
CONSTRAINT fk_nro_habitacion FOREIGN KEY (nro_habitacion) REFERENCES proyecto.habitaciones (nro_habitacion)
);

DROP TABLE IF EXISTS proyecto.ocupa;
CREATE TABLE proyecto.ocupa (
nro_habitacion   int NOT NULL,
d_m_a   date DEFAULT NULL, -- dia_mes_año
dni   int DEFAULT NULL, -- dni_cliente
monto   decimal(9,3) DEFAULT NULL,
dias_permanecio   int DEFAULT NULL,
PRIMARY KEY (nro_habitacion, d_m_a),
CONSTRAINT fk1_nro_habitacion FOREIGN KEY (nro_habitacion) REFERENCES proyecto.habitaciones (nro_habitacion),
CONSTRAINT fk1_dni_cliente FOREIGN KEY (dni) REFERENCES proyecto.cliente (dni),
CONSTRAINT fk_d_m_a FOREIGN KEY (d_m_a) REFERENCES proyecto.fecha (d_m_a),
CONSTRAINT unicoclihab UNIQUE (dni, d_m_a)
);

-- se crea la tabla inforamcionAuditoria para el trigger
DROP TABLE IF EXISTS proyecto.informacionAuditoria;
CREATE TABLE proyecto.informacionAuditoria (
nro_habitacion   int NOT NULL,
fecha_cambio   date DEFAULT NULL,	
cliente_anterior   int DEFAULT NULL, -- dni cliente anterior
cliente_nuevo   int DEFAULT NULL, -- dni cliente nuevo
usuario_registro   name DEFAULT NULL,
PRIMARY KEY (nro_habitacion, fecha_cambio),
CONSTRAINT fk2_nro_habitacion FOREIGN KEY (nro_habitacion) REFERENCES proyecto.habitaciones (nro_habitacion)
--CONSTRAINT unicidad UNIQUE (fecha_cambio, cliente_nuevo)    
);

INSERT INTO proyecto.persona (dni, nombre, apellido, fecha_nac) VALUES 
(42308992, 'Genaro', 'Salomone', '12/11/1999'), -- gerente
(38106484, 'Cristian', 'Hererra', '05/06/1995'), -- gerente
(41772093, 'Lucas', 'Toledo', '23/02/1998'), -- gerente
(28456123, 'Lucrecia', 'Geimonat', '23/05/1983'), -- mucama
(30529736, 'Aldana', 'Riquelme', '07/11/2002'), -- mucama
(16530675, 'Osvaldo', 'Ferreiro', '08/12/1989'), -- cliente
(17380992, 'Javier', 'Milei', '04/07/1964'), -- cliente
(43001274, 'Emilia', 'Mernes', '19/02/1995'); -- cliente

INSERT INTO proyecto.personal (dni, antiguedad, sueldo) VALUES
(42308992, 8, 125.000), -- genaro (gerente)
(38106484, 9, 127.500), -- cristian (gerente)
(41772093, 7, 122.750), -- lucas (gerente)
(28456123, 5, 60.400), -- lucrecia (mucama)
(30529736, 10, 90.500); -- aldana (mucama)

INSERT INTO proyecto.cliente (dni, fecha_pri_hospedaje) VALUES
(16530675, '10/02/2021'), -- osvaldo (cliente)
(17380992, '29/05/2020'), -- javier (cliente)
(43001274, '03/04/2022'); -- emilia (cliente)

INSERT INTO proyecto.gerente (dni, comision) VALUES
(42308992, 'Asociación de hotel tras la sierra'), -- genaro (gerente)
(38106484, 'Unidad de hoteles Cordoba'), -- cristian (gerente)
(41772093, 'Hotel de la sierra avanza'); -- lucas (gerente)

INSERT INTO proyecto.mucama (dni) VALUES 
(28456123), -- lucrecia (mucama)
(30529736); -- aldana (mucama)

INSERT INTO proyecto.tipo_habitacion (cod_tipo_habitacion, descripcion, costo) VALUES
(1, 'Acomodación para una sola persona, servicio internet, TV por cable, vista a las sierras', 1.900), -- existe una sola cama
(2, 'Acomodación hasta 2 personas, servicio internet, direcTV satelital', 2.000), -- existen 2 camas
(3, 'Acomodación hasta 3 personas, servicio internet, direcTV satelital, jacuzzi', 2.800), -- existen 3 camas
(4, 'Acomodación hasta 4 personas, servicio internet, direcTV satelital, jacuzzi, servicio a la habitacion', 3.350); -- existen 4 camas

INSERT INTO proyecto.habitaciones (nro_habitacion, cantidad_camas, cod_tipo_habitacion) VALUES
(1, 'Triple', 3),
(2, 'Doble', 2),
(3, 'Doble', 2),
(4, 'Triple', 3),
(5, 'Cuadruple', 4),
(6, 'Simple', 1),
(7, 'Cuadruple', 4);

INSERT INTO proyecto.fecha (d_m_a) VALUES
('01/01/0001'), -- fecha para inicializar habitaciones en ocupa
('10/02/2021'), -- fecha primer hospedaje de osvaldo (cliente)
('29/05/2020'), -- fecha primer hospedaje de javier (cliente)
('03/04/2022'), -- fecha primer hospedaje de emilia (cliente)
('15/03/2022'), -- fecha random
('01/12/2020'), -- fecha random
('17/09/2021'); -- fecha random

INSERT INTO proyecto.atiende (dni, nro_habitacion) VALUES -- dni_mucama
(28456123, 1), -- lucrecia atiende habitacion 1
(28456123, 2), -- lucrecia atiende habitacion 2
(28456123, 3), -- lucrecia atiende habitacion 3
(30529736, 3), -- aldana atiende habitacion 3
(28456123, 4), -- aldana atiende habitacion 4
(30529736, 5), -- lucrecia atiende habitacion 5
(30529736, 6), -- lucrecia atiende habitacion 6
(30529736, 7), -- lucrecia atiende habitacion 7
(28456123, 6); -- aldana atiende habitacion 7

INSERT INTO proyecto.ocupa (nro_habitacion, d_m_a, dni, monto, dias_permanecio) VALUES -- dni_cliente
(1, '29/05/2020', 17380992, 8.400, 3), -- habitacion 1 primer fecha hospedaje de javier pago $8.400 y estuvo 3 dias 
(4, '03/04/2022', 43001274, 14.000, 5), -- habitacion 4 primer fecha hospedaje de emilia pago $14.000 y estuvo 5 dias
(2, '10/02/2021', 16530675, 2.000, 1), -- habitacion 4 primer fecha hospedaje de osvaldo pago $2.000 y estuve 1 dia
(7, '01/12/2020', 17380992, 6.700, 2), -- habitacion 7 segunda fecha de hospedaje de javier pago $6.700 y estuvo 2 dias
(3, '15/03/2022', 16530675, 4.000, 2); -- habitacion 3 segunda fecha de hospedaje de osvaldo pago $4.000 y estuvo 2 dias

-- se crea la funcion que se ejecuta dentro del trigger

CREATE OR REPLACE FUNCTION funcion_auditoria() returns trigger
as
$$
begin

INSERT INTO proyecto.informacionAuditoria VALUES (old.nro_habitacion, now(), old.dni, new.dni, current_user);

return new;
end
$$
language  plpgsql;

-- se crea el trigger para generar la informacion de auditoria

CREATE TRIGGER trigg_auditoria BEFORE UPDATE ON proyecto.ocupa
FOR EACH ROW
EXECUTE PROCEDURE funcion_auditoria ();

-- se realiza la actualizacion en la tabla OCUPA

UPDATE proyecto.ocupa SET
dni = 43001274, monto = 5000, dias_permanecio = 3, d_m_a = now()  -- nuevo cliente, el dni debe ser referido al cliente
WHERE (nro_habitacion = 5 );

UPDATE proyecto.ocupa SET
dni = 16530675
where (nro_habitacion = 7);

select * from proyecto.ocupa;
