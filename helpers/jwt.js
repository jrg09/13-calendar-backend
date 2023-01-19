const jwt = require("jsonwebtoken");
//require('dotenv').config();

const generarJsonWebToken = (uid, name) => {
  return new Promise((resolve, reject) => {
    const payload = { uid, name };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("No se pudo generar el token");
        }

        console.log(`Token generado: ${token}`);
        resolve(token);
      }
    );
  });
};

module.exports = {
  generarJsonWebToken,
};
