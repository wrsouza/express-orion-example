import express, { Application, NextFunction, Request, Response } from 'express';
import './database';
import { categoriesRouter, postsRouter, usersRouter } from './routes';

const app: Application = express();
app.use(express.json());

// ── Health ────────────────────────────────────────────────────────────────────

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Orion ORM api-test running' });
});

// ── Users ─────────────────────────────────────────────────────────────────────

app.use(usersRouter);

// ── Posts ─────────────────────────────────────────────────────────────────────

app.use(postsRouter);

// ── Categories ─────────────────────────────────────────────────────────────────

app.use(categoriesRouter);

// ── Error handler ─────────────────────────────────────────────────────────────

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.message);
  res.status(500).json({ error: err.message });
});

// ── Start ─────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
