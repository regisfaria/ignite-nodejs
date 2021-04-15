import { hash } from 'bcryptjs';
import { v4 as uuid } from 'uuid';

import createConnection from '../index';

async function create() {
  const connection = await createConnection('localhost');

  const id = uuid();
  const password = await hash('admin', 8);

  await connection.query(
    `INSERT INTO users(id, name, email, password, driver_license, admin, created_at)
     VALUES('${id}', 'admin', 'admin@rentx.com.br', '${password}', 'XXXXXXXXXX', true, 'now()')`,
  );

  await connection.close();
}

create().then(() => console.log('Admin user created!'));
