import { NextFunction, Request, Response, Router } from 'express';
import { User } from '../database/models/User';
export const usersRouter = Router();

usersRouter.get('/users', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.all();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

usersRouter.post('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) { 
    next(err); 
  }
});

usersRouter.get('/users/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.with('posts').find(req.params.id);
    if (!user) { 
      res.status(404).json({ error: 'User not found' }); 
      return; 
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
});

usersRouter.put('/users/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.find(req.params.id);
    if (!user) { 
      res.status(404).json({ error: 'User not found' }); 
      return; 
    }
    await user.update(req.body);
    res.json(user);
  } catch (err) { 
    next(err); 
  }
});

usersRouter.delete('/users/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.find(req.params.id);
    if (!user) { 
      res.status(404).json({ error: 'User not found' });
      return; 
    }
    await user.delete();
    res.status(204).send();
  } catch (err) { 
    next(err); 
  }
});