import { NextFunction, Request, Response, Router } from 'express';
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