module.exports = (sequelize, Sequelize) => {
  const Post = sequelize.define("posts", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    title: {
      type: Sequelize.STRING
    },
    content: {
      type: Sequelize.TEXT
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