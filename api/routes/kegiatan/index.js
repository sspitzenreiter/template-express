//Lib
const express = require('express');
const router = express.Router();
const Model = require('./../../model/kegiatanModel');
const model = new Model();
const validator = require('./validator');
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
    var filtered = filter_data(['id_kegiatan','id_koordinator','soft_delete'], req.query)
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

// router.get('/koordinator/:id', (req, res, next)=>{
//     model.getData({id_koordinator:req.params.id, soft_delete:0}).then(x=>{
//         if(x!=null){
//             res.status(200).send({
//                 data:x
//             })
//         }else{
//             res.status(204).send({
//                 message:"Kosong"
//             })
//         }
//     }).catch(err=>{
//         var details = {
//             parent:err.parent,
//             name:err.name,
//             message:err.message
//         }
//         var error = new Error("Error pada server");
//         error.status = 500;
//         error.data = {
//             date:new Date(),
//             route:req.originalUrl,
//             details:details
//         };
//         next(error);
//     })
// });

router.get('/detail/:id', (req, res, next)=>{
    model.getData({id_kegiatan:req.params.id, soft_delete:0}).then(x=>{
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

router.post('/', validator.validate("post"), validator.verify,(req, res, next) => {
    var filtered = filter_data(['nama_kegiatan','jenis_kegiatan','id_koordinator','angkatan','tgl_mulai','tgl_selesai','semester'], req.body);
    var user_data = req.user_data;
    filtered['prodi']=user_data.prodi;
    filtered['status_mulai']="0";
    model.postDataKegiatan(filtered).then(x=>{
        console.log(x)
        res.status(201).send({
            message:"Sukses membuat kegiatan",
            data:x
        })
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

router.put('/',(req, res, next)=>{
    var user_data = req.body.user_payload;
    if(typeof user_data!=='undefined'){
        next();
    }else{
        res.status(401).send({
            message:"Bad Request"
        })
    }
},validator.validate("put"),validator.verify, (req, res, next) => {
    var filtered = filter_data(
        [
            'status_mulai',
            'min_bimbingan',
            'persentase_sidang',
            'persentase_bimbingan',
            'persentase_sidang_pembimbing',
            'persentase_sidang_penguji',
            'tgl_pengajuan_proposal_mulai',
            'tgl_pengajuan_proposal_selesai',
            'tgl_bimbingan_mulai',
            'tgl_bimbingan_selesai',
            'tgl_sidang_mulai',
            'tgl_sidang_selesai',
            'rule_filter_dosen',
            'rule_activate_proposal'
        ], req.body);
    if(Object.keys(filtered).length>0){
        model.patchDataKegiatan(filtered, {id_kegiatan:req.params.id_kegiatan}).then(x=>{ 
            resolve(x);
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
    }else{
        res.status(304).send({
            message:"Anda tidak mengirim apapun, data tidak ada yang diubah"
        })
    }
});

router.patch('/:id_kegiatan',validator.validate("patch"),validator.verify, (req, res, next) => {
    var filtered = filter_data(['nama_kegiatan','jenis_kegiatan','id_koordinator','tgl_mulai','tgl_selesai','semester'], req.body);
    if(Object.keys(filtered).length>0){
        model.patchDataKegiatan(filtered, {id_kegiatan:req.params.id_kegiatan}).then(x=>{ 
            resolve(x);
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
    }else{
        res.status(304).send({
            message:"Anda tidak mengirim apapun, data tidak ada yang diubah"
        })
    }
});

//exports
module.exports = router;