const express = require("express");
const cors = require("cors");
const { dbConnection, dbDisconnect } = require("./db/config");
require("dotenv").config();

//base de datos
dbConnection();

//crear app de express (server)
const app = express();

//habilitar directorio público
app.use(express.static("public"));

//lectura y parseo de body
app.use(express.json());
app.use(cors());

//rutas
app.use("/api/auth", require("./routes/auth"));
app.use("/api/events", require("./routes/events"));

const port = process.env.PORT || 8090;

//escuchar peticiones
app.listen(port, () => {
  console.log(`Servidor corriendo en http://127.0.0.1:${port}/`);
});

// This now works, and waits until the client is destroyed before exiting.
process.on("SIGINT", async () => {
  console.log("(SIGINT) Shutting down...");
  dbDisconnect();
  console.log("db disconnected");
  process.exit(0);
});

process.once("SIGUSR2", async () => {
  console.log("(SIGUSR2) Shutting down...");
  dbDisconnect();
  console.log("db disconnected");
  process.exit(0);
});
//1
