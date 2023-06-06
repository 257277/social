const express = require("express");
const app = express();
require("dotenv").config();
const { connection } = require("./config/db");
const { userRoute } = require("./config/routes/userRoute");
const { postRoute } = require("./config/routes/postRoute");


app.use(express.json());
app.use("/user", userRoute);
app.use("/post", postRoute);






app.listen(process.env.PORT, async () => {
    try {
        await connection;
        console.log("Successfully connected to database");
    }
    catch (err) {
        console.log(err);
    }
    console.log(`Server is running on port ${process.env.PORT}`);
})