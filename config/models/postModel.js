const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;
const postSchema = mongoose.Schema({
    "user": { type: Types.ObjectId, ref: 'User' },
    "text": String,
    "image": String,
    "createdAt": Date,
    "likes": [{ type: Types.ObjectId, ref: 'User' }],
    "comments": [{
        "user": { type: Types.ObjectId, ref: 'User' },
        "text": String,
        "createdAt": Date
    }]

})
const PostModel = mongoose.model("Post", postSchema);

module.exports = {
    PostModel
}