import express from "express";
import { Comment } from "../models/Comment.mjs";
export const commentRouter = express();

// List all comments
commentRouter.get('/', async (req, res) => {
    try {
        const comments = await Comment.find();
        res.json(comments);
        
    } catch (error) {
        res.status(500).json(error);
    }
});

// list specified comment by id
commentRouter.get('/:id', async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).send(`Sorry, No comment has this id ${req.params.id}`);
        }
        res.json(comment);
        
    } catch (error) {
        res.status(500).json(error);
    }
});

// Delete specified comment by id
commentRouter.delete('/:id', async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).send(`Sorry, No comment has this id ${req.params.id}`);
        }
        await comment.delete();
        res.json("comment has been deleted successfully");
        
    } catch (error) {
        res.status(500).json(error);
    }
});
