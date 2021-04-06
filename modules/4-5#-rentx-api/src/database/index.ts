import { createConnection, getConnectionOptions } from 'typeorm';

interface IOptions {
  host: string;
}

getConnectionOptions().then(options => {
  const newOptions = options as IOptions;
  // Below must be EXACTLY as the Database container
  newOptions.host = 'postgres_ignite';
  createConnection({
    ...options,
  });
});
