const { Router } = require("express");
const { check } = require("express-validator");
const {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  eliminarProducto,
} = require("../controllers/productos");
const {
  existeCategoriaById,
  existeProductoById,
} = require("../helpers/db-validator");

const { validarJWT, validarCampos, esAdminRol } = require("../middlewares");

const router = Router();

//Obtener todas las PRODUCTOS
router.get("/", obtenerProductos);

//Obtener una producto por id
router.get(
  "/:id",
  [
    validarJWT,
    check("id", "No es un id de Mongo valido").isMongoId(),
    check("id", "No existe un producto con ese id").custom(existeProductoById),
    validarCampos,
  ],
  obtenerProducto
);
//Crear Producto Privado, cualquiera con un token valido
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("categoria", "No es un id de Mongo valido").isMongoId(),
    check("categoria", "No existe una categoria con ese id").custom(
      existeCategoriaById
    ),
    validarCampos,
  ],
  crearProducto
);
//Actualizar privado, cualquiera con token valido
router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un id de Mongo valido").isMongoId(),
    check("id", "No existe un producto con ese id").custom(existeProductoById),
    validarCampos,
  ],
  actualizarProducto
);
//Borrar un producto solo para administradores
router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRol,
    check("id", "No es un id de Mongo valido").isMongoId(),
    check("id").custom(existeProductoById),
    validarCampos,
  ],
  eliminarProducto
);

module.exports = router;
