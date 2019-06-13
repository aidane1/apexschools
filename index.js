
global.base_dir = __dirname;
global.abs_path = function(path) {
  return base_dir + path;
}
global.include = function(file) {
  return require(abs_path('/' + file));
}

const NODE_ENVS = ["production", "development"]

const config = include("config.json");

const configData = config[NODE_ENVS.indexOf(process.env.NODE_ENV) >= 0 ? process.env.NODE_ENV : NODE_ENVS[0]];

const database = include("database");

const app = include("/app/server");

database(configData)
  .then(() => {
    app(configData);
  })
  .catch((e) => {
    console.log("server did not bind successfully");
  });

