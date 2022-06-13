import express from "express";
import { authorizeAdmin, authorizeAuthor } from "../helpers.mjs";
import { Post } from "../models/Post.mjs";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config.mjs";
import { User } from "../models/User.mjs";
import mongoose from "mongoose";
import { Comment } from "../models/Comment.mjs";
import { Tag } from "../models/Tag.mjs";
import multer from "multer";

const storage = multer.diskStorage({
    destination: './uploads',
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1 * 1000 * 1000
    }
});


export const postRouter = express();

postRouter.post('/', authorizeAuthor, upload.single("image"), async (req, res) => {
    try {

        if (req.file) {
            return res.json({
                image_url: `http://localhost:3000/uploads/${req.file.fieldname}`
            });
        }

        const postData = req.body;
        let authorId;
        const token = req.headers['authorization'].split(' ')[1];
        jwt.verify(token, jwtSecret, (err, user) => {
            authorId = user.id;
        });
        
        const newPost = new Post();
        Object.keys(postData).forEach(k => {
            newPost[k] = postData[k];
        });
        newPost.authorId = authorId;
        
        if (newPost.status == "published") {
            newPost.publishDate = new Date();
        }
        const post = await newPost.save();
        res.status(200).json(post);

    } catch (error) {
        res.status(500).json(error);
    }
});

postRouter.get('/', async (req, res) => {
    try {
        let posts;
        let fields;
        let page = req.query.page || 1;
        let limit = req.query.limit || 5;
        let postsCount = await Post.count();
        let skip = page * limit;

        const authHeader = req.headers['authorization'];
        const token = !authHeader ? null : authHeader.split(' ')[1];
        if (token) {
            jwt.verify(token, jwtSecret, async (err, user) => {
                if (user.userType == "admin") {
                    //! ===================== if user is admin return all posts
                    if (req.query.fields) {
                        fields = (req.query.fields).split(",");
                    }
                    if (limit > postsCount) {
                        limit = postsCount
                    }
                    if (skip >= postsCount) {
                        skip = 0
                    }
                    if (fields != undefined) {
                        posts = await Post.find().limit(limit).skip(skip).select(fields);
                        posts = posts.map(function (post) {
                            post.set('read_more', `http://localhost:3000/api/posts/${post._id}`, { strict: false });
                            return post;
                        });
                        return res.json(posts);
                    }
                    if (req.query.tag) {
                        const tag = await Tag.find({ name: req.query.tag });
                        posts = await Post.find({ "tags": { "$in": tag } });
                        posts = posts.map(function (post) {
                            post.set('read_more', `http://localhost:3000/api/posts/${post._id}`, { strict: false });
                            return post;
                        });
                        return res.json(posts);
                    }
                    if (req.query.query) {
                        // const query = req.query.query;
                        var query = req.query.query
                        console.log(query);
                        posts = await Post.find({ title: { $regex: '.*' + query + '.*' } });
                        posts = posts.map(function (post) {
                            post.set('read_more', `http://localhost:3000/api/posts/${post._id}`, { strict: false });
                            return post;
                        });
                        return res.json(posts);
                    }
                    posts = await Post.find().limit(limit).skip(skip);
                    posts = posts.map(function (post) {
                        post.set('read_more', `http://localhost:3000/api/posts/${post._id}`, { strict: false });
                        return post;
                    });

                    res.json(posts);
                    //! ===================== 
                } else {
                    //! ===================== if user is author
                    if (req.query.fields) {
                        fields = (req.query.fields).split(",");
                    }
                    if (limit > postsCount) {
                        limit = postsCount
                    }
                    if (skip >= postsCount) {
                        skip = 0
                    }
                    if (fields != undefined) {
                        posts = await Post.find({ authorId: user.id }).limit(limit).skip(skip).select(fields);
                        posts = posts.map(function (post) {
                            post.set('read_more', `http://localhost:3000/api/posts/${post._id}`, { strict: false });
                            return post;
                        });
                        return res.json(posts);
                    }
                    if (req.query.tag) {
                        const tag = await Tag.find({ name: req.query.tag });
                        posts = await Post.find({
                            authorId: user.id,
                            "tags": { "$in": tag }
                        });
                        posts = posts.map(function (post) {
                            post.set('read_more', `http://localhost:3000/api/posts/${post._id}`, { strict: false });
                            return post;
                        });
                        return res.json(posts);
                    }
                    if (req.query.query) {
                        // const query = req.query.query;
                        var query = req.query.query
                        console.log(query);
                        posts = await Post.find({
                            authorId: user.id,
                            title: { $regex: '.*' + query + '.*' }
                        });
                        posts = posts.map(function (post) {
                            post.set('read_more', `http://localhost:3000/api/posts/${post._id}`, { strict: false });
                            return post;
                        });
                        return res.json(posts);
                    }
                    posts = await Post.find({ authorId: user.id }).limit(limit).skip(skip);
                    posts = posts.map(function (post) {
                        post.set('read_more', `http://localhost:3000/api/posts/${post._id}`, { strict: false });
                        return post;
                    });

                    res.json(posts);
                    //! =====================
                }
            });
        } else {
            //! ===================== if this user is normal user
            if (req.query.fields) {
                fields = (req.query.fields).split(",");
            }
            if (limit > postsCount) {
                limit = postsCount
            }
            if (skip >= postsCount) {
                skip = 0
            }
            if (fields != undefined) {
                posts = await Post.find({ status: "published" }).limit(limit).skip(skip).select(fields);
                posts = posts.map(function (post) {
                    post.set('read_more', `http://localhost:3000/api/posts/${post._id}`, { strict: false });
                    return post;
                });
                return res.json(posts);
            }
            if (req.query.tag) {
                const tag = await Tag.find({ name: req.query.tag });
                posts = await Post.find({
                    status: "published",
                    "tags": { "$in": tag }
                });
                posts = posts.map(function (post) {
                    post.set('read_more', `http://localhost:3000/api/posts/${post._id}`, { strict: false });
                    return post;
                });
                return res.json(posts);
            }
            if (req.query.query) {
                // const query = req.query.query;
                var query = req.query.query
                console.log(query);
                posts = await Post.find({
                    status: "published",
                    title: { $regex: '.*' + query + '.*' }
                });
                posts = posts.map(function (post) {
                    post.set('read_more', `http://localhost:3000/api/posts/${post._id}`, { strict: false });
                    return post;
                });
                return res.json(posts);
            }
            posts = await Post.find({ status: "published" }).limit(limit).skip(skip).populate({path: 'authorId', select: 'firstName'});
            posts = posts.map(function (post) {
                post.set('read_more', `http://localhost:3000/api/posts/${post._id}`, { strict: false });
                return post;
            });
            
            res.json(posts);
            //! =====================
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

postRouter.post('/:id/comments', async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        return res.status(404).send(`Sorry, No post has this id ${req.params.id}`);
    }
    const commentData = req.body;
    const { email } = req.body;
    if (!(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/.test(email))) {
        return res.json('Please enter the valid email');
    }
    const newComment = new Comment();
    Object.keys(commentData).forEach(k => {
        newComment[k] = commentData[k];
    });
    const comment = await newComment.save();
    post.comments.push(comment._id);
    await post.save();
    res.status(200).json(comment);
});

postRouter.get('/:id/comments', async (req, res) => {
    const post = await Post.findById(req.params.id).populate('comments');
    if (!post) {
        return res.status(404).send(`Sorry, No post has this id ${req.params.id}`);
    }
    res.json(post);

});
postRouter.get('/:id/comments/:commentId', async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).send(`Sorry, No comment has this id ${req.params.commentId}`);
        }
        res.json(comment);

    } catch (error) {
        res.status(500).json(error);
    }

});

postRouter.delete('/:id/comments/:commentId', authorizeAdmin, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send(`Sorry, No post has this id ${req.params.id}`);
        }
        const comments = post.comments;
        if (!(comments.includes(req.params.commentId))) {
            return res.status(404).send(`Sorry, this post does not have this comment`);
        }
        const index = comments.indexOf(req.params.commentId);
        comments.splice(index, 1);
        post.comments = comments;
        await post.save();

        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).send(`Sorry, No comment has this id ${req.params.commentId}`);
        }
        await comment.delete();
        res.json("comment has been deleted successfully");


    } catch (error) {
        res.status(500).json(error);
    }

});

postRouter.get('/content', async (req, res) => {
    try {
        const posts = await Post.find().select({ content: 1, _id: 0 });
        res.json(posts);

    } catch (error) {
        res.status(500).json(error);
    }
});

postRouter.get('/excerpt', async (req, res) => {
    try {
        const posts = await Post.find().select({ content: 1, _id: 0 });
        const data = [];
        posts.forEach(item => {
            data.push(item.content.substring(0, 2));
        });
        res.json(data);

    } catch (error) {
        res.status(500).json(error);
    }
});

postRouter.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send(`Sorry, No post has this id ${req.params.id}`);
        }
        res.json(post);

    } catch (error) {
        res.status(500).json(error);
    }
});

postRouter.put('/:id', authorizeAuthor, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        let authorId;
        const token = req.headers['authorization'].split(' ')[1];
        jwt.verify(token, jwtSecret, (err, user) => {
            authorId = user.id;
        });

        if (!post) {
            return res.status(404).send(`Sorry, No post has this id ${req.params.id}`);
        }
        if (!(authorId == post.authorId)) {
            return res.status(401).json("Sorry Not Authorized");
        }
        const { title, content, image, tags } = req.body;
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id, {
            $set: { title, content, image, tags }
        },
            {
                new: true
            }
        );
        res.status(200).json(updatedPost);

    } catch (error) {
        res.status(500).json(error);
    }
});

postRouter.delete('/:id', authorizeAdmin, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send(`Sorry, No post has this id ${req.params.id}`);
        }
        await post.delete();
        res.json("post has been deleted successfully");

    } catch (error) {
        res.status(500).json(error);
    }
});