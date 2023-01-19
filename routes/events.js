const { Router } = require("express");
const { check, param } = require("express-validator");
const { handleFormValidations } = require("../middleware/validar-campos");
const { validarJWT } = require("../middleware/validar-jwt");
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require("../controllers/events");
const { isDate, isDateInFuture } = require("../helpers/customValidators");

const router = Router();
router.use(validarJWT);

//rutas de: host + /api/events

router.get("/", getEventos);

router.post(
  "/",
  [
    check("title", "El título del evento es obligatorio").exists().not().isEmpty(),
    check("notes", "El cuerpo del evento no está presente").exists(),
    check("start", "Fecha de inicio del evento no válida")
      .exists()
      .not()
      .isEmpty()
      .custom(isDate)
      .withMessage("Fecha no válida")
      .isISO8601()
      .withMessage("Fecha no válida ISO8601"),
    check("end", "Fecha de fin del evento no válida")
      .custom(isDate)
      .withMessage("Fecha no válida")
      .exists()
      .not()
      .isEmpty()
      .isISO8601()
      .withMessage("Fecha no válida ISO8601")
      .custom(isDateInFuture)
      .withMessage("Fecha anterior al inicio del evento"),
    handleFormValidations,
  ],
  crearEvento
);
router.put(
  "/:id",
  [
    param("id", "ID De Evento no válido").not().isEmpty().isLength({ min: 24, max: 24 }),
    check("title", "El título del evento es obligatorio").exists().not().isEmpty(),
    check("notes", "El cuerpo del evento no está presente").exists(),
    check("start", "Fecha de inicio del evento no válida").exists().not().isEmpty().isISO8601(),
    check("end", "Fecha de fin del evento no válida")
      .exists()
      .not()
      .isEmpty()
      .isISO8601()
      .custom((value, { req }) => {
        const ini = new Date(req.body.start);
        const fin = new Date(value);
        // console.log({ ini, date, diff: date.getTime() - ini.getTime() });
        return fin.getTime() > ini.getTime();
      }),
    handleFormValidations,
  ],
  actualizarEvento
);
router.delete(
  "/:id",
  [param("id", "ID De Evento no válido").not().isEmpty().isLength({ min: 24, max: 24 }), handleFormValidations],
  eliminarEvento
);

module.exports = router;
