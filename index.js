
global.base_dir = __dirname;
global.abs_path = function(path) {
  return base_dir + path;
}

global.include = function(file) {
  return require(abs_path('/' + file));
}

const config = include("config.json");

const NODE_ENVS = ["production", "development"]

const configData = config[NODE_ENVS.indexOf(process.env.NODE_ENV) >= 0 ? process.env.NODE_ENV : NODE_ENVS[0]];

const keys = include("secrets.json");

global.server_info = {
  config: configData,
  keys
}

const Account = require(__dirname + "/models/accountchar");
const User = require(__dirname + "/models/accounts/userchar");
const Resource = require(__dirname + "/models/resourcechar");
const School = require(__dirname + "/models/schoolchar");
const ApiKey = require(__dirname + "/models/apikeychar");


global.models = {
  account: Account,
  user: User,
  resource: Resource,
  school: School,
  apikey: ApiKey
}

const database = include("/database/database");

const app = include("/app/server");

database()
  .then(() => {
    app();
  })
  .catch((e) => {
    console.log(e); 
    console.log("server did not bind successfully");
  });

