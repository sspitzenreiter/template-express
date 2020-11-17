//Lib
const express = require('express');
const router = express.Router();
const Model = require('./../model/kegiatanModel');
const model = new Model();
// const routerTest = require('./test/test');
//Middlewares list

function filter_data(allowed, data){    
    return Object.keys(data)
    .filter(key => allowed.includes(key))
    .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
    },{});
}

router.get('/', (req, res, next)=>{
    var filtered = filter_data(['id_kegiatan'], req.query)
    model.getAllData(filtered).then(x=>{
        if(x.length>0){
            res.status(200).send({
                data:x
            })
        }else{
            res.status(204).send({
                message:"Kosong"
            })
        }
    }).catch(err=>{
        var details = {
            parent:err.parent,
            name:err.name,
            message:err.message
        }
        var error = new Error("Error pada server");
        error.status = 500;
        error.data = {
            date:new Date(),
            route:req.originalUrl,
            details:details
        };
        next(error);
    })
});

router.get('/koordinator/:id', (req, res, next)=>{
    model.getData({id_koordinator:req.params.id, soft_delete:0}).then(x=>{
        if(x!=null){
            res.status(200).send({
                data:x
            })
        }else{
            res.status(204).send({
                message:"Kosong"
            })
        }
    }).catch(err=>{
        var details = {
            parent:err.parent,
            name:err.name,
            message:err.message
        }
        var error = new Error("Error pada server");
        error.status = 500;
        error.data = {
            date:new Date(),
            route:req.originalUrl,
            details:details
        };
        next(error);
    })
});

//exports
module.exports = router;