const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("Base de Datos online");
  } catch (error) {
    console.log(error);
    throw new Error("La conexion no se ha establecido");
  }
};

module.exports = {
  dbConnection,
};
