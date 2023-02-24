module.exports = (sequelize, Sequelize) => {
  const Comment = sequelize.define("comments", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    commnent: {
      type: Sequelize.STRING
    },
  });

  return Comment;
};