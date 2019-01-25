// used for working with objects
const _ = require("lodash");
//working with log files
const log4js = require("log4js");
const logger = log4js.getLogger("auth");
// usuario model
const Usuario = require("../models/usuario");
const validaciones = require("../middleware/validaciones");
const jsonCRUDService = require("../service/numIntentosService");
const bloqueoUsuariosService = require("../service/bloqueoUsuariosService");
const dateFormat = require("dateformat");
const now = new Date();
const validarJson = require("../middleware/validarJson");
  // const cifradoJson = require("../middleware/cifradoJson");

module.exports = function(req, res, next) {


  logger.info("La llamada proviene de la Ip => ", { ip: req.connection.remoteAddress});
  logger.info("La llamada fue realizada en la fecha=> ", dateFormat(now, "yyyy-mm-dd HH:MM:ss"));


  // get the token from the header
  let authorizationCode = req.get('Authorization-Code');


  if(!authorizationCode || authorizationCode != '~3$}W>qT8hX),2MV'){
    return res.status(403).send({
      codigo: "403.BancaDigital-Usuarios-Gitlab.CI-116",
      mensaje: "Error al realizar la operación (No Token)",
      folio: validarJson.generarFolio(req.connection.remoteAddress),
      info:
        "https://baz-developer.bancoazteca.com.mx/errors#403.BancaDigital-Usuarios-Gitlab.CI-116",
      detalles: {
        cgSalida: "CI-116",
        descSalida: "No estas autorizado para consumir este recurso"
      }
    });

  }

  


  // validate the body of the request
  const { error } = validaciones.validateNumEmpleado(req.body);
  if (error)
    return res.status(400).send({
      codigo: "400.BancaDigital-Usuarios-Gitlab.CI-104",
      mensaje: "Los Datos de entrada no cumplen con el formato esperado",
      folio: validarJson.generarFolio(req.connection.remoteAddress),
      info:
        "https://baz-developer.bancoazteca.com.mx/errors#400.BancaDigital-Usuarios-Gitlab.CI-104",
      detalles: {
        cgSalida: "CI-104",
        descSalida: error.details[0].message
      }
    });

  const { ipError } = validaciones.validateIp(req.connection.remoteAddress);
  if (ipError)
    return res.status(400).send({
      codigo: "400.BancaDigital-Usuarios-Gitlab.CI-104",
      mensaje: "Los Datos de entrada no cumplen con el formato esperado",
      folio: validarJson.generarFolio(req.connection.remoteAddress),
      info:
        "https://baz-developer.bancoazteca.com.mx/errors#400.BancaDigital-Usuarios-Gitlab.CI-104",
      detalles: {
        cgSalida: "CI-104",
        descSalida: ipError.details[0].message
      }
    });

   // check if ip is registered on the white list
   Usuario.getAllIps(ips => {
      //find if Ip is on white list
      let ipWhiteList =
        ips.filter(function(r) {
          return r["ip"] == req.connection.remoteAddress;
        })[0] || null;

    
      if (!ipWhiteList) {
        logger.info({
          cgSalida: "CI-126",
          descSalida: "No estas autorizado para consumir este recurso"
        });
        return res.status(403).send({
          codigo: "403.BancaDigital-Usuarios-Gitlab.CI-116",
          mensaje: "Error al realizar la operación",
          folio: validarJson.generarFolio(req.connection.remoteAddress),
          info:
            "https://baz-developer.bancoazteca.com.mx/errors#403.BancaDigital-Usuarios-Gitlab.CI-116",
          detalles: {
            cgSalida: "CI-116",
            descSalida: "No estas autorizado para consumir este recurso"
          }
        });
      } 

 });
 next();
}
