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
});

afterAll(() => {
	application.close();
});
