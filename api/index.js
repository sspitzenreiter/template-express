//Lib
const express = require('express');
const router = express.Router();
const kegiatanRouter = require('./routes/kegiatan');
const progressRouter = require('./routes/progress');

router.use('/panduan', (req, res, next)=>{
    next()
}, kegiatanRouter);

router.use('/progress', (req, res, next)=>{
    next()
}, progressRouter);

router.use('/', (req, res, next)=>{
    next()
}, kegiatanRouter);

//exportsz
module.exports = router;