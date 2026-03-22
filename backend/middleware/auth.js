const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // 1. รับบัตรผ่าน (Token) จาก Header
    const token = req.header('Authorization');

    // 2. ถ้าไม่มีบัตรผ่าน ไม่ให้เข้า!
    if (!token) {
        return res.status(401).json({ message: 'ไม่มี Token, ปฏิเสธการเข้าถึง' });
    }

    try {
        // 3. แกะ Token (ตัด Bearer ออกถ้ามี)
        const actualToken = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

        // 4. แปะข้อมูล User เข้าไปใน req
        req.user = decoded;
        next(); // ให้ผ่านประตูไปทำงานต่อได้
    } catch (err) {
        res.status(401).json({ message: 'Token ไม่ถูกต้อง หรือหมดอายุแล้ว' });
    }
};
