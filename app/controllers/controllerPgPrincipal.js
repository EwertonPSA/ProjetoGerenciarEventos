const path = require('path');

const principal = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'principal.html'));
};

const buscar = (req, res) =>{
    return res.send({teste:"Joao1"});
}

module.exports = {
    principal,
    buscar
};