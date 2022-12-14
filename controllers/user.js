const { response } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");

const usuariosGet = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };
  /* const usuarios = await Usuario.find(query)
    .skip(Number(desde))
    .limit(Number(limite));
  const total = await Usuario.countDocuments(query);
*/
  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);

  res.json({
    total,
    usuarios,
  });
};

const usuarioPost = async (req, res = response) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  //Encriptar contraseña
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  //Guardar en DB
  await usuario.save();
  res.json({
    usuario,
  });
};

const usuarioPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;

  if (password) {
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }
  const usuario = await Usuario.findByIdAndUpdate(id, resto);
  res.json(usuario);
};

const usuarioDelete = async (req, res = response) => {
  const { id } = req.params;
  //Borrado Fisico
  //const user = await Usuario.findByIdAndDelete(id);

  const user = await Usuario.findByIdAndUpdate(id, { estado: false });
  const usuarioAutenticated = req.usuario;
  res.json({ user, usuarioAutenticated });
};

module.exports = {
  usuariosGet,
  usuarioPost,
  usuarioPut,
  usuarioDelete,
};
