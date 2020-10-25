/**
 * Estabelece conexao com o banco e repassa suas configuracoes
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGODB_URI; //Definido as configuracoes do mongodb no .env
mongoose.connect(uri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true , 
    useFindAndModify: false ,//Para usar o mongoose.findOneAndUpdate()
}); 
mongoose.set('useCreateIndex', true); 
mongoose.Promise = global.Promise;

module.exports = mongoose;