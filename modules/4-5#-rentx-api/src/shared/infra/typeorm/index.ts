import { createConnection, getConnectionOptions, Connection } from 'typeorm';

// 'host' default value must be EXACTLY as the Database container
export default async (host = 'postgres_ignite'): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, {
      host,
    }),
  );
};
