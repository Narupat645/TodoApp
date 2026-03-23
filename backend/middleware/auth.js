const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // --- ปิดระบบเช็ค Token ชั่วคราว ---

    // ใส่ ID ของ User ทดสอบที่คุณสร้างไว้ใน MongoDB Atlas แทนที่ 'YOUR_USER_ID_HERE'
    req.user = { id: 'YOUR_USER_ID_HERE' };

    return next(); // สั่งให้ "ผ่านประตู" ไปได้เลยทันที ไม่ต้องดู Token ด้านล่าง

    /* --- โค้ดเดิม (ถูกปิดไว้) ---
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'ไม่มี Token' });
    }
    try {
        const actualToken = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token ไม่ถูกต้อง' });
    }
    --------------------------- */
};