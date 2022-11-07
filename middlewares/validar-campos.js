const { validationResult } = require("express-validator");

const validarCampos = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      msg: "Errores encontrados",
      errors,
    });
  }

  next();
};

module.exports = {
  validarCampos,
};
