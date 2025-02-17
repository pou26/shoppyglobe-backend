import userModel from "../Model/user.model.mjs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"; 
import {isValidPassword,isValidName} from "../Middleware/validate.mjs"; 


// ✅ Create a User
export async function createUser(req, res, next) {
    try {
        const { firstName, lastName, hobby, password } = req.body;

                // 🔍 Check if request body is empty
        if (!isValidRequestBody(req.body)) {
                return res.status(400).json({ status: false, message: "Request body cannot be empty." });
        }

        if (!firstName || !lastName || !hobby || !password) {
            return res.status(400).json({ status: false, message: "All fields (firstName, lastName, hobby, password) are required!" });
        }

        if (!isValidName(firstName)) {
            return res.status(400).json({ status: false, message: "First name must contain only letters and spaces." });
        }

        if (!isValidName(lastName)) {
            return res.status(400).json({ status: false, message: "Last name must contain only letters and spaces." });
        }

                // 🔍 Validate password format
                if (!isValidPassword(password)) {
                    return res.status(400).json({
                        status: false,
                        message: "Password must be 8-15 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
                    });
                }

        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        const newUser = new userModel({
            firstName,
            lastName,
            hobby,
            password: hashedPassword, // Storing the hashed password
        });

        const savedUser = await newUser.save();
        res.status(201).json({ status: true, message: "User created successfully!", data: savedUser });
    } catch (error) {
        next(error); 
    }
}

// Login User (Authenticate)
export async function loginUser(req, res, next) {
    try {
        const { firstName, lastName, password } = req.body;

        if (!firstName || !lastName || !password) {
            return res.status(400).json({ status: false, message: "First Name, Last Name, and Password are required!" });
        }

        // Find user
        let user = await userModel.findOne({ firstName, lastName });
        if (!user) {
            return res.status(400).json({ status: false, message: "Login failed! Username is incorrect." });
        }

        if (!user.password) {
            return res.status(500).json({ status: false, message: "User's password is missing in the database." });
        }

        // Compare provided password with stored hashed password

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ status: false, message: "Login failed! Password is incorrect." });
        }

        // Generate JWT token

        const accessToken = jwt.sign(
            { userId: user._id.toString(), firstName: user.firstName, lastName: user.lastName }, 
            "secretKey", 
            { expiresIn: "1h" }
        );

        res.json({ status: true, message: "Login successful!", accessToken });
    } catch (error) {
        next(error);
    }
}

