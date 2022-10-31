const express = require("express");
const cors = require("cors");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.ususariosPth = "/api/usuarios/";

    // Middlewares
    this.middlewares();
    //rutas
    this.routes();
  }
  middlewares() {
    // CORS
    this.app.use(cors());

    // Lectura y Parseo del body
    this.app.use(express.json());

    //Directorio Publico
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.ususariosPth, require("../routes/user"));
  }
  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server is running, port ${this.port}`);
    });
  }
}

module.exports = Server;