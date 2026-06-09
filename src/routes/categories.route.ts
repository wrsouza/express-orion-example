import { NextFunction, Request, Response, Router } from 'express';
import { Category } from '../database/models/Category';
export const categoriesRouter = Router();

categoriesRouter.get('/categories', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await Category.with('posts').orderBy('createdAt', 'desc').get();
    res.json(categories);
  } catch (err) { 
    next(err); 
  }
});

categoriesRouter.post('/categories', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (err) { 
    next(err); 
  }
});

categoriesRouter.get('/categories/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await Category.with('posts').find(req.params.id);
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }
    res.json(category);
  } catch (err) { 
    next(err); 
  }
});

categoriesRouter.put('/categories/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await Category.find(req.params.id);
    if (!category) { 
      res.status(404).json({ error: 'Category not found' }); 
      return; 
    }
    await category.update(req.body);
    res.json(category);
  } catch (err) { 
    next(err); 
  }
});

categoriesRouter.delete('/categories/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await Category.find(req.params.id);
    if (!category) { 
      res.status(404).json({ error: 'Category not found' }); 
      return; 
    }
    await category.delete();
    res.status(204).send();
  } catch (err) { 
    next(err); 
  }
});