const mongoose = require("mongoose");
const options = {
  autoIndex: true, //this is the code I added that solved it all
}

module.exports = function(app) {  
  mongoose.connect(process.env.MONGO_DB_URL + process.env.MONGO_DB_NAME, options)
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(err => {
    console.error(err);
    console.log("Connection failed!");
  });

  mongoose.connection
  .on('open', res => {
    console.log(process.env.MONGO_DB_NAME + ' connection has been made...');
  })
  .on('error', err => {
    console.log(err);
  });

  mongoose.Promise = global.Promise;
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
  process.on("SIGHUP", cleanup);

  if(app) {
    app.set("mongoose", mongoose);
  }
}

function cleanup() {
    mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
}