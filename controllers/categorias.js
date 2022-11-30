const { response } = require("express");
const { Categoria } = require("../models");

//Obtener Categorias -Paginados- total - populate
const obtenerCategorias = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, categ] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria.find(query)
      .populate("usuario", "nombre")
      .skip(Number(desde))
      .limit(limite),
  ]);
  res.json({
    total,
    categ,
    //categorias,
  });
};

//Obtener Categoria - populate {}
const obtenerCategoria = async (req, res = response) => {
  const { id } = req.params;
  const result = await Categoria.findById(id).populate("usuario", "nombre");

  res.json({
    result,
  });
};

//Crear Categoria
const crearCategoria = async (req, res = response) => {
  const nombre = req.body.nombre.toUpperCase();

  const categoriaDB = await Categoria.findOne({ nombre });
  if (categoriaDB) {
    return res.status(400).json({
      ok: false,
      msg: `La categoria ${categoriaDB.nombre} existe en Base de Datos`,
    });
  }
  //Generar la data a guardar
  const data = {
    nombre,
    usuario: req.usuario._id,
  };
  const categoria = new Categoria(data);
  await categoria.save();
  res.status(201).json({
    msg: "todo ok",
    categoria,
  });
};

//Actualizar Categoria
const actualizarCategoria = async (req, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;
  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.usuario._id;

  const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });
  res.json(categoria);
};
//Borrar Categoria - estado:false
const eliminarCategoria = async (req, res = response) => {
  const { id } = req.params;

  const categoria = await Categoria.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );
  res.json(categoria);
};

module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  eliminarCategoria,
};
