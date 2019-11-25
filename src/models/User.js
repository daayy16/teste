const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  senha: {
    type: String,
    select: false
  },
  senhaHash: {
    type: String
  },
  telefones: [{
    ddd: {
      type: String,
      required: true
    },
    numero: {
      type: String,
      required: true
    }
  }],
  dataCriacao: {
    type: Date,
    default: Date.now
  },
  dataAlteracao: {
    type: Date,
    default: Date.now
  },
  dataUltimoLogin: {
    type: Date,
    default: null
  }

});

UserSchema.pre('save', async function() {
  if (this.isNew) {
    this.senhaHash = await bcrypt.hash(this.senha, 8);
    this.senha = undefined;
  }
});


module.exports = mongoose.model('User', UserSchema);