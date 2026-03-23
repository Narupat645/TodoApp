const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // --- 🛠️ แก้ไขเรียบร้อย: สวมรอยเป็น User 'Test123' อัตโนมัติ ---

    // ใช้ ID จากรูปที่คุณหาเจอ: 69bf456b48c6d0b7246e08c7
    req.user = { id: '69bf456b48c6d0b7246e08c7' };

    return next(); // สั่งให้ผ่านประตูไปดึงข้อมูลและบันทึกงานได้เลย

    /* --- โค้ดเดิมที่ถูกปิดไว้ ---
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