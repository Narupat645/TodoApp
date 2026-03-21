const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // ดึง User Model ที่เราเพิ่งสร้างมาใช้

// 1. API สมัครสมาชิก (Register)
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // เช็คก่อนว่ามีคนใช้ชื่อนี้ไปหรือยัง
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'ชื่อผู้ใช้นี้มีคนใช้แล้วครับ' });
        }

        // เข้ารหัสผ่าน (Hash Password)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // สร้าง User ใหม่และบันทึกลง MongoDB
        const newUser = new User({
            username,
            password: hashedPassword,
        });
        await newUser.save();

        // สร้าง บัตรผ่าน (Token) ให้เลยเมื่อสมัครเสร็จ
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({ token, username: newUser.username });
    } catch (err) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก', error: err.message });
    }
});

// 2. API เข้าสู่ระบบ (Login)
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // หา User จากชื่อในฐานข้อมูล
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'ไม่พบชื่อผู้ใช้นี้ หรือรหัสผ่านผิด' });
        }

        // เอาคู่รหัสผ่านที่กรอกมา เทียบกับรหัสที่เข้ารหัสไว้ในฐานข้อมูล
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'ไม่พบชื่อผู้ใช้นี้ หรือรหัสผ่านผิด' });
        }

        // รหัสถูกต้อง! สร้าง บัตรผ่าน (Token) ให้
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({ token, username: user.username });
    } catch (err) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ', error: err.message });
    }
});

module.exports = router;