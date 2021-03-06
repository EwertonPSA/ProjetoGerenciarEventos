const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next){
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).send({error: {
            type: 'ErrorMiddlware',
            msg:'Token não informado'
        }});
    }
    const parts = authHeader.split(' ');
    if(!(parts.length === 2)){
        return res.status(401).send({error: {
            type: 'ErrorMiddlware',
            msg:'Erro no token'
        }});
    }
    //Usando desestruturacao para acessar as partes
    const [scheme, token] = parts;
    //Verificando se no scheme ta o escrito no inicio o Bearer (ignorando o que tem a frente depois)
    if(!/^Bearer$/i.test(scheme)){
        return res.status(401).send({error: {
            type: 'ErrorMiddlware',
            msg:'Token malformatted'
        }});
    }

    jwt.verify(token, process.env.DEFINE_SECRET, (err, decoded) => {
        if(err) return res.status(401).send({error: {
            type: 'ErrorMiddlware',
            msg:'Sessão expirada, entre na sua conta novamente'
        }});

        req.userId = decoded.id;
        return next();
    });
}

module.exports = authMiddleware