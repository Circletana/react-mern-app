/* eslint-disable no-console */
const path = require('path');
require('dotenv').config({ path: '../.env' });
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const fileUpload = require('express-fileupload');
const router = require('./routes/api');
const redisHelper = require('./helpers/redis');

const url = process.env.MONGO_URI;

mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true }).then((mongo) => {
	const database = mongo.connection.db;
	if (database && database.collection) {
		database.collection('threads').createIndex({ title: 'text', description: 'text' }).then().catch((err) => console.log(err));
	}
});

const db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));
db.on('error', console.log);

redisHelper.init();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload({
	limits: {
		fileSize: 1 * 1024 * 1024,
	},
	safeFileNames: true,
	preserveExtension: true,
}));

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
app.use('/api', router);
app.listen(process.env.API_PORT, () => console.log(`LISTENING ON PORT ${process.env.API_PORT}`));

process.on('uncaughtException', console.log);
process.on('unhandledRejection', console.log);

module.exports = app;
