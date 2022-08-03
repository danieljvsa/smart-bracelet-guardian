// Update with your config settings.
require('dotenv').config()
module.exports = {

  /*development: {
    client: 'sqlite3',
    connection: {
      filename: './src/database/braceguard.sqlite3'
    },

    migrations: {
      tabelName: 'knex_migrations',
      directory: `${__dirname}/src/database/migrations`
    },
    useNullAsDefault: true,
    seeds: {
      directory: `${__dirname}/src/database/seeds`
    }*/
    development: {
      client: 'mysql',
      connection: {
        host : process.env.DB_HOST,
        port : process.env.DB_PORT,
        user : process.env.DB_USER,
        password : process.env.DB_PASSWORD,
        database : process.env.DB_DATABASE,
        //ssl: { rejectUnauthorized: true }
      },
      migrations: {
        tabelName: 'knex_migrations',
        directory: `${__dirname}/src/database/migrations`
      },
      useNullAsDefault: true,
      seeds: {
        directory: `${__dirname}/src/database/seeds`
      }
    
    },

  

};
