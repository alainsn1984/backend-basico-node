const { Producto, Categoria } = require("../models");
const Role = require("../models/role");
const Usuario = require("../models/usuario");

const esRolValido = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no existe en la BD`);
  }
};

const emailExiste = async (correo = "") => {
  const existeCorreo = await Usuario.findOne({ correo });
  if (existeCorreo) {
    throw new Error(`El correo ${correo} ya existe`);
  }
};

const existeUsuarioPorId = async (id) => {
  const existeUsuario = await Usuario.findById(id);
  if (!existeUsuario) {
    throw new Error(`No existe un usuario con ese id ${id}`);
  }
};

const existeCategoriaById = async (id) => {
  const existeCat = await Categoria.findById(id);
  if (!existeCat) {
    throw new Error(`No existe una categoria con el id ${ids}`);
  }
};

const existeProductoById = async (id) => {
  const existeProducto = await Producto.findById(id);
  if (!existeProducto) {
    throw new Error(`No existe un producto con el id ${id}`);
  }
};

const coleccionesPermitidas = (coleccion = "", permitidas = []) => {
  const colPermitidas = permitidas.includes(coleccion);
  if (!colPermitidas) {
    throw new Error(`La coleccion ${coleccion} no es permitida, ${permitidas}`);
  }
  return true;
};

module.exports = {
  esRolValido,
  emailExiste,
  existeUsuarioPorId,
  existeCategoriaById,
  existeProductoById,
  coleccionesPermitidas,
};
