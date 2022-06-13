import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.mjs";
import { jwtSecret } from "../config.mjs";


export const authRouter = express.Router();

authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body
    // Check if username and password is provided
    if (!email || !password) {
        return res.status(400).json({
            message: "Username or Password not present",
        })
    }
    try {
        const user = await User.findOne({ email })
        if (!user) {
            res.status(400).json({
                message: "Login not successful",
                error: "User not found",
            })
        } else {
            // comparing given password with hashed password
            const validatedPassword = await bcrypt.compare(password, user.password);
            if (!validatedPassword) {
                return res.status(400).json('Wrong Credentials');
            }
            // create jwt token for admin user
            // const jwtSecret = "4715aed3c946f7b0a38e6b534a9583628d84e96d10fbc04700770d572af3dce43625dd";
            if (user.userType == 'user') {
                return res.status(200).send("Login Successful");
            }
            const token = jwt.sign({
                id: user._id.toString(),
                userType: user.userType
            }, jwtSecret);

            res.status(200).send(token);

        }
    } catch (error) {
        res.status(400).json({
            message: "An error occurred",
            error: error.message,
        })
    }
});




