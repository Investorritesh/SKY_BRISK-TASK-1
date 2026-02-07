import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        console.log('Registering user:', email);

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            return next(new Error('User already exists'));
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'viewer',
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400);
            return next(new Error('Invalid user data'));
        }
    } catch (error) {
        console.error('Register Error:', error);
        next(error);
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', email);

        const user = await User.findOne({ email }).select('+password');
        console.log('User found:', user ? 'Yes' : 'No');

        if (user && (await user.matchPassword(password))) {
            console.log('Password match: Yes');
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            console.log('Password match: No or User not found');
            res.status(401);
            return next(new Error('Invalid email or password'));
        }
    } catch (error) {
        console.error('Login Error:', error);
        next(error);
    }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        } else {
            res.status(404);
            return next(new Error('User not found'));
        }
    } catch (error) {
        next(error);
    }
};

// Generate JWT
const generateToken = (id) => {
    console.log('Generating token for ID:', id);
    if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is missing!');
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d',
    });
};
