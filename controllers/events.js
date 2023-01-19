const { express } = require("express");
const Evento = require("../models/eventoModel");

const getEventos = async (req, res = response) => {
  try {
    const eventos = await Evento.find().populate("user", ["name", "email"]);

    res.json({ ok: true, eventos });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: "Error al obtener el listado de eventos." });
  }
};

const crearEvento = async (req, res = response) => {
  const { title, notes, start, end } = req.body;
  const { uid } = req;

  console.log({ title, notes, start, end, user: uid });

  try {
    const evento = new Evento({ title, notes, start, end, user: uid });

    const eventoSaved = await evento.save();

    res.status(201).json({ ok: true, evento: eventoSaved });
    // res.status(201).json({ ok: true, title, notes, start, end, id: new Date().getTime() });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: "Error en la creación del evento." });
  }
};

const actualizarEvento = async (req, res = response) => {
  const { id } = req.params;
  const { title, notes, start, end } = req.body;
  const { uid } = req;

  console.log({ id, title, notes, start, end, uid });

  try {
    const event = { id, title, notes, start, end, user: uid };
    let evento = await Evento.findById(id);

    //si no existe el evento
    if (!evento) {
      return res.status(404).json({ ok: false, msg: "Evento no existe con el id." });
    }

    //si el usuario que lo creo es distinto al que lo quiere actualizar
    if (evento.user.toString() !== uid) {
      return res.status(401).json({ ok: false, msg: "El usuario no puede actualizar el evento" });
    }

    //actualizar el evento ({new: true} es parra que regrese la info actualizada)
    evento = await Evento.findByIdAndUpdate(id, event, { new: true });

    res.status(200).json({ ok: true, evento });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: "Error en la actualización del evento." });
  }
};

const eliminarEvento = async (req, res = response) => {
  const { id } = req.params;
  const { uid } = req;

  console.log(`Eliminando evento ${id}, uid: ${uid}`);

  try {
    let evento = await Evento.findById(id);

    //si no existe el evento
    if (!evento) {
      return res.status(404).json({ ok: false, msg: "Evento no existe con el id." });
    }

    //si el usuario que lo creo es distinto al que lo quiere actualizar
    if (evento.user.toString() !== uid) {
      return res.status(401).json({ ok: false, msg: "El usuario no puede eliminar el evento" });
    }

    //eliminar el evento
    await Evento.findByIdAndDelete(id);

    res.status(204).json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: "Error en la eliminación del evento." });
  }
};

module.exports = { getEventos, crearEvento, actualizarEvento, eliminarEvento };
