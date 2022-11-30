const { response } = require("express");
const { Producto } = require("../models");

//Obtener Productos paginados
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

//Obtener un producto por id
const obtenerProductoById = async (req, res = response) => {
  const { id } = req.params;
  const producto = await Producto.findById(id);

  res.json({
    msg: "Get Product",
    producto,
  });
};

//Crear Producto
const crearProducto = async (req, res = response) => {
  const { nombre, usuario, categoria, precio, descripcion } = req.body;
  const producto = new Producto({
    nombre,
    usuario,
    categoria,
    precio,
    descripcion,
  });
  await producto.save();
  res.json({
    msg: "Post Product",
    producto,
  });
};

//Actualizar Producto
const actualizarProducto = async (req, res = response) => {
  const { id } = req.params;
  const { nombre, usuario, categoria, precio, descripcion } = req.body;
  const data = { nombre, usuario, categoria, precio, descripcion };

  const producto = await Producto.findByIdAndUpdate(id, data, { new: true });
  producto.save();
  res.json({
    msg: "Put Product",
    producto,
  });
};

//Eliminar Producto
const eliminarProducto = async (req, res = response) => {
  const { id } = req.params;
  const data = { estado: false };
  const producto = await Producto.findByIdAndUpdate(id, data, { new: true });
  res.json({
    msg: "Delete Product",
    producto,
  });
};

module.exports = {
  obtenerProductos,
  obtenerProductoById,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
};
