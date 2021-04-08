import 'reflect-metadata';
import express from 'express';
import 'express-async-errors';
import swaggerUi from 'swagger-ui-express';

import { errorHandler } from '@shared/errors/errorHandler';

import swaggerFile from '../../../swagger.json';
import { router } from './routes';

import '@shared/infra/typeorm';

import '@shared/container';

const app = express();

app.use(express.json());

app.use('/api_docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(router);

app.use(errorHandler);

app.listen(3333, () => {
  console.log('🚀 SERVER STARTED AT PORT 3333 🚀');
});
