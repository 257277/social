const express = require("express");

const { authen } = require("../middleware/auten")
const { PostModel } = require("../models/postModel");

const postRoute = express.Router();

postRoute.get("/api/posts", async (req, res) => {
    try {
        let data = await PostModel.find();
        res.status(200).send(data);
    }
    catch (err) {
        res.status(400).send(err);
    }
})

postRoute.get("/api/posts/:id", async (req, res) => {
    let id = req.params.id;
    try {
        let data = await PostModel.find({ "_id": id });

        res.status(200).send(data);
    }
    catch (err) {
        res.status(400).send(err);
    }
})
postRoute.use(authen)

postRoute.post("/api/posts", async (req, res) => {
    let id = req.headers.loggedUserId;
    req.body = { user: id, text: req.body.text, image: req.body.image, createdAt: req.body.createdAt, likes: req.body.likes, comments: req.body.comments };

    try {
        let data = await PostModel.insertMany(req.body);
        res.send(201).send({ "msg": "Post created successfully", "data": data });
    }
    catch (err) {
        res.status(400).send(err);
    }
})

postRoute.patch("/api/posts/:id", async (req, res) => {
    let uid = req.headers.loggedUserId;
    let pid = req.params.id;
    let { image, text } = req.body;
    try {
        let data;
        if (image != null && text == null) {
            data = await PostModel.findByIdAndUpdate({ "_id": pid }, { "image": image })
        }
        else if (image == null && text != null) {
            data = await PostModel.findByIdAndUpdate({ "_id": pid }, { "text": text })
        }
        else {
            data = await PostModel.findByIdAndUpdate({ "_id": pid }, req.body);
        }
        res.status(204).send({ "msg": "post is updated successfully", "data": data });
    }
    catch (err) {
        res.status(400).send(err);
    }
})

postRoute.delete("/api/posts/:id", async (req, res) => {
    let id = req.params.id;
    try {
        await PostModel.findByIdAndDelete({ "_id": id });
        res.status(202).send("Post is deleted successfully");
    }
    catch (err) {
        res.status(400).send(err);
    }
})

postRoute.post("/api/posts/:id/like", async (req, res) => {
    let uid = req.headers.loggedUserId;
    let pid = req.params.id;
    try {
        let post = await PostModel.find({ "_id": pid });
        post[0].likes.push(uid);
        await PostModel.findByIdAndUpdate({ "_id": pid }, post[0]);
        res.status(201).send("Post liked successfully")
    }
    catch (err) {
        res.status(400).send(err);
    }
})

postRoute.post("/api/posts/:id/comment", async (req, res) => {
    let uid = req.headers.loggedUserId;
    let pid = req.params.id;
    req.body = { user: uid, text: req.body.text, createAt: req.body.createAt };
    try {
        let post = await PostModel.find({ "_id": pid });
        post[0].comments.push(req.body);
        await PostModel.findByIdAndUpdate({ "_id": pid }, post[0]);
        res.status(201).send("Comment created successfully");
    }
    catch (err) {
        res.status(400).send(err);
    }
})





module.exports = {
    postRoute
}