const mysql = require('mysql2');
// configuracion de la conexion a mysql
const conexion = mysql.createConnection({
    host: 'localhost', // servidor local
    user: 'root', // usuario de mysql (por defecto en XAMPP es root)
    database: 'tienda' // nombre de la base de datos
});

// comprobamos la conexion a mysql
conexion.connect((error) => {
    if (error) {
        console.error('Error de conexion a MySQL:', error);
    } else {
        console.log('Conexion exitosa a MySQL');
    }
});
// exportar la conexion para poder usarla en las rutas de la API
module.exports = conexion;