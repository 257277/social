const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;
const userSchema = mongoose.Schema({
    "name": String,
    "email": String,
    "password": String,
    "dob": Date,
    "bio": String,
    "posts": [{ type: Types.ObjectId, ref: 'Post' }],
    "friends": [{ type: Types.ObjectId, ref: 'User' }],
    "friendRequests": [{ type: Types.ObjectId, ref: 'User' }]

})
const UserModel = mongoose.model("User", userSchema);

module.exports = {
    UserModel
}