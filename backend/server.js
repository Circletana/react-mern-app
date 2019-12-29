/* eslint-disable no-console */
const path = require('path');
require('dotenv').config({ path: '../.env' });
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const fileUpload = require('express-fileupload');
const router = require('./routes/api');
const redisHelper = require('./helpers/redis');
const dbHelper = require('./helpers/db');

dbHelper.init();
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
