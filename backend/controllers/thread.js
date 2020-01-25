const _ = require('lodash');
const Thread = require('../models/thread');

exports.getAllThreads = (req, res) => {
	let filter = {};
	if (req.query.search && req.query.search !== '') {
		filter = { $text: { $search: req.query.search } };
	}
	Thread.find(filter).populate('user').exec((err, threads) => {
		if (err) {
			// eslint-disable-next-line no-console
			console.log(err);
			return res.json({ status: 'error', message: 'Error loading threads' });
		}
		return res.json({ status: 'success', message: 'Loading threads...', data: threads });
	});
};

exports.createNewThread = (req, res) => {
	const data = req.body;
	if (!data || !data.title || !data.description || !data.tags) {
		return res.status(400).json({ status: 'error', message: 'Invalid parameters' });
	}

	const thread = new Thread({
		title: data.title,
		description: data.description,
		tags: _.split(data.tags, ','),
		// eslint-disable-next-line no-underscore-dangle
		user: req.user._id,
	});

	thread.save((err) => {
		if (err) {
			// eslint-disable-next-line no-console
			console.log(err);
			return res.status(400).json({ status: 'error', message: err.message });
		}
		return res.status(200).json({ status: 'success', message: 'Thread created', data: thread });
	});
};
