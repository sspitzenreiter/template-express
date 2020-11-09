var SequelizeAuto = require('sequelize-auto');
var target = ['HOST','DIALECT','USER','PASS','DATABASE','PORT'];
var config = {};
target.map(x=>{
  config[x]=(typeof process.env[x]!=='undefined'?process.env[x]:null)
});
var auto = new SequelizeAuto(config.DATABASE || "simpro_user", config.USER || "simpro_user", config.PASS, {
    host: config.HOST || "localhost",
    dialect: config.DIALECT || "mysql",
    port: config.PORT || "3306",
    additional: {
        timestamps: false
    }
});
auto.run(function (err) {
  if (err) throw err;

  console.log(auto.tables); // table list
  console.log(auto.foreignKeys); // foreign key list
});

