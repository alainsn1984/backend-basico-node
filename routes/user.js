const { Router } = require("express");

const { check } = require("express-validator");
const {
  esRolValido,
  emailExiste,
  existeUsuarioPorId,
} = require("../helpers/db-validator");

const {
  validarCampos,
  validarJWT,
  esAdminRol,
  tieneRole,
} = require("../middlewares");

const {
  usuariosGet,
  usuarioPost,
  usuarioPut,
  usuarioDelete,
} = require("../controllers/user");

const router = Router();

router.get("/", usuariosGet);
router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check(
      "password",
      "La contraseña es obligatoria y más de 6 letras"
    ).isLength({ min: 6 }),
    check("correo", "Esto no es un correo").isEmail().custom(emailExiste),
    //check("rol", "Esto no es un rol válido").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    check("rol").custom(esRolValido),
    validarCampos,
  ],
  usuarioPost
);
router.put(
  "/:id",
  [
    check("id", "No es un Id valido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    check("rol").custom(esRolValido),
    validarCampos,
  ],
  usuarioPut
);
router.delete(
  "/:id",
  [
    validarJWT,
    //esAdminRol,
    tieneRole("ADMIN_ROLE", "VENTAS_ROLE", "NOLO_SE"),
    check("id", "No es un Id valido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
  ],
  usuarioDelete
);

module.exports = router;
