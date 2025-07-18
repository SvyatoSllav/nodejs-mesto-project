import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { RequestWithUser } from './types/index';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';

const { PORT: APP_PORT = 3000 } = process.env;
const application = express();

application.use((req: Request, res: Response, next: NextFunction) => {
  (req as RequestWithUser).user = {
    _id: 'some_random_id',
  };
  next();
});

application.use(express.json());
application.use('/', usersRouter);
application.use('/', cardsRouter);

mongoose.connect('mongodb://localhost:27017/mestodb');

application.listen(Number(APP_PORT));