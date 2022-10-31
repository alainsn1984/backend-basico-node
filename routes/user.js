const { Router } = require("express");
const {
  usuariosGet,
  usuarioPost,
  usuarioPut,
  usuarioDelete,
} = require("../controllers/user");

const router = Router();

router.get("/", usuariosGet);
router.post("/", usuarioPost);
router.put("/:id", usuarioPut);
router.delete("/:id", usuarioDelete);

module.exports = router;
