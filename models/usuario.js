const obtenerDatosFromFile = require("../middleware/obtenerDatosFromFile");

module.exports = class Usuario {
  static getAllIps(cb) {
    obtenerDatosFromFile(cb, "ips.json");
  }

  static getUsuariosBloqueadosPorIp(cb) {
    obtenerDatosFromFile(cb, "bloqueoIp.json");
  }

  static getNumIntentosPorIp(cb) {
    obtenerDatosFromFile(cb, "numIntentosIp.json");
  }
};
