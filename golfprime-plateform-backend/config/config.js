require('dotenv').config(); // Loads environment variables from .env file into process.env
                            // dotenv package reads the .env file and make the environment variable available in process.env
                            // so no database credentials are hrdcoded in the app

module.exports = { // makes the object available to be imported into other files in the app
  "development": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": "mysql", // specifies the type of database
    logging: console.log // Enable logging
  },
  "test": { // separate environment for running tests without affecting the dev or prod database
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
