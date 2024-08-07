import express from 'express';
import logger from './logger';
import setupSwagger from './utils/swagger';
import authRoute from './routes/AuthRoutes';
import * as bodyParser from 'body-parser';

const app = express();

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

// Setup Swagger
setupSwagger(app);

// Authentication routes
app.use('/api/v1/auth', authRoute);

// Define a simple route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});
