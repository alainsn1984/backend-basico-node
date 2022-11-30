const { Router } = require("express");
const { check } = require("express-validator");
const {
  crearProducto,
  obtenerProductos,
  eliminarProducto,
  actualizarProducto,
  obtenerProductoById,
} = require("../controllers/products");
const { existeProductoById } = require("../helpers/db-validator");
const { validarJWT, validarCampos } = require("../middlewares");

const router = Router();

router.get("/", obtenerProductos);

router.get(
  "/:id",
  [
    validarJWT,
    check("id", "No es un id de Mongo valido").isMongoId(),
    check("id").custom(existeProductoById),
    validarCampos,
  ],
  obtenerProductoById
);

router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("usuario", "El usuario es obligatorio").not().isEmpty().isMongoId(),
    check("categoria", "La categoria es obligatoria")
      .not()
      .isEmpty()
      .isMongoId(),
    validarCampos,
  ],
  crearProducto
);

router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un id de Mongo").isMongoId(),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("usuario", "El usuario es obligatorio").not().isEmpty().isMongoId(),
    check("categoria", "La categoria es obligatoria")
      .not()
      .isEmpty()
      .isMongoId(),
    validarCampos,
  ],
  actualizarProducto
);

router.delete(
  "/:id",
  [validarJWT, check("id", "No es un id de Mongo").isMongoId(), validarCampos],
  eliminarProducto
);

module.exports = router;
