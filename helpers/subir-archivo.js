const path = require("path");
const { v4: uuidv4 } = require("uuid");

const subirArchivo = (
  files,
  extensionPermitidas = ["png", "jpg", "jpge", "gif"],
  carpeta = ""
) => {
  return new Promise((resolve, reject) => {
    const { archivo } = files;
    const nombreCortado = archivo.name.split(".");
    const extension = nombreCortado[nombreCortado.length - 1];

    //Validar Extension
    if (!extensionPermitidas.includes(extension)) {
      reject(
        `La extension ${extension} no es permitida, permitidas: ${extensionPermitidas}`
      );
    }

    const nombreTemp = uuidv4() + "." + extension;
    const uploadPath = path.join(__dirname, "../uploads/", carpeta, nombreTemp);

    archivo.mv(uploadPath, (err) => {
      if (err) {
        return res.status(500).json({ err });
      }

      resolve(nombreTemp);
    });
  });
};

module.exports = {
  subirArchivo,
};
