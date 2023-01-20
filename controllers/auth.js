const { request, response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuarioModel");
const { generarJsonWebToken } = require("../helpers/jwt");

const crearUsuario = async (req = request, res = response) => {
  const { name, email, password } = req.body;
  try {
    //buscar usuario por email
    let usuario = await Usuario.findOne({ email });

    if (usuario) {
      console.log(`Usuario ya existe con email ${email}.`);
      return res.status(400).json({ ok: false, msg: `Usuario ya existe con email ${email}.` });
    }

    usuario = new Usuario(req.body);

    //encriptar contraseña
    const salt = bcrypt.genSaltSync();
    console.log("salt", salt);
    usuario.password = bcrypt.hashSync(password, salt);
    console.log(usuario.password);

    await usuario.save();

    //generar jwt
    const token = await generarJsonWebToken(usuario.id, usuario.name);

    res.status(201).json({ date: new Date(), ok: true, uid: usuario.id, name: usuario.name, token });
  } catch (error) {
    console.log(error);

    setTimeout(() => {
      return res.status(500).json({ ok: false, msg: "Error en la creación del usuario." });
    }, 3000);
    return;
  }
};

const loginUsuario = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    //buscar usuario por email
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      console.log(`Usuario ${email} no encontrado`);
      setTimeout(() => {
        return res.status(400).json({ ok: false, msg: `Usuario/contraseña no válidos.` });
      }, 3000);
      return;
    }

    //verificar contraseña
    const validPassword = bcrypt.compareSync(password, usuario.password);

    if (!validPassword) {
      console.log(`Contraseña no válida`);
      setTimeout(() => {
        return res.status(400).json({ ok: false, msg: `Usuario/contraseña no válidos.` });
      }, 3000);
      return;
    }

    //usuario valido

    //generar jwt
    const token = await generarJsonWebToken(usuario.id, usuario.name);

    res.json({ ok: true, uid: usuario.id, name: usuario.name, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: "Error en login del usuario." });
  }
};

const renovarToken = async (req = request, res = response) => {
  const { uid, name } = req;
  const token = await generarJsonWebToken(uid, name);
  res.send({ ok: true, uid, name, token });
};

module.exports = { crearUsuario, loginUsuario, renovarToken };
0;
