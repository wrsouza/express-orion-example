import { NextFunction, Request, Response, Router } from 'express';
import { Category } from '../database/models/Category';
import { Post } from '../database/models/Post';
import { User } from '../database/models/User';
export const postsRouter = Router();

postsRouter.get('/posts', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await Post.with('user').orderBy('createdAt', 'desc').get();
    res.json(posts);
  } catch (err) { 
    next(err); 
  }
});

postsRouter.post('/posts', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.find(req.body.user_id);
    if (!user) { 
      res.status(404).json({ error: 'User not found' }); 
      return; 
    }
    const post = await Post.create(req.body);
    res.status(201).json(post);
  } catch (err) { 
    next(err); 
  }
});

postsRouter.get('/posts/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await Post.with(['user', 'categories']).find(req.params.id);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    res.json(post);
  } catch (err) { 
    next(err); 
  }
});

postsRouter.put('/posts/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await Post.find(req.params.id);
    if (!post) { 
      res.status(404).json({ error: 'Post not found' }); 
      return; 
    }
    await post.update(req.body);
    res.json(post);
  } catch (err) { 
    next(err); 
  }
});

postsRouter.delete('/posts/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await Post.find(req.params.id);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    await post.delete();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

postsRouter.post('/posts/:id/categories', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await Post.find(req.params.id);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    const category = await Category.find(req.body.category_id);
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }
    await post.categories().attach([req.body.category_id]);
    const updated = await Post.with(['user', 'categories']).find(req.params.id);
    res.status(201).json(updated);
  } catch (err) {
    next(err);
  }
});

postsRouter.put('/posts/:id/categories', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await Post.find(req.params.id);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    const categoryIds: string[] = req.body.category_ids;
    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      res.status(400).json({ error: 'category_ids must be a non-empty array' });
      return;
    }
    await post.categories().sync(categoryIds);
    const updated = await Post.with(['user', 'categories']).find(req.params.id);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

postsRouter.delete('/posts/:id/categories/:categoryId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await Post.find(req.params.id);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    await post.categories().detach([req.params.categoryId]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});