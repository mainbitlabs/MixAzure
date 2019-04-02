//Paquetes:
var azure = require('azure-storage');

//Crear conexión:
var azure2 = require('./keys_azure'); //Importación de llaves
var tableSvc = azure.createTableService(azure2.myaccount, azure2.myaccesskey);

//Leer Libro:
var workbook = XLSX.readFile(libroPath);
var sheet_name_list = workbook.SheetNames;
data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

//Query:
var query = new azure.TableQuery();
var nextContinuationToken = null;

//Tabla origen:
var tablaUsar = "botdyesatb01";

//Variables:
var contador = 0;
var finalizar = false;

//No es necesario completar el JSON, puede esta vacio por que toma el valor
//de la entidad durante el programa, pero tenerlo así sirve de guia par atrabajar:
var task = { //JSON base
    PartitionKey: { '_': '' },
    RowKey: { '_': '' },
    Timestamp: { '_': '' },
    Area: { '_': '' },
    Baja: { '_': '' },
    Borrado: { '_': '' },
    Check: { '_': '' },
    Descripcion: { '_': '' },
    Fecha_Fact: { '_': '' },
    Fecha_Fin: { '_': '' },
    Fecha_ini: { '_': '' },
    HojaDeServicio: { '_': '' },
    Inmueble: { '_': '' },
    Localidad: { '_': '' },
    No_Fact: { '_': '' },
    NombreEnlace: { '_': '' },
    NombreUsuario: { '_': '' },
    Pospuesto: { '_': '' },
    Proyecto: { '_': '' },
    Resguardo: { '_': '' },
    SerieBorrada: { '_': '' },
    Servicio: { '_': '' },
    Status: { '_': '' },
};


//Programa
async function working() {
    //Bucle:
    do {
        await promesa();
    } while (finalizar == false);
    resultado();
}

function promesa() {
    return new Promise(function(resolve, reject) { //Promesa 1

        tableSvc.queryEntities(tablaUsar, query, nextContinuationToken, function(error, results, response) {
            if (!error) {
                results.entries.forEach(function(entry) {

                    //Bluque que analiza Azure Table:
                    if (entry['Proyecto']['_'] == "INAH3") {

                        //Blucle que analiza Excel:
                        for (var key in data) {
                            if (entry['RowKey']['_'] == data[key]['RowKey']) {
                                console.log(`Coincide ${entry['RowKey']['_']} - ${data[key]['RowKey']}`);

                                //Tomamos la entidad y la guardamos en el JSON base:
                                task = entry;

                                //Incluimos la información de Excel a la tabla:
                                task['No_Fact']['_'] = data[key]['Content.No_Fact'];
                                task['Fecha_Fact']['_'] = data[key]['Fecha'];

                                //Remplazamos la entidad con la nueva base modificada:
                                tableSvc.replaceEntity(tablaUsar, task, function(error, result, response) {
                                    if (!error) {
                                        console.log("La entidad se modifico correctamente.");
                                    }
                                });

                                //Aumentamos la celda para trabajar en la siguiente y sumamos un contador para conocer
                                //el resultado por log:
                                celdaActual++
                                contador++;
                            }
                        }
                    }
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
    console.log(`Se encontraron ${contador} coincidencias.`);
}

//Inicia el trabajo:
working();