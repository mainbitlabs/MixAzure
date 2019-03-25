//Paquetes:
var azure = require('azure-storage');

//Crear conexión:
var azure2 = require('./keys_azure'); //Importación de llaves
var tableSvc = azure.createTableService("tuCuenta", "tuClaveDeAcceso");

//Tabla origen:
var tablaUsar = "TablaATrabajar";

//Query:
var query = new azure.TableQuery();
var nextContinuationToken = null;

//Variables:
var contador = 0;
var finalizar = false;

//Programa:
async function working() {
    //Bucle:
    do {
        await promesa();
    } while (finalizar == false);
    resultado();
}

function promesa() {
    return new Promise(function(resolve, reject) {
        tableSvc.queryEntities(tablaUsar, query, nextContinuationToken, function(error, results, response) {

            //Logica por cada entidad:
            if (!error) {
                results.entries.forEach(function(entry) {
                    console.log("Encontre una entidad.");
                    contador++;
                });
            }

            //Token que permite continuar despues de leer 1000 rows:
            if (results.continuationToken) {
                nextContinuationToken = results.continuationToken;
                resolve();
            } else {
                finalizar = true;
                resolve();
            }

        });
    });
}

//Funcion que se ejecuta el final del programa:
function resultado() {
    //Resumen por consola:
    console.log(`Se encontrarion ${contador} entidades.`);
    console.log("El programa ha terminado:");
}

//Inicia el trabajo:
working();