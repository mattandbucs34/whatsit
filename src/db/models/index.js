import 'dotenv/config';
import { readdirSync, readFileSync } from 'fs';
import { basename as _basename, join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import Sequelize from 'sequelize';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const basename = _basename(__filename);
const env = process.env.NODE_ENV || 'development';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const configPath = join(__dirname, '..', 'config', 'config.cjs');
const config = require(configPath)[env];
const db = {};

console.log('--- DB INIT ---');
console.log('ENV:', env);
console.log('CONFIG:', JSON.stringify(config, null, 2));
console.log('VAR_NAME:', config.use_env_variable);
console.log('VAR_VALUE_EXISTS:', !!process.env[config.use_env_variable]);
if (process.env[config.use_env_variable]) {
  console.log('VAR_VALUE_START:', process.env[config.use_env_variable].substring(0, 10));
}

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const files = readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  });

for (const file of files) {
  const modelModule = await import(pathToFileURL(join(__dirname, file)).href);
  const model = modelModule.default(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
