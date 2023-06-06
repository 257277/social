const express = require("express");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
require("dotenv").config();
const { UserModel } = require("../models/userModel");
const { hashing } = require("../middleware/bcrypt");
const { authen } = require("../middleware/auten")
const userRoute = express.Router();

userRoute.post("/api/login", async (req, res) => {
    let { email, password } = req.body;
    try {
        const user = await UserModel.find({ "email": email });
        if (email.length == 0) {
            res.status(400).send("Please register first");
        }
        else {
            bcrypt.compare(password, user[0].password, function (err, result) {
                if (err) {
                    res.status(400).send("Wrong credentials");
                }
                else {
                    let token = jwt.sign({ userId: user[0]._id }, process.env.privateKey);
                    res.status(201).send({ "msg": "Login successfull", "token": token })
                }
            });
        }

    }
    catch (err) {
        res.status(400).send(err);
    }
})

userRoute.get("/api/users", async (req, res) => {
    try {
        let data = await UserModel.find();
        res.status(200).send(data);
    }
    catch (err) {
        res.status(400).send(err);
    }
})

userRoute.get("/api/users/:id/friends", async (req, res) => {
    let id = req.params.id;

    try {
        let data = await UserModel.find({ "_id": id });
        let friends = data[0].friends;
        res.status(200).send(friends);
    }
    catch (err) {
        res.status(400).send(err);
    }
})

userRoute.post("/api/users/:id/friends", authen, async (req, res) => {
    let friendid = req.params.id;
    let userid = req.headers.loggedUserId;
    try {
        let user = await UserModel.find({ "_id": userid });
        user[0].friendRequests.push(friendid);
        let updateduser = await UserModel.findByIdAndUpdate({ "_id": userid }, user[0]);
        res.status(201).send("Friend request send successfully");

    }
    catch (err) {
        res.status(400).send(err);
    }
})

userRoute.patch("/api/users/:id/friends/:friendId", authen, async (req, res) => {
    let userid = req.params.id;
    let friendId = req.params.friendId;
    let { status } = req.body;

    try {
        let user = await UserModel.find({ "_id": userid });

        for (let i = 0; i < user[0].friendRequests.length; i++) {
            if (user[0].friendRequests[i] == friendId) {
                user[0].friendRequests.splice(i, 1);

            }
        }
        if (status == "approve") {
            user[0].friends.push(friendId);
            let updateduser = await UserModel.findByIdAndUpdate({ "_id": userid }, user[0]);
            res.status(204).send("Friend request accepted");
        }
        else {
            let updateduser = await UserModel.findByIdAndUpdate({ "_id": userid }, user[0]);
            res.status(204).send("Friend request rejected");
        }
    }
    catch (err) {
        res.status(400).send(err);
    }
})





userRoute.use(hashing);
userRoute.post("/api/register", async (req, res) => {



    try {
        let user = await UserModel.find({ "email": req.body.email });

        if (user.length == 0) {
            await UserModel.insertMany(req.body);
            res.status(201).send("Successfully registered!");
        }
        else {
            res.status(200).send("Already registered!");
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
})










module.exports = {
    userRoute
}