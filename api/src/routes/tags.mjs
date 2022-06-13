import express from "express";
import { authorizeAdmin, authorizeAdminOrAnyAuthor } from "../helpers.mjs";
import { Post } from "../models/Post.mjs";
import { Tag } from "../models/Tag.mjs";


export const tagRouter = express.Router();

// Create new tag
tagRouter.post('/', authorizeAdminOrAnyAuthor, async (req, res) => {
    try {
        const tagData = req.body;
        const newTag = new Tag();
        Object.keys(tagData).forEach(k => {
            newTag[k] = tagData[k];
        });
        const tag = await newTag.save();
        res.status(200).json(tag);
        
    } catch (error) {
        res.status(500).json(error);
    }
});

// List all tags
tagRouter.get('/', async (req, res) => {
    try {
        const tags = await Tag.find();
        // Check if has tags or not
        if (!tags) {
            return res.status(404).json({
                message: "Sorry, no tags returned"
            })
        }
        res.json(tags);
        
    } catch (error) {
        res.status(500).json(error);
    }
});

// List specified tag wih id
tagRouter.get('/:id', async (req, res) => {
    try {
        // return the tag
        const tag = await Tag.findById(req.params.id);
        // check if has tag or not
        if (!tag) {
            return res.status(404).send(`Sorry, No tag has this id ${req.params.id}`);
        }
        res.json(tag);
        
    } catch (error) {
        res.status(500).json(error);
    }
});

// list of posts belongs to specified tag
tagRouter.get('/:id/posts', async (req, res) => {
    try {
        // check this id has tag or not
        const tag = await Tag.findById(req.params.id);
        // check has tag or not
        if (!tag) {
            return res.status(404).send(`Sorry, No tag has this id ${req.params.id}`);
        }
        // return the posts have this tag
        const posts = await Post.find({tags: req.params.id});
        if (!posts) {
            res.json({
                message: "Sorry, this tag has no posts"
            });
        } else {
            res.json(posts);
        }
        
    } catch (error) {
        res.status(500).json(error);
    }
});
// Update specified tag wih id
tagRouter.put('/:id', authorizeAdmin, async (req, res) => {
    try {
        // check the id has tag or not
        const tag = await Tag.findById(req.params.id);
        // if no tag with this id
        if (!tag) {
            return res.status(404).send(`Sorry, No tag has this id ${req.params.id}`);
        }
        // if this id has tag, update this tag
        const updatedTag = await Tag.findByIdAndUpdate(
            req.params.id, {
                $set: req.body
            },
            {
                new: true
            }
        );
        res.status(200).json(updatedTag);
        
    } catch (error) {
        res.status(500).json(error);
    }
});

// Delete specified tag wih id
tagRouter.delete('/:id', authorizeAdmin, async (req, res) => {
    try {
        // check the id has tag or not
        const tag = await Tag.findById(req.params.id);
        if (!tag) {
            return res.status(404).send(`Sorry, No tag has this id ${req.params.id}`);
        }
        await tag.delete();
        res.json("Tag has been deleted successfully");
        
    } catch (error) {
        res.status(500).json(error);
    }
});

