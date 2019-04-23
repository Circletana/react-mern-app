"use strict";
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Config = require('./config');
const cors = require('cors');

const app = express();
const router = require('./routes/api');
const path = require('path');

const url = Config.MONGO_URI;

mongoose.connect(url, { useNewUrlParser: true }).then(mongo=>{
    let database = mongo.connection.db;
    database.collection('threads').createIndex({title: "text", description: "text"}).then().catch(err=>console.log(err));
});

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));
db.on("error", err => console.log("MongoDB connection error:", err));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

app.use(express.static(path.join(__dirname, "..", "client", "build" )));

// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(Config.API_PORT, () => console.log(`LISTENING ON PORT ${Config.API_PORT}`));