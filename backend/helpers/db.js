/* eslint-disable no-console */
const mongoose = require('mongoose');

const url = process.env.MONGO_URI;
let dbClient = null;

exports.init = () => {
	mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true }).then((mongo) => {
		const database = mongo.connection.db;
		if (database && database.collection) {
			database.collection('threads').createIndex({ title: 'text', description: 'text' }).then().catch((err) => console.log(err));
		}
	});

	dbClient = mongoose.connection;

	dbClient.once('open', () => console.log('connected to the database'));
	dbClient.on('error', (err) => console.log(err));
};

exports.getDB = () => dbClient;
