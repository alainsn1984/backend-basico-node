const { response } = require("express");

const usuariosGet = (req, res = response) => {
  res.json({
    msg: "Get API",
  });
};

const usuarioPost = (req, res) => {
  const body = req.body;
  res.json({
    msg: "Post API",
    body,
  });
};

const usuarioPut = (req, res) => {
  res.json({
    msg: "Put API",
  });
};

const usuarioDelete = (req, res) => {
  res.json({
    msg: "Delete API",
  });
};

module.exports = {
  usuariosGet,
  usuarioPost,
  usuarioPut,
  usuarioDelete,
};
