process.env.NODE_ENV = 'test';
process.env.MONGO_URI = 'mongodb://localhost:27017/test';
process.env.API_PORT = 3004;
process.env.JWT_TOKEN_SECRET = 'secret';

const request = require('supertest');
const User = require('../models/user');
const Thread = require('../models/thread');

const app = require('../server');

beforeAll(async () => {
	await User.deleteMany({});
	await Thread.deleteMany({});
});

describe('Tests non authenticated routes', () => {
	test('should return status code 400', async () => {
		const res = await request(app)
			.post('/api/signup')
			.send({ name: 'dummy' });

		expect(res.statusCode).toEqual(400);
		expect(res.body).toHaveProperty('status', 'error');
		expect(res.body).toHaveProperty('message', 'Invalid parameters');
	});

	test('should create a new user', async () => {
		const res = await request(app)
			.post('/api/signup')
			.send({ email: 'dummy@gmail.com', password: '12345' });
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('status', 'success');
		expect(res.body).toHaveProperty('user');
	});

	test('should not create duplicate users', async () => {
		const res = await request(app)
			.post('/api/signup')
			.send({ email: 'dummy@gmail.com', password: '12345' });
		expect(res.statusCode).toEqual(400);
		expect(res.body).toHaveProperty('status', 'error');
		expect(res.body).toHaveProperty('message', 'An account already exists with the email.');
	});

	test('should be able to login with correct details', async () => {
		const res = await request(app)
			.post('/api/login')
			.send({ email: 'dummy@gmail.com', password: '12345' });

		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('status', 'success');
		expect(res.body).toHaveProperty('data');
		expect(res.body).toHaveProperty('data.user');
		expect(res.body).toHaveProperty('data.token');
	});

	test('should give invalid email/password error', async () => {
		const res = await request(app)
			.post('/api/login')
			.send({ email: 'dummy', password: '11111' });

		expect(res.statusCode).toEqual(400);
		expect(res.body).toHaveProperty('status', 'error');
		expect(res.body).toHaveProperty('message', 'Invalid email/password');
	});

	test('should give a 404 error', async () => {
		const res = await request(app)
			.post('/api');
		expect(res.statusCode).toEqual(404);
		expect(res.body).toHaveProperty('status', 'error');
		expect(res.body).toHaveProperty('message', 'Invalid route');
	});
});

describe('Tests authenticated routes', () => {
	let token = null;
	beforeAll(async () => {
		const res = await request(app)
			.post('/api/login')
			.send({ email: 'dummy@gmail.com', password: '12345' });

		token = res.body.data.token;
	});

	test('should give authenticated user details', async () => {
		const res = await request(app)
			.post('/api/user')
			.set('Authorization', `auth ${token}`);

		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('status', 'success');
		expect(res.body).toHaveProperty('data.email');
	});

	test('should give token invalid error', async () => {
		const res = await request(app)
			.post('/api/user');

		expect(res.statusCode).toEqual(400);
		expect(res.body).toHaveProperty('message', 'TokenMissing');
	});

	test('should create new thread', async () => {
		const res = await request(app)
			.post('/api/newthread')
			.set('Authorization', `auth ${token}`)
			.send({ title: 'title', description: 'description', tags: 'tag' });

		console.log(res.body);
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('data');
	});

	test('should fetch all threads', async () => {
		const res = await request(app)
			.post('/api/loadthreads')
			.set('Authorization', `auth ${token}`);

		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('data');
		expect(res.body.data.length).toBeGreaterThan(0);
	});
});
