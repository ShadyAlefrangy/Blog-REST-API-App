import express from "express";
// import dotenv from "dotenv";
import { dbConnect } from "./db-connect.mjs";
import { apiRouter } from "./routes/apiRouter.mjs";
import path from "path";
import swaggerUI from 'swagger-ui-express';
import swagDocs from '../swagger.json' assert { type: 'json' };
import { Post } from "./models/Post.mjs";
import { User } from "./models/User.mjs";
import { port } from "./config.mjs";
// dotenv.config();

const app = express();
// const port = process.env.SERVER_PORT || 3000;
app.use('/uploads', express.static('uploads'));
app.use(express.static('./api/public'));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./api/views/'));


dbConnect();

//!Routes
// Api
app.use('/api', apiRouter);
// Swagger UI
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swagDocs));

app.use('/', async (request, res) => {
    // number of records you want to show per page
    let perPage = 2;
 
    // total number of records from database
    let total = await Post.count();
 
    // Calculating number of pagination links required
    let pages = Math.ceil(total / perPage);
 
    // get current page number
    let pageNumber = (request.query.page == null) ? 1 : request.query.page;
 
    // get records to skip
    let startFrom = (pageNumber - 1) * perPage;

    async function getPosts(page, limit) {
        let url = `http://localhost:3000/api/posts?page=${page}&limit=${limit}`;
        try {
            let res = await fetch(url);
            return await res.json();
        } catch (error) {
            console.log(error);
        }
    }
    async function getAuthors() {
        let url = `http://localhost:3000/api/authors`;
        try {
            let res = await fetch(url);
            return await res.json();
        } catch (error) {
            console.log(error);
        }
    }
    let posts = await getPosts(pageNumber,perPage);
       
    res.render('index', {
        "pages": pages,
        "posts": posts,
        
    });
});

app.listen(port || 3000, () => {
    console.log(`Server running at http://localhost:${port}`);
});