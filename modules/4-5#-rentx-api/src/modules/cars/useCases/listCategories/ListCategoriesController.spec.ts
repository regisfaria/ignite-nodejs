import { hash } from 'bcryptjs';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;
describe('ListCategoriesController', () => {
  beforeAll(async () => {
    connection = await createConnection('localhost');
    await connection.runMigrations();

    const id = uuid();
    const password = await hash('admin', 8);

    await connection.query(
      `INSERT INTO users(id, name, email, password, driver_license, admin, created_at)
       VALUES('${id}', 'admin', 'admin@rentx.com.br', '${password}', 'XXXXXXXXXX', true, 'now()')`,
    );

    const authResponse = await request(app)
      .post('/sessions')
      .send({ email: 'admin@rentx.com.br', password: 'admin' });

    const { token } = authResponse.body;

    await request(app)
      .post('/categories')
      .send({
        name: 'Sportive',
        description: 'Great cars',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    await request(app)
      .post('/categories')
      .send({
        name: 'Offroad',
        description: 'Perfect for barren terrains',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    await request(app)
      .post('/categories')
      .send({
        name: 'Economic',
        description: 'Daily use and economic cars',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to list all categories', async () => {
    const response = await request(app).get('/categories').send();

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(3);
    expect(response.body[0]).toHaveProperty('id');
  });
});
