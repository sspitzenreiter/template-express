const {query, body, validationResult, header, oneOf} = require('express-validator');
exports.validate = (method) =>{
    switch(method){        
        case 'get':{
            return [
                query('id_kegiatan').optional().isString().withMessage("harus berformat teks")
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