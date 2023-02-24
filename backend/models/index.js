const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  process.env.USER,
  process.env.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.js")(sequelize, Sequelize);
db.post = require("../models/post.js")(sequelize, Sequelize);
db.like = require("../models/like.js")(sequelize, Sequelize);
db.comment = require("../models/comment.js")(sequelize, Sequelize);


db.user.hasMany(db.post);
db.post.belongsTo(db.user);
db.post.hasMany(db.like);
db.user.hasMany(db.like);
db.like.belongsTo(db.post);
db.like.belongsTo(db.user);
db.post.hasMany(db.comment);
db.user.hasMany(db.comment);
db.comment.belongsTo(db.post);
db.comment.belongsTo(db.user);


module.exports = db;
 