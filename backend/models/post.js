module.exports = (sequelize, Sequelize) => {
  const Post = sequelize.define("posts", {
    id: {
      type: Sequelize.INTEGER,
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
    image: {
      type: Sequelize.STRING
    },
  });

  return Post;
};