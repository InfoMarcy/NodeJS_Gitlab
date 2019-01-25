const Joi = require("joi");
const dateFormat = require("dateformat");
const now = new Date();
const fs = require("fs");
const path = require("path");
//working with log files
const log4js = require("log4js");
const logger = log4js.getLogger("validaciones");

// get the path of the json file that we are going to user
const p = path.join(
  path.dirname(process.mainModule.filename),
  "db",
  "numIntentos.json"
);

// usuario model
const Usuario = require("../models/usuario");

module.exports = {
  validateNumEmpleado: function(req) {
    const schema = {
      numEmpleado: Joi.number()
        .integer()
        .required()
    };

    return Joi.validate(req, schema);
  },

  validateIp: function(req) {
    const schema = {
      ip: Joi.string()
        .min(7)
        .max(45)
        .required()
    };

    return Joi.validate(req, schema);
  },

  validateDate: function(fecha) {
    // Convert both dates to milliseconds
    let one_day = 1000 * 60 * 60 * 24;
    // convert the date to be use to compare the days
    let usuarioPassDate = new Date(
      parseInt(dateFormat(fecha, "yyyy")),
      parseInt(dateFormat(fecha, "mm")) - 1,
      parseInt(dateFormat(fecha, "dd")) + 1,
      parseInt(dateFormat(fecha, "HH") - 5),
      parseInt(dateFormat(fecha, "MM")),
      parseInt(dateFormat(fecha, "ss"))
    );

    let difference_ms = now.getTime() - usuarioPassDate.getTime();

    if (Math.round(difference_ms / one_day) > 90) {
      logger.info(
        `La contraseña ha expirado, el numero máximo de días para cambiar la contraseña es 90 dias, este usuario tiene ${Math.round(
          difference_ms / one_day
        )} con esta contraseña, Gracias`
      );
      return true;
    } else {
      logger.info(
        `La contraseña esta activa, el numero máximo de días para cambiar la contraseña es 90 dias, este usuario tiene ${Math.round(
          difference_ms / one_day
        )} con esta contraseña, Gracias`
      );
      return false;
    }
  },

  validateFechaBloqueo: function(fecha) {

    // Convert both dates to milliseconds
    let one_minute = 1000 * 60;
    // convert the date to be use to compare the days
    let usuarioPassDate = new Date(
      parseInt(dateFormat(fecha, "yyyy")),
      parseInt(dateFormat(fecha, "mm")) - 1,
      parseInt(dateFormat(fecha, "dd")),
      parseInt(dateFormat(fecha, "HH")),
      parseInt(dateFormat(fecha, "MM")),
      parseInt(dateFormat(fecha, "ss"))
    );
    let difference_ms = now.getTime() - usuarioPassDate.getTime();

    if (Math.round(difference_ms / one_minute) >= 10) {
      logger.info(
        `Usuario Desbloqueado ,  ${Math.round(
          difference_ms / one_minute
        )}...`
      );
      return true;
    } else {
      logger.info(
        `El Usuario se encuentra bloqueado ${Math.round(
          difference_ms / one_minute
        )}...`
      );
      return false;
    }
  }


};