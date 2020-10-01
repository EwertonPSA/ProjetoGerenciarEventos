const mongoose = require('../../db');
const bcrypt = require('bcryptjs');
const UserSchema = new mongoose.Schema({
	name:{
		type: String,
		required: true,//obrigatorio
    },
    email:{
        type: String,
        unique: true,
        required: true,
        lowercase: true,//vai ser convertido nesse formato
    },
    password:{
        type: String,
        required: true,
        select: false,//Deixar a senha nao acessivel por padrao
    },
});

//Encriptando a senha antes de salvar os dados no banco
UserSchema.pre('save', async function(next){
    //10 no parametro significa o numero de rounds pra ter uma hash mais forte
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next();
})

 const User = mongoose.model('User', UserSchema);
 module.exports = User;