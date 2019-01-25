// usuario model
const Usuario = require("../models/usuario");
const validarJson = require("../middleware/validarJson");
const writeDataToJsonFile = require("../middleware/writeDataToJsonFile");
//working with log files
const log4js = require("log4js");
const logger = log4js.getLogger("NumIntentos por username");

// numIntentosIP Object
let numIntentosIP = [];

Usuario.getNumIntentosPorUsername(obj => {
  if (!validarJson.isEmptyObject(obj)) {
    numIntentosIP = obj;
  }
});

module.exports = {

  // create a record
  create: function(obj) {
    numIntentosIP.push(obj);

    if (numIntentosIP.length != 0) {
      writeDataToJsonFile(numIntentosIP, "numIntentosUsuario.json");
      logger.info("Numero de intento por username creado exitosamente");
      //return obj;
      return;
    } else {
      logger.info("Error al tratar de guardar el numero de intento por Username");
      return;
    }
  },

  getByUsername: function(username) {
    var filteredNumIntentos = [];

    if (!validarJson.isEmptyObject(numIntentosIP)) {
      for (var i = 0; i < numIntentosIP.length; i++) {
        if (numIntentosIP[i].username === username) {
          filteredNumIntentos.push(numIntentosIP[i]);
        }
      }

      if (!validarJson.isEmptyObject(filteredNumIntentos)) {
        if (filteredNumIntentos.length != 0) {
          return filteredNumIntentos[0].numIntentos;
        } else {
          logger.info("Error al tratar de obtener el numero de intento por Username");
          return 0;
        }
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  },

  // delete a record
  delete: function(username) {
    for (var i = 0; i < numIntentosIP.length; i++) {
      if (numIntentosIP[i].username === username) {
        numIntentosIP.splice(i, 1);
      }
    }

    if (numIntentosIP.length != 0) {
      writeDataToJsonFile(numIntentosIP, "numIntentosUsuario.json");
      return numIntentosIP;
    } else return new Error("Something Failed");
  },

  // update a record
  update: function(username, objToUpdate) {
    console.log("update => ", username, objToUpdate);
    
    for (var i = 0; i < numIntentosIP.length; i++) {
      if (numIntentosIP[i].username === username) numIntentosIP[i] = objToUpdate;
    }

    if (numIntentosIP.length != 0) {
      writeDataToJsonFile(numIntentosIP,  "numIntentosUsuario.json");
      //return objToUpdate;
      logger.info("Actualizacion de numero de intento por Username exitosa");
      return;
    } else {
      logger.info("Incidencia al actualizar el numero de intentos por usuario");
      return;
    }
  }
};
