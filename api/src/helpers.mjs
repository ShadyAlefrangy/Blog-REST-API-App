import { jwtSecret } from "./config.mjs";
import jwt from "jsonwebtoken";

export function authorizeAdmin(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = !authHeader ? null : authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json("Not Authenticated User");
    }

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            return res.status(401).json({ message: "Not authorized" })
        } else {
            if (user.userType !== "admin") {
                return res.status(401).json({ message: "Not authorized" })
            } else {
                next()
            }
        }
    });
};

export function authorizeAuthor(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = !authHeader ? null : authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json("Not Authenticated User");
    }

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            return res.status(401).json({ message: "Not authorized" })
        } else {
            if (user.userType !== "author") {
                return res.status(401).json({ message: "Not authorized" })
            } else {
                next()
            }
        }
    });
};

export function authorizeAdminOrAuthor(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = !authHeader ? null : authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json("Not Authenticated User");
    }

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            return res.status(401).json({ message: "Not authorized" })
        } else {
            if (user.userType == "admin") {
                next();
            } else if ((user.userType == "author") && (user.id == req.params.id)) {
                next();
            } else {
                return res.status(401).json({ message: "Not authorized" })
            }
        }
    });
};

export function authorizeAdminOrAnyAuthor(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = !authHeader ? null : authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json("Not Authenticated User");
    }

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            return res.status(401).json({ message: "Not authorized" })
        } else {
            if (user.userType == "admin" || user.userType == "author") {
                next();
            } else {
                return res.status(401).json({ message: "Not authorized" })
            }
        }
    });
};

export async function getPosts() {
    let url = 'http://localhost:3000/api/posts/';
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}
