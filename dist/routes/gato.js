"use strict";
// router for 'gato' created by express-routing-builder
const express = require('express');
const router = express.Router();
// define the get method route
router.get('/', function (req, res) {
    res.send('gato get method');
});
// define the delete method route
router.delete('/', function (req, res) {
    res.send('gato delete method');
});
// define the post method route
router.post('/', function (req, res) {
    res.send('gato post method');
});
module.exports = router;
//# sourceMappingURL=gato.js.map