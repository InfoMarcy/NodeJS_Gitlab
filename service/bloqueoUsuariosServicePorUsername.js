// usuario model
const Usuario = require("../models/usuario");
const validarJson = require("../middleware/validarJson");
const writeDataToJsonFile = require("../middleware/writeDataToJsonFile");
//working with log files
const log4js = require("log4js");
const logger = log4js.getLogger("Bloquear usuario Service");

// usuarios Object
let usuarios = [];

Usuario.getUsuariosBloqueadosPorUsername(obj => {
  if (!validarJson.isEmptyObject(obj)) {
    usuarios = obj;
  }
});

module.exports = {
  // create a record
  create: function(obj) {
    console.log("create obj => ", obj);
    usuarios.push(obj);

    if (usuarios.length != 0) {
      writeDataToJsonFile(usuarios, "bloqueoUsuario.json");
      logger.info("Usuario bloqueado exitosamente");
      //return obj;
      return;
    } else {
      logger.info("Error al bloquear el usuario");
      return;
    }
  },

  getByUsername: function(username) {
    var filteredByIp = [];
console.log("getByUsername por user => ", usuarios);

    if (!validarJson.isEmptyObject(usuarios)) {
      for (var i = 0; i < usuarios.length; i++) {
        if (usuarios[i].usuario === username) {
          filteredByIp.push(usuarios[i]);
        }
      }

      if (!validarJson.isEmptyObject(filteredByIp)) {
        if (filteredByIp.length != 0) {
          return filteredByIp[0];
        } else {
          logger.info("Error al tratar de obtener el numero de intento por IP");
          return 0;
        }
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  },

  deleteByUsername: function(username) {
    for (var i = 0; i < usuarios.length; i++) {
      if (usuarios[i].usuario === username) {
        usuarios.splice(i, 1);
      }
    }

    try {
      writeDataToJsonFile(usuarios, "bloqueoUsuario.json");
      return;
    } catch (err) {
      console.log("Error => ", err);
    }
  }
};
