import { NextFunction, Request, Response, Router } from 'express';
import { Category } from '../database/models/Category';
import { Post } from '../database/models/Post';
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

categoriesRouter.post('/categories/:id/posts', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await Category.find(req.params.id);
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }
    const post = await Post.find(req.body.post_id);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    await category.posts().attach([req.body.post_id]);
    const updated = await Category.with('posts').find(req.params.id);
    res.status(201).json(updated);
  } catch (err) {
    next(err);
  }
});

categoriesRouter.put('/categories/:id/posts', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await Category.find(req.params.id);
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }
    const postIds: string[] = req.body.post_ids;
    if (!Array.isArray(postIds) || postIds.length === 0) {
      res.status(400).json({ error: 'post_ids must be a non-empty array' });
      return;
    }
    await category.posts().sync(postIds);
    const updated = await Category.with('posts').find(req.params.id);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

categoriesRouter.delete('/categories/:id/posts/:postId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await Category.find(req.params.id);
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }
    await category.posts().detach([req.params.postId]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});