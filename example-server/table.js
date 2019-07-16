var express = require('express');
var path = require('path');

function Table(spacecraft) {
    var router = express.Router();

    router.get('', function (req, res) {
        res.send('Fermin');
        // res.sendFile(path.join(__dirname+'./table.html'));
    });

    return router;
}

module.exports = Table;

