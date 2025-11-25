import pool from '../config/db.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

 //Method for user registration
export const registerUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create(
      { username, password: hashed, role },
      pool
    );

    res.status(201).json({ msg: "User created", user });
  } catch (err) {
    console.error('Error in registerUser:', err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// Method for user login
export const loginUser = async (req, res) => {
    try{
        const {username, password} = req.body;
        
        if (!username || !password) {
            return res.status(400).json({message: 'Missing fields'});
        }
        
        const user = await User.findByUsername(username, pool);
        if(!user){
            return res.status(400).json({message: 'Invalid credentials'});
        }
        const match = await bcrypt.compare(password, user.password);
        if(!match){
            return res.status(400).json({message: 'Invalid credentials'});
        }
        const token = jwt.sign({id: user.id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '1d'});
        res.json({message: 'Login successful', token});
    }catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
};