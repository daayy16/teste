const mongoose = require('mongoose');
const Yup = require('yup');

const User = mongoose.model('User');

module.exports = {
  async index(req, res) {
    const usuarios = await User.find();
    return res.json(usuarios);
  },

  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      senha: Yup.string()
        .required()
        .min(6),
      telefones: Yup.object().shape({
        ddd: Yup.string().min(2).max(2), numero: Yup.string().min(8).max(9),
      })
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ mensagem: 'Dados Inválidos' });
    }

    const userExists = await User.findOne({ email: req.body.email });

    if (userExists) {
      return res.status(400).json({ mensagem: 'Usuário já cadastrado.' });
    }
    
    const usuarios = await User.create(req.body);
    return res.json(usuarios);
    
  }
 
};