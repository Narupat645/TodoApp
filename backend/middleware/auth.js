const jwt = require('jsonwebtoken');

// ดึงรายชื่อผู้ใช้งานทั้งหมดในระบบ (เอาแค่ username มาโชว์)
router.get('/users', async (req, res) => {
    try {
        // ดึงมาเฉพาะ username และ _id (ไม่เอา password มาเด็ดขาด!)
        const users = await User.find({}, 'username');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = function (req, res, next) {
    // 1. รับบัตรผ่าน (Token) จาก Header ที่หน้าบ้านส่งมา
    const token = req.header('Authorization');

    // 2. ถ้าไม่มีบัตรผ่าน ไม่ให้เข้า!
    if (!token) {
        return res.status(401).json({ message: 'ไม่มี Token, ปฏิเสธการเข้าถึง' });
    }

    try {
        // 3. ถ้ามีบัตรผ่าน ให้แกะบัตรดูว่าใช่ของจริงไหม (โดยใช้ JWT_SECRET)
        // หมายเหตุ: หน้าบ้านมักจะส่งมาในรูปแบบ "Bearer <token_string>" เราเลยต้องตัดคำว่า Bearer ออกก่อน
        const actualToken = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;

        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

        // 4. ถ้าของจริง เอาข้อมูล ID ของ User แปะติดไปกับ req เพื่อให้ด่านต่อไปเอาไปใช้ต่อได้
        req.user = decoded;
        next(); // ให้ผ่านประตูไปทำงานต่อได้!
    } catch (err) {
        res.status(401).json({ message: 'Token ไม่ถูกต้อง หรือหมดอายุแล้ว' });
    }
};