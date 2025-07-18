import { Request, Response } from 'express';
import { RequestWithUser } from '../types/index';
import Card from '../models/card';

// Получение всех карточек
export const getAllCards = async (req: Request, res: Response) => {
  try {
    const allCards = await Card.find({});
    res.status(200).send(allCards);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Создание карточки
export const addCard = async (req: Request, res: Response) => {
  try {
    const { name, link } = req.body;
    const newCard = await Card.create({ name, link, owner: (req as RequestWithUser).user._id });
    res.status(201).send(newCard);
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
    }
    res.status(500).send({ message: 'Ошибка сервера' });
  }
};

// Удаление карточки
export const removeCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    const deletedCard = await Card.findByIdAndDelete(cardId);
    if (!deletedCard) {
      return res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
    }
    res.status(200).send({ message: 'Карточка удалена' });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'CastError') {
      return res.status(400).send({ message: 'Передан некорректный _id карточки' });
    }
    res.status(500).send({ message: 'Ошибка сервера' });
  }
};

// Поставить лайк на карточку
export const likeCard = async (req: Request, res: Response) => {
  try {
    const likedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: (req as RequestWithUser).user._id } },
      { new: true }
    );
    if (!likedCard) {
      return res.status(404).send({ message: 'Передан несуществующий _id карточки' });
    }
    res.status(200).send(likedCard);
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'CastError') {
      return res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка или некорректный _id карточки' });
    }
    res.status(500).send({ message: 'Ошибка сервера' });
  }
};

// Убрать лайк с карточки
export const unlikeCard = async (req: Request, res: Response) => {
  try {
    const unlikedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: (req as RequestWithUser).user._id } },
      { new: true }
    );
    if (!unlikedCard) {
      return res.status(404).send({ message: 'Передан несуществующий _id карточки' });
    }
    res.status(200).send(unlikedCard);
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'CastError') {
      return res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка или некорректный _id карточки' });
    }
    res.status(500).send({ message: 'Ошибка сервера' });
  }
};