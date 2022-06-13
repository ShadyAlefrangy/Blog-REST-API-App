import express from "express";
import jwt from "jsonwebtoken";
import { authorizeAdmin, authorizeAdminOrAuthor } from "../helpers.mjs";
import { User } from "../models/User.mjs";
import { Post } from "../models/Post.mjs";

export const authorsRouter = express.Router();

// create new author
authorsRouter.post('/', authorizeAdmin , async (req, res) => {
    try {
        const authorData = req.body;
        const newAuthor = new User();
        const { firstName, lastName, bio, links, userType, email } = req.body;
        const checkFirstName = /^[A-Za-z\s]*$/.test(firstName);
        const checkLastName = /^[A-Za-z\s]*$/.test(lastName);
        const checkEmail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/.test(email)
        const checkBio = !(bio == undefined);
        const checkLinks = !(links == undefined);
        const checkUserType = (userType == 'author');

        if (!(checkFirstName && checkLastName && checkBio && checkLinks && checkUserType && checkEmail)) {
            return res.json({
                message: 'Invalid Data, please check the following rules',
                name: "only characters and spaces allowed",
                bioAndLinks: "must have a value"
            });
        }
        
        Object.keys(authorData).forEach(k => {
            newAuthor[k] = authorData[k];
        });
        const author = await newAuthor.save();
        res.status(200).json(author);
        
    } catch (error) {
        res.status(500).json(error);
    }
});
// list all authors
authorsRouter.get('/', async (req, res) => {
    try {
        const authors = await User.find({userType: 'author'});
        res.json(authors);
        
    } catch (error) {
        res.status(500).json(error);
    }
});

// list specified author by id
authorsRouter.get('/:id', async (req, res) => {
    try {
        const author = await User.findOne({
            _id : req.params.id,
            userType: 'author'
        });
        
        if (!author) {
            return res.status(404).send(`Sorry, No author has this id ${req.params.id}`);
        }
        res.json(author);
        
    } catch (error) {
        res.status(500).json(error);
    }
});

authorsRouter.get('/:id/posts', async (req, res) => {
    try {
        const author = await User.findOne({
            _id : req.params.id,
            userType: 'author'
        });
        
        if (!author) {
            return res.status(404).send(`Sorry, No author has this id ${req.params.id}`);
        }
        const posts = await Post.find({authorId: req.params.id});
        res.json(posts);
        
    } catch (error) {
        res.status(500).json(error);
    }
});

// update specified author
authorsRouter.put('/:id', authorizeAdminOrAuthor, async (req, res) => {
    
    // try {
        const author = await User.findById(req.params.id);
        if (!author) {
            return res.status(404).send(`Sorry, No user has this id ${req.params.id}`);
        }
        const {firstName, lastName, email} = req.body;
        const checkFirstName = (firstName !== 'undefined') && (/^[A-Za-z\s]*$/.test(firstName));
        const checkLastName = (lastName !== 'undefined') && /^[A-Za-z\s]*$/.test(lastName);
        const checkEmail = (email !== 'undefined') || /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/.test(email);
        
        if (!checkFirstName) {
            return res.json("only characters and spaces allowed in first name");
        }
        if (!checkLastName) {
            return res.json("only characters and spaces allowed in last name");
        }
        if (!checkEmail) {
            return res.json("Please enter the valid email");
        }
        const updatedAuthor = await User.findByIdAndUpdate(
            req.params.id, {
                $set: req.body
            },
            {
                new: true
            }
        );
        res.status(200).json(updatedAuthor);
        
    // } catch (error) {
    //     res.status(500).json(error);
    // }
});

// delete specified author
authorsRouter.delete('/:id', authorizeAdmin, async (req, res) => {
    try {
        const author = await User.findById(req.params.id);
        if (!author) {
            return res.status(404).send(`Sorry, No author has this id ${req.params.id}`);
        }
        await author.delete();
        res.json("Author has been deleted successfully");
        
    } catch (error) {
        res.status(500).json(error);
    }
});
