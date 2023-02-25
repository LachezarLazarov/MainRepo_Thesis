module.exports = (sequelize, Sequelize) => {
  const Comment = sequelize.define("comments", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    commnent: {
      type: Sequelize.STRING
    },
  });

  return Comment;
};