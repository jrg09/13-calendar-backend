const { DateTime } = require("luxon");

const isDate = (value) => {
  if (!value) {
    return false;
  }

  const date = DateTime.fromISO(value, { zone: "America/Mexico_City" });

  return date.isValid;
};

const isDateInFuture = (value, { req }) => {
  try {
    const ini = DateTime.fromISO(req.body.start, { zone: "America/Mexico_City" });
    const fin = DateTime.fromISO(value, { zone: "America/Mexico_City" });

    return ini.isValid && fin.isValid && fin > ini;
  } catch (error) {
    return false;
  }
};

module.exports = { isDate, isDateInFuture };
