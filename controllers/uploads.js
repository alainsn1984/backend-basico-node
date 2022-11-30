const path = require("path");
const fs = require("fs");

const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");

const { Usuario, Producto } = require("../models");

const cargarArchivo = async (req, res = response) => {
  try {
    // const nombre = await subirArchivo(req.files, ['txt', 'md'], "imgs");
    const nombre = await subirArchivo(req.files, undefined, "imgs");
    res.json({
      nombre,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ errors });
  }
};

const actualizarImagen = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con ese id: ${id}`,
        });
      }
      break;
    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con ese id: ${id}`,
        });
      }
      break;
    default:
      return res.status(501).json({
        msg: "Se me olvido hacer esto",
      });
  }
  if (modelo.img) {
    const imgPath = path.join(__dirname, "../uploads/", coleccion, modelo.img);
    if (fs.existsSync(imgPath)) {
      fs.unlinkSync(imgPath);
    }
  }

  modelo.img = await subirArchivo(req.files, undefined, coleccion);
  await modelo.save();
  res.json({
    modelo,
  });
};

const actualizarImagenCloudinary = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con ese id: ${id}`,
        });
      }
      break;
    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con ese id: ${id}`,
        });
      }
      break;
    default:
      return res.status(501).json({
        msg: "Se me olvido hacer esto",
      });
  }
  //Limpiar imagen
  if (modelo.img) {
    const nombreArr = modelo.img.split("/");
    const nombre = nombreArr[nombreArr.length - 1];
    const [public_id] = nombre.split(".");
    cloudinary.uploader.destroy(public_id);
  }
  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
  //   console.log(resp);
  modelo.img = secure_url;
  await modelo.save();
  res.json({
    modelo,
  });
};

const mostrarImagen = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con ese id: ${id}`,
        });
      }
      break;
    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con ese id: ${id}`,
        });
      }
      break;
    default:
      return res.status(501).json({
        msg: "Se me olvido hacer esto",
      });
  }
  if (modelo.img) {
    const imgPath = path.join(__dirname, "../uploads/", coleccion, modelo.img);
    if (fs.existsSync(imgPath)) {
      return res.sendFile(imgPath);
    }
  }
  const imgPath = path.join(__dirname, "../assets/no-image.jpg");
  res.sendFile(imgPath);
};

module.exports = {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary,
};
