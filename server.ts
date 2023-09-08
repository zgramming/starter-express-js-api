import cors from 'cors';
import dotEnv from 'dotenv';
import errorHandler from 'errorhandler';
import express from 'express';
import responseTime from 'response-time';

import router from './src/router/router';
import path from 'path';

dotEnv.config();

const app = express();
const port = process.env.PORT;

if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorHandler({ log: true }));
}

app.use(responseTime());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/', router);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
