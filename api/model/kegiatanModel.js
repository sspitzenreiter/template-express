const {Op,Model, DataTypes} = require('sequelize');
const Kegiatan = require('./models')['kegiatan'];
//Lib
class MyModel{
    getData=(data={}, attr=Kegiatan.rawAttributes)=>{
        return Kegiatan.findOne({
            where:data,
            attributes:attr
        })
    }

    getAllData=(data={}, attr=Kegiatan.rawAttributes)=>{
        return Kegiatan.findAll({
            where:data,
            attributes:attr
        })
    }

    postData=(data)=>{
        return Kegiatan.create(data,{
            fields:Object.keys(data)
        })
    }

    patchData=(data, where)=>{
        return Kegiatan.update(data,{
            where:where
        })
    }
}
module.exports = MyModel;
