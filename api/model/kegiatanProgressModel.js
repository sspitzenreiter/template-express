const {Op,Model, DataTypes} = require('sequelize');
const Models = require('./models')['kegiatan_progress'];
//Lib
class MyModels{
    getData=(data={}, attr=Models.rawAttributes)=>{
        return Models.findOne({
            where:data,
            attributes:attr
        })
    }

    getAllData=(data={}, attr=Models.rawAttributes)=>{
        return Models.findAll({
            where:data,
            attributes:attr
        })
    }

    postData=(data)=>{
        return Models.create(data,{
            fields:Object.keys(data)
        })
    }

    patchData=(data, where)=>{
        return Models.update(data,{
            where:where
        })
    }
}
module.exports = MyModels;
