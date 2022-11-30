const { response } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const loginController = async (req, res = response) => {
  const { correo, password } = req.body;
  try {
    //Verificar que el usuario existe
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        msg: "Usuario / contraseña no son correctos - correo",
      });
    }
    //Verificar el estado del usuario
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "Usuario / Contraseña no son correctos - estado",
      });
    }

    // Comprobar contraseña
    const passwordValid = bcryptjs.compareSync(password, usuario.password);
    if (!passwordValid) {
      return res.status(400).json({
        msg: "Usuario / Contraseña no son correctos - password",
      });
    }
    //Generar JWT
    const token = await generarJWT(usuario.id);
    const usuarioAuthenticated = req.usuario;

    res.json({
      usuario,
      token,
      usuarioAuthenticated,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el Administrador",
    });
  }
};
const googleSingIn = async (req, res = response) => {
  const { id_token } = req.body;
  
  try {
    const googleUser = await googleVerify(id_token);
    const {nombre, correo, img} = googleUser;

    let usuario = await Usuario.findOne({ correo });
    console.log(usuario);
    if (!usuario) {
      //tengo que crearlo
      const data = {
        nombre,
        correo,
        password:':P',
        img,
        google: true,
        //rol:'USER_ROLE'
      };
      usuario = new Usuario(data);
      await usuario.save();
    }
    //Si el suario en DB
    if (!usuario.estado) {
      return res.status(401).json({
        msg: 'Hable con el administrador, usuario bloqueado',
      });
    }
    //Generar token
    const token = await generarJWT(usuario.id);

    res.json({
      //msg: "Todo bien google Sing-in",
      token,
      usuario,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      ok: 'false',
      msg: 'El token no se pudo verficar'
    });
    
  }
  
};

module.exports = {
  loginController,
  googleSingIn,
};
