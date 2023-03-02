module.exports = (sequelize, Sequelize) => {
  const Comment = sequelize.define("comments", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    comment: {
      type: Sequelize.STRING,
      notEmpty: true
    },
  });

  return Comment;
};