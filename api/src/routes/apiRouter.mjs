import express from "express";
import { authorsRouter } from "./authors.mjs";
import { authRouter } from "./authRouter.mjs";
import { commentRouter } from "./comments.mjs";
import { postRouter } from "./posts.mjs";
import { tagRouter } from "./tags.mjs";


export const apiRouter = express.Router();
apiRouter.use(express.json());

apiRouter.use('/auth', authRouter);
apiRouter.use('/authors', authorsRouter);
apiRouter.use('/posts', postRouter);
apiRouter.use('/tags', tagRouter);
apiRouter.use('/comments', commentRouter);

