module.exports = (sequelize, Sequelize) => {
  const Post = sequelize.define("posts", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: Sequelize.STRING
    },
    content: {
      type: Sequelize.STRING
    },
    location: {
      type: Sequelize.GEOMETRY('POINT')
    },
    images: {
      type: Sequelize.STRING
    },
  });

  return Post;
};