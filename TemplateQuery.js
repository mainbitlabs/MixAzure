//Paquetes:
var azure = require('azure-storage');

//Crear conexión:
var azure2 = require('./keys_azure'); //Importación de llaves
var tableSvc = azure.createTableService(azure2.storageA, azure2.accessK);
// console.log(azure2.storageA, azure2.accessK);

var proyectoCount = 0;

// var dataArray = [];

fetchAllEntities(null);

function fetchAllEntities(token) {

var query = new azure.TableQuery()
  .select(['PartitionKey','RowKey','Borrado','Check','Resguardo', 'Status'])
  // .top(4)
//   .where('Proyecto eq ?', 'OperacionInterna','SerieBorrada eq ?','2341');
  .where('Proyecto eq ? && Borrado eq ? && Resguardo eq ? && Check eq ?','Proyecto','Aprobado','Aprobado','Aprobado');

  tableSvc.queryEntities(azure2.table1, query, token, function(error, result, response) {
    if(!error) {
      result.entries.forEach(function (entry) {
        
        proyectoCount++;
      });
        // dataArray.push.apply(dataArray, result.entries);
        var token = result.continuationToken;
        if(token) {
            fetchAllEntities(token);
          } 
            else {
              // console.log(result.entries);              
              console.log("Elementos que coinciden: " + proyectoCount);
              // console.log("Elementos que coinciden: " + dataArray.length);
              // callback();
            }
      } else {  
      // ...
  }   
  });
}