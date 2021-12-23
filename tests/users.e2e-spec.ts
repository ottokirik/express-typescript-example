import request from 'supertest';

import { App } from '../src/app';
import { boot } from '../src/main';

let application: App;

beforeAll(async () => {
	const { app } = await boot;

	application = app;
});

describe('Users e2e', () => {
	test('signup error', async () => {
		const res = await request(application.app)
			.post('/users/signup')
			.send({ email: 'test2@test.ru', password: 'testtest' });

		expect(res.statusCode).toEqual(422);
	});

	test('Login - success', async () => {
		const res = await request(application.app)
			.post('/users/signin')
			.send({ email: 'test2@test.ru', password: 'testtest' });

		expect(res.body.jwt).not.toBeUndefined();
	});

	test('Login - error', async () => {
		const res = await request(application.app)
			.post('/users/signin')
			.send({ email: 'test2@test.ru', password: 'testtext' });

		expect(res.statusCode).toBe(401);
	});

	test('Info - success', async () => {
		const login = await request(application.app)
			.post('/users/signin')
			.send({ email: 'test2@test.ru', password: 'testtest' });

		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer ${login.body.jwt}`);

		expect(res.body.email).toBe('test2@test.ru');
	});

	test('Info - error', async () => {
		const res = await request(application.app).get('/users/info').set('Authorization', `Bearer 1`);

		expect(res.statusCode).toBe(401);
	});
});

afterAll(() => {
	application.close();
});
