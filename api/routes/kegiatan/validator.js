const {query, body, validationResult, header, oneOf} = require('express-validator');
exports.validate = (method) =>{
    switch(method){        
        case 'get':{
            return [
                query('id_kegiatan').optional().isString().withMessage("harus berformat teks")
            ]
        }

        case 'post':{
            return [
                body('nama_kegiatan').exists().withMessage("Nama Kegiatan harus didefinisikan").notEmpty().withMessage("Nama kegiatan harus diisi").isString().withMessage("Nama kegiatan harus berformat teks"),
                body('jenis_kegiatan').exists().withMessage("Jenis Kegiatan harus didefinisikan").notEmpty().withMessage("Nama kegiatan harus diisi").isNumeric().withMessage("Jenis kegiatan harus berformat numerik"),
                body('id_koordinator').exists().withMessage("Koordinator harus langsung dipilih").notEmpty().withMessage("ID Koordinator harus diisi").isString().withMessage("ID Koordinator harus berformat teks"),
                body('angkatan').exists().withMessage("Angkatan harus didefinisikan").notEmpty().withMessage("Angkatan harus diisi").isString().withMessage("Angkatan harus berformat teks"),
                body('tgl_mulai').exists().withMessage("Tanggal Mulai harus didefinisikan").notEmpty().withMessage("Tanggal Mulai harus diisi").isDate().withMessage("Tanggal Mulai harus berformat tanggal"),
                body('tgl_selesai').exists().withMessage("Tanggal Selesai harus didefinisikan").notEmpty().withMessage("Tanggal Selesai harus diisi").isDate().withMessage("Tanggal Selesai harus berformat tanggal")
            ]
        }

        case 'put':{
            return [
                body('status_mulai').optional().notEmpty().withMessage("harus diisi").isString().withMessage("harus berformat teks"),
                body('min_bimbingan').optional().notEmpty().withMessage("harus diisi").isNumeric().withMessage("harus berformat numerik"),
                body('persentase_sidang').optional().notEmpty().withMessage("harus diisi").isString().withMessage("harus berformat teks"),
                body('persentase_bimbingan').optional().notEmpty().withMessage("harus diisi").isNumeric().withMessage("harus berformat angka"),
                body('persentase_sidang_pembimbing').optional().notEmpty().withMessage("harus diisi").isNumeric().withMessage("harus berformat angka"),
                body('persentase_sidang_penguji').optional().notEmpty().withMessage("harus diisi").isNumeric().withMessage("harus berformat angka"),
                body('tgl_pengajuan_proposal_mulai').optional().notEmpty().withMessage("harus diisi").isDate().withMessage("harus berformat tanggal"),
                body('tgl_pengajuan_proposal_selesai').optional().notEmpty().withMessage("harus diisi").isDate().withMessage("harus berformat tanggal"),
                body('tgl_bimbingan_mulai').optional().notEmpty().withMessage("harus diisi").isDate().withMessage("harus berformat tanggal"),
                body('tgl_bimbingan_selesai').optional().notEmpty().withMessage("harus diisi").isDate().withMessage("harus berformat tanggal"),
                body('tgl_sidang_mulai').optional().notEmpty().withMessage("harus diisi").isDate().withMessage("harus berformat tanggal"),
                body('tgl_sidang_selesai').optional().notEmpty().withMessage("harus diisi").isDate().withMessage("harus berformat tanggal"),
                body('rule_filter_dosen').optional().notEmpty().withMessage("harus diisi").isNumeric().withMessage("harus berformat Angka"),
                body('rule_activate_proposal').optional().notEmpty().withMessage("harus diisi").isNumeric().withMessage("harus berformat angka"),
            ]
        }

        case 'patch':{
            return [
                body('nama_kegiatan').optional().notEmpty().withMessage("Nama kegiatan harus diisi").isString().withMessage("Nama kegiatan harus berformat teks"),
                body('jenis_kegiatan').optional().notEmpty().withMessage("Nama kegiatan harus diisi").isNumeric().withMessage("Jenis kegiatan harus berformat numerik"),
                body('id_koordinator').optional().notEmpty().withMessage("ID Koordinator harus diisi").isString().withMessage("ID Koordinator harus berformat teks"),
                body('tgl_mulai').optional().notEmpty().withMessage("Tanggal Mulai harus diisi").isDate().withMessage("Tanggal Mulai harus berformat tanggal"),
                body('tgl_selesai').optional().notEmpty().withMessage("Tanggal Selesai harus diisi").isDate().withMessage("Tanggal Selesai harus berformat tanggal")
            ]
        }
    }
}

exports.verify = (req, res, next) =>{
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.status(422).json({
                errors:errors.array()
            })
            return;
        }else{
            return next();
        }
    }catch(err){
      return next(err);
    }
}