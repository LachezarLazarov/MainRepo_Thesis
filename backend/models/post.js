const db = require('../util/database');

module.exports = class Post{
    constructor(text, user_id, location) 
    {
        this.text = text;
        this.user_id = user_id;
        this.location = location
    }

    static find_by_user(user_id) {
        return db.execute(
            'select * from posts WHERE user_id = ?', [user_id]
        );
    }

    static save(post) {
        return db.execute(
            'Insert into posts (text, user_id, location) Values (?, ?, ?)', 
            [post.text, post.user_id, post.location]
        );
    }
};
