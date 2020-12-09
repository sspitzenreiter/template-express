//Lib
const { default: Axios } = require('axios');
const express = require('express');
const router = express.Router();
const Model = require('./../../model/kegiatanModel');
const model = new Model();
const validator = require('./validator');
const axios = require('axios');
const dataServices = require('./../../../services/dataManipulation');
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

router.get('/', async (req, res, next)=>{
    var filtered = filter_data(['id_kegiatan_m','id_kegiatan','id_koordinator','npm_ketua','npm_anggota','status_proyek','soft_delete','prodi','angkatan'], req.query);
    var id_dosen = [];
    var data = [];
    if(typeof filtered['id_kegiatan_m']!=='undefined'){
        filtered['id_kegiatan']=filtered['id_kegiatan_m'];
        delete filtered['id_kegiatan_m'];
    }
    await model.getAllData(filtered).then(x=>{
        if(x.length>0){
            x = JSON.parse(JSON.stringify(x));
            id_dosen = x.map(y=>y.id_koordinator).filter(dataServices.onlyUniqueArray);
            data = x;
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
    });
    console.log(id_dosen);
    if(data.length>0){
        await axios.get('http://127.0.0.1:8080/master-user/dosen', {
            params:{
                nidn_m:id_dosen
            },
            headers:{
                "Bearer":config.token
            }
        }).then(x=>{
            var dosen_data = x.data;
            // console.log(dosen_data)
            var result = data.map(y=>{
                y['nama_dosen']=dosen_data.data.find(z=>z.nidn==y.id_koordinator).nama;
                return y;
            })
            res.status(200).send({
                data:result
            })
        }).catch(err=>{
            console.log(err.message)
            res.status(500).send({
                message:"Error pada server:REQUEST"
            })
        })
    }else{
        res.status(204).send({
            message:"Kosong"
        })
    }
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

router.get('/tahun-ajaran', (req, res, next)=>{
    axios.get(config.url.gateway+"/master-user/mahasiswa/tahun-ajaran",{
        params:{
            prodi:req.query.prodi
        },
        headers:{
            "Bearer":config.token
        }
    }).then(x=>{
        if(x.status==200){
            x = JSON.parse(JSON.stringify(x.data.data))
            res.send({
                data:x
            })
        }else{
            res.status(204).send("Kosong")
        }            
    }).catch(err=>{
        console.log(err);
        res.status(500).send({
            message:"Error pada server"
        })
    })
});

router.get('/koor-tersedia', (req, res, next)=>{
    var filtered = {};
    filtered['prodi'] = req.query.prodi;
    // res.send({data:"S"})
    var list_dosen = new Promise((resolve, reject)=>{
        axios.get(config.url.gateway+"/master-user/dosen",{
            params:{
                prodi:filtered['prodi']
            },
            headers:{
                "Bearer":config.token
            }
        }).then(x=>{
            console.log(x.status)
            if(x.status==200){
                x = JSON.parse(JSON.stringify(x.data.data))
                resolve(x);
            }else{
                resolve([]);
            }            
        }).catch(err=>{
            reject(err);
        })
    });

    var list_koor = new Promise((resolve, reject)=>{
        model.getAllData({soft_delete:0, prodi:filtered['prodi']},['id_koordinator']).then(x=>{
            x = JSON.parse(JSON.stringify(x))
            resolve(x);
        }).catch(err=>{
            reject(err);
        });
    });

    Promise.all([list_dosen, list_koor]).then(x=>{
        var data = x[0].filter(y=>!x[1].map(z=>z.id_koordinator).includes(y.nidn));
        if(data.length>0){
            res.send({
                data:data.map(y=>{
                    Object.keys(y).map(z=>{
                        if(!['nidn','nama'].includes(z)){
                            delete y[z]
                        }
                    });
                    return y
                })
            })
        }else{
            res.status(204).send("Kosong")
        }
        
    }).catch(err=>{
        console.log(err);
        res.status(500).send({
            message:"Error pada server"
        })
    })
});

router.post('/', validator.validate("post"), validator.verify,async (req, res, next) => {
    var filtered = filter_data(['nama_kegiatan','id_koordinator','angkatan','tgl_mulai','tgl_selesai', 'prodi'], req.body);
    filtered['status_mulai']="0";
    filtered['jenis_kegiatan']="1";
    const axios = require('axios');
    await axios.get(config.url.gateway+"/master-info/config/tahun_ajaran", {
        headers:{
            bearer:config.token
        }
    }).then(x=>{
        var data = x.data;
        filtered['tahun_ajaran'] = data.data.konten;
        console.log(filtered)
    }).catch(err=>{
        res.status(500).send({
            message:"Error pada server"
        })
    });
    if(typeof filtered['tahun_ajaran']!=='undefined'){
        await model.postData(filtered).then(x=>{
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
    }else{
        res.status(500).send({
            message:"Error"
        })
    }
});

router.put('/:id_kegiatan',validator.validate("put"),validator.verify, (req, res, next) => {
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
        model.patchData(filtered, {id_kegiatan:req.params.id_kegiatan}).then(x=>{ 
            res.status(201).send({
                message:"Sukses ubah data"
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