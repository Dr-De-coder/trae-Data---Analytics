import express from 'express';
import cors from 'cors';
import queryRoutes from './routes/query.routes.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/query', queryRoutes);

app.use(errorMiddleware);

export default app;
