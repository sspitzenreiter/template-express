module.exports = {
  apps : [{
    script: 'server.js',
    watch: '.',
    env:{
        CONFIG_FILE:'./config.json'
    }
  }],

  deploy : {
    development : {
      user : 'simpro.poltekpos',
      host : '5.181.217.137',
      ref  : 'origin/release/development',
      repo : 'git@gitlab.com:simpro-poltekpos/simpro-be.git',
      path : '/home/app/simpro-be-test',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'pm2 save'
    }
  }
};
