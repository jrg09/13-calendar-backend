const mongoose = require("mongoose");
require("dotenv").config();

const dbConnection = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_DB_STRCONN2, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Mongo DB conectada");
  } catch (error) {
    console.log(error);
    throw new Error("Error al inicializar la base de datos con MongoDB");
  }
};

const dbDisconnect = async () => {
  await mongoose.disconnect();
};

module.exports = { dbConnection, dbDisconnect };
