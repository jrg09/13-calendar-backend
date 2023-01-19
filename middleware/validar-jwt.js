const jwt = require("jsonwebtoken");

const validarJWT = (req, res, next) => {
  const token = req.header("x-token");
  // console.log(token);

  if (!token) {
    return res.status(401).json({ ok: false, msg: "Token no presente en request" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("payload", payload);

    req.uid = payload.uid;
    req.name = payload.name;
  } catch (error) {
    console.error(error);
    return res.status(401).json({ ok: false, msg: "Token no válido" });
  }

  next();
};

module.exports = { validarJWT };
