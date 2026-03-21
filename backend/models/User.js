const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Please provide a username'],
            unique: true, // 👈 สำคัญมาก: บังคับว่า Username ของแต่ละคนห้ามซ้ำกัน
            trim: true,
            minlength: 3
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: 6
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);