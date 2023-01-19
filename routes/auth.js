const { Router } = require("express");
const { crearUsuario, loginUsuario, renovarToken } = require("../controllers/auth");
const { check } = require("express-validator");
const { handleFormValidations } = require("../middleware/validar-campos");
const { validarJWT } = require("../middleware/validar-jwt");
const router = Router();

//rutas de: host + /api/auth

//http://localhos/apu/auth
router.post(
  "/",
  [
    check("email", "El email es obligatorio").exists().isEmail().withMessage("Email no válido"),
    check("password", "El password es obligatorio.").exists().not().isEmpty(),
    handleFormValidations,
  ],
  loginUsuario
);

//http://localhos/apu/auth/new
router.post(
  "/new",
  [
    check("name", "El nombre es obligatorio")
      .not()
      .isEmpty()
      .isLength({ min: 3 })
      .withMessage("Nombre mínimo 3 letras"),
    check("email", "El email es obligatorio").exists().isEmail().withMessage("Email no válido"),
    check("password", "El password es obligatorio.")
      .exists()
      .not()
      .isEmpty()
      .isLength({ min: 6 })
      .withMessage("Password de 6 letras mínimo"),
    handleFormValidations,
  ],
  crearUsuario
);

//http://localhos/apu/renew
router.get("/renew", validarJWT, renovarToken);

module.exports = router;
