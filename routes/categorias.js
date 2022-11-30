const { Router } = require("express");
const { check } = require("express-validator");
const {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  eliminarCategoria,
} = require("../controllers/categorias");
const { existeCategoriaById } = require("../helpers/db-validator");

const { validarJWT, validarCampos, esAdminRol } = require("../middlewares");

const router = Router();

//Obtener todas las categorias
router.get("/", obtenerCategorias);

//Obtener una categoria por id
router.get(
  "/:id",
  [
    validarJWT,
    check("id", "No es un id de Mongo valido").isMongoId(),
    check("id").custom(existeCategoriaById),
    validarCampos,
  ],
  obtenerCategoria
);
//Crear Categoria Privado, cualquiera con un token valido
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearCategoria
);
//Actualizar privado, cualquiera con token valido
router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un id de Mongo valido").isMongoId(),
    check("id").custom(existeCategoriaById),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  actualizarCategoria
);
//Borrar una categoria solo para administradores
router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRol,
    check("id", "No es un id de Mongo valido").isMongoId(),
    check("id").custom(existeCategoriaById),
    validarCampos,
  ],
  eliminarCategoria
);

module.exports = router;
