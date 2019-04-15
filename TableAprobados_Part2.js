//Paquetes:
var azure = require('azure-storage');

//Crear conexión:
var azure2 = require('./keys_azure'); //Importación de llaves
var tableSvc = azure.createTableService(azure2.myaccount, azure2.myaccesskey);

//JSON tabla5:
var tablaUsar = "botdyesatb02";
var tablaUsar5 = "botdyesatb05";
var taskTabla5 = {
    PartitionKey: { '_': 'Proyecto' },
    RowKey: { '_': 'Serie' },
    Timestamp: { '_': '' },
    Asociado: { '_': '' },
    Baja: { '_': '' },
    Borrado: { '_': '' },
    Check: { '_': '' },
    Resguardo: { '_': '' },
    HojaDeServicio: { '_': '' },
    Status: { '_': '' },
    No_Fact: { '_': '' }
};

//Query:
var query = new azure.TableQuery()
    .where('Status eq ?', "Procesado");
var nextContinuationToken = null;
var finalizar = false;
var falla = false;

//Contador:
var total = 0;



function promesa() {
    return new Promise(function(resolve, reject) {
        tableSvc.queryEntities(tablaUsar, query, nextContinuationToken, function(error, results, response) {
            if (!error) {
                //Recorrido por row:
                results.entries.forEach(function(entry) {

                    //Tarea Tabla5:
                    taskTabla5['PartitionKey']['_'] = entry['Proyecto']['_'];
                    taskTabla5['RowKey']['_'] = entry['RowKey']['_'];
                    taskTabla5['Asociado']['_'] = entry['PartitionKey']['_'];
                    taskTabla5['Baja']['_'] = entry['Baja']['_'];
                    taskTabla5['Borrado']['_'] = entry['Borrado']['_'];
                    taskTabla5['Check']['_'] = entry['Check']['_'];
                    taskTabla5['Resguardo']['_'] = entry['Resguardo']['_'];
                    taskTabla5['HojaDeServicio']['_'] = entry['HojaDeServicio']['_'];
                    taskTabla5['No_Fact']['_'] = entry['No_Fact']['_'];

                    tableSvc.insertOrMergeEntity(tablaUsar5, taskTabla5, function(error, result, response) {
                        if (!error) {
                            console.log("La entidad se agrego o remplazo correctamente a la tabla 5");
                        } else {
                            console.log(`Hay un error`);
                            falla == true;
                        }

                    });

                    //Conteo de entidades encontradas
                    total++;
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
    console.log(`Total de campos analizados: ${total}`);
}

async function Bucle() {
    //Bucle:
    await promesa();
    if (falla == false) {
        if (finalizar == false) {
            setTimeout(function() { Bucle() }, 10000);
        } else {
            setTimeout(function() { resultado() }, 10000);
        }
    } else {
        console.log('El programa se ha detenido por que se ha detectado un error, vuelva a intentalo.');
    }
}

//Inicia el trabajo:
Bucle();