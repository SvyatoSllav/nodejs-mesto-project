import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import errorHandler from './middlewares/errorHandler';
import { requestLogger, errorLogger } from './middlewares/logger';
import { validateSignIn, validateSignUp } from './middlewares/validators';
import AppError from './errors/appError';

const { PORT: APP_PORT = 3000 } = process.env;
const application = express();

application.use(express.json());

application.use(cookieParser());

application.use(requestLogger);

application.post('/signup', validateSignUp, createUser);
application.post('/signin', validateSignIn, login);

application.use(auth);

application.use('/', usersRouter);
application.use('/', cardsRouter);

application.use('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError('Not found', 404));
});

application.use(errorLogger);
application.use(errors());
application.use(errorHandler);

mongoose.connect('mongodb://localhost:27017/mestodb');

application.listen(Number(APP_PORT));
