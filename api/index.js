//Lib
const express = require('express');
const router = express.Router();
const kegiatanRouter = require('./routes/kegiatan/');
router.use('/', (req, res, next)=>{
    next();
}, kegiatanRouter);

//exports
module.exports = router;