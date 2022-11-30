const { response } = require("express");
const jwt = require("jsonwebtoken");

const Usuario = require("../models/usuario");

const validarJWT = async (req, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(400).json({
      msg: "No hay token en la peticion",
    });
  }
  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const usuario = await Usuario.findById(uid);
    if (!usuario) {
      return res.status(401).json({
        msg: "Token no valido, usuario borrado de DB",
      });
    }
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Token no autorizado, usuario con estado: false",
      });
    }
    req.usuario = usuario;

    next();
  } catch (error) {
    console.log(error);
    throw error("Token no valido");
  }
};

module.exports = {
  validarJWT,
};
