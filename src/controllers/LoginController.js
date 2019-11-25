const Yup = require('yup');
const User = require('../models/User');
const authConfig = require('../config/auth');
const jwt = require('jsonwebtoken');


module.exports = {

  async store(req, res) {
    const schema = Yup.object().shape({

      email: Yup.string()
        .email()
        .required(),
      senha: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ mensagem: 'Dados Inválidos' });
    }

   const user =  await User.findOne({ email: req.body.email });

   const { id, nome, email } = user;

    return res.json({
      user: {
        id,
        nome,
        email
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });

  }
 
};