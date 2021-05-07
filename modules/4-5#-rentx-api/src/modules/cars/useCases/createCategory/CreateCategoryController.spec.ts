import { hash } from 'bcryptjs';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;
describe('CreateCategoryController', () => {
  beforeAll(async () => {
    connection = await createConnection('localhost');
    await connection.runMigrations();

    const id = uuid();
    const password = await hash('admin', 8);

    await connection.query(
      `INSERT INTO users(id, name, email, password, driver_license, admin, created_at)
       VALUES('${id}', 'admin', 'admin@rentx.com.br', '${password}', 'XXXXXXXXXX', true, 'now()')`,
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to create a new category', async () => {
    const authResponse = await request(app)
      .post('/sessions')
      .send({ email: 'admin@rentx.com.br', password: 'admin' });

    const { token } = authResponse.body;

    const response = await request(app)
      .post('/categories')
      .send({
        name: 'Sportive',
        description: 'Great cars',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
  });

  it('should not be able to create a new category if one with the same name already exists', async () => {
    const authResponse = await request(app)
      .post('/sessions')
      .send({ email: 'admin@rentx.com.br', password: 'admin' });

    const { token } = authResponse.body;

    const response = await request(app)
      .post('/categories')
      .send({
        name: 'Sportive',
        description: 'Great cars',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
  });
});
