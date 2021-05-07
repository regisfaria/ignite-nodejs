import { createConnection, getConnectionOptions, Connection } from 'typeorm';

// 'host' default value must be EXACTLY as the Database container
export default async (host = 'postgres_ignite'): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, {
      host: process.env.NODE_ENV ? 'localhost' : host,
      database:
        process.env.NODE_ENV === 'test'
          ? 'rentx_tests'
          : defaultOptions.database,
    }),
  );
};
