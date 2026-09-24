
// user controler is used to handle user related operations
// such as user registration, login, and profile management

import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';




// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '10d', // Token valid for 7 days
    });
};







export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({email})
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        if(password.length < 8) {
            return res.status(400).json({
            success: false,
            message: 'Password must be at least 8 characters long' });
        }




        // Hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);






        // Create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id), // Generate JWT token
        });
    }

    catch (error) {
        console.log("error:",error)
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
}










// Login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id), // Generate JWT token
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
}








// Get user profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password'); // Exclude password from response
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
}