const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const authConfig = require('./config/auth');

const routes = express.Router();

const UserController = require('./controllers/UserController');
const LoginController = require('./controllers/LoginController');

async function authCheck (req, res, next) {
  const authHeader = req.headers.authorization;
  const [, token] = authHeader.split(' ');

  if (!token) {
    return res.status(401).json({ erro: 'Não Autorizado' });
  }  

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ erro: 'Não Autorizado' });
  }
}

async function checkPassword(req, res, next) {
    const user = await User.findOne({ email: req.body.email });
    const senhaCorreta = await bcrypt.compare(req.body.senha, user.senhaHash);
  if(!senhaCorreta) {
      return res.status(400).json({ error : "Senha Invalida"});
  }
  return next();
}


//criando primeira rota
routes.get('/usuarios', authCheck, UserController.index);
routes.post('/usuarios', UserController.store);
routes.post('/login', checkPassword, LoginController.store);

module.exports = routes;