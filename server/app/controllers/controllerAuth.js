const bcrypt = require('bcryptjs');//Pro password
const jwt = require('jsonwebtoken');//forma segura de representar as revindicacoes ( como objetos json) entre as partes
const dotenv = require('dotenv');
dotenv.config();
const User = require('../models/user'); 

/**
 * Gera e retorna token com um tempo de duracao
 * @param {Object} params deve conter o id do usuario no qual recebera o token
 */
function generateToken(params = {}){
    return jwt.sign(params, process.env.DEFINE_SECRET, {
        //informo quanto tempo vai levar para ele expirar
        expiresIn: 86400, //Em 1 dia contado em segundos
    });
}

//Funcao para cadastro
const signUp = async(req, res) =>{
    try{//Verifico se existe algum usuario com o email(unico) cadastrado
        const {email} = req.body;
        if(await User.findOne({email})){
            return res.status(400).send({error: {msg:'Usuario já cadastrado'}});
        }      
        
        //criando novo usuario
        const user = await User.create(req.body);

        //Escondendo alguns dados pra nao ser exibido
        user.password = undefined;
        return res.send({
            user,
            token:generateToken({id: user.id}),
        });//Apos criar o usuario eh disponibilizado os dados
    }catch (err){//Caso ocorra erro na criacao do usuario
        return res.status(500).send({error: {msg:'Falha no cadastro'}});
    }
};

//Funcao para login
const signIn = async(req, res) =>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email}).select('+password');//busca usuario com senha no banco
        if (!user){//Verifica se o usuario foi encontrado
            return res.status(400).send({error: {msg:'Email não encontrado'}});
        }

        if(! await bcrypt.compare(password, user.password)){//Compara senha
            return res.status(400).send({error: {msg: 'Senha invalida'}});
        }

        user.password = undefined;//Retirado a exibicao do password
        res.send({
            user, 
            token:generateToken({id: user.id}),
        });
    }catch(error){
        return res.status(500).send({error: {msg:'Falha no login'}});
    };
};

module.exports = {
    signIn,
    signUp
};