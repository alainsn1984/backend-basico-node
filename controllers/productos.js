const { response } = require("express");
const { body } = require("express-validator");
const { Producto } = require("../models");

//Obtener Productos -Paginados- total - populate
const obtenerProductos = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .populate("usuario", "nombre")
      .populate("categoria", "nombre")
      .skip(Number(desde))
      .limit(limite),
  ]);
  res.json({
    total,
    productos,
  });
};

//Obtener Producto - populate {}
const obtenerProducto = async (req, res = response) => {
  const { id } = req.params;
  const producto = await Producto.findById(id)
    .populate("usuario", "nombre")
    .populate("categoria", "nombre");

  res.json({
    producto,
  });
};

//Crear Producto
const crearProducto = async (req, res = response) => {
  const { estado, usuario, ...body } = req.body;

  const productoDB = await Producto.findOne(body.nombre.toUpperCase());
  if (productoDB) {
    return res.status(400).json({
      ok: false,
      msg: `El producto ${producto.nombre} ya existe en Base de Datos`,
    });
  }
  //Generar la data a guardar
  body.nombre = body.nombre.toUpperCase();
  body.usuario = body.usuario._id;
  const data = {
    body,
  };
  const producto = new Producto(data);
  await producto.save();
  res.status(201).json({
    producto,
  });
};

//Actualizar Producto
const actualizarProducto = async (req, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;
  if (data.nombre) {
    data.nombre = data.nombre.toUpperCase();
  }
  data.usuario = req.usuario._id;

  const producto = await Producto.findByIdAndUpdate(id, data, { new: true });
  res.json(producto);
};
//Borrar Producto - estado:false
const eliminarProducto = async (req, res = response) => {
  const { id } = req.params;

  const producto = await Producto.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );
  res.json(producto);
};

module.exports = {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  eliminarProducto,
};
