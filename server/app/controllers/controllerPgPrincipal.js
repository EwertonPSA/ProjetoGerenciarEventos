const path = require('path');

const principal = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'principal.html'));
};

module.exports = {
    principal
};