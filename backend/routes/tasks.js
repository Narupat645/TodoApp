const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth'); // 👈 เรียกยาม (Middleware) มาใช้งาน

// 1. ดึงข้อมูลงานทั้งหมด (เฉพาะของตัวเอง)
// สังเกตว่าเราแทรก auth เข้าไปตรงกลาง เพื่อให้ยามตรวจบัตรก่อน
router.get('/', auth, async (req, res) => {
  try {
    // หาเฉพาะงานที่ owner ตรงกับ id ของคนที่ล็อกอินเข้ามา
    const tasks = await Task.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. สร้างงานใหม่
router.post('/', auth, async (req, res) => {
  // รับข้อมูลจากหน้าบ้าน แล้วเติม owner เข้าไปโดยดึงจากบัตรผ่าน (Token)
  const task = new Task({
    ...req.body,
    owner: req.user.id
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. แก้ไขงาน
router.put('/:id', auth, async (req, res) => {
  try {
    // หาและอัปเดตงาน โดยต้องเป็นงานที่มี id ตรงกัน และ "ต้องเป็นของตัวเองด้วย"
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      req.body,
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'ไม่พบงานนี้ หรือคุณไม่มีสิทธิ์แก้ไข' });
    }

    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. ลบงาน
router.delete('/:id', auth, async (req, res) => {
  try {
    // หาและลบงาน โดยต้องเป็นงานที่มี id ตรงกัน และ "ต้องเป็นของตัวเองด้วย"
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user.id });

    if (!task) {
      return res.status(404).json({ message: 'ไม่พบงานนี้ หรือคุณไม่มีสิทธิ์ลบ' });
    }

    res.json({ message: 'ลบงานเรียบร้อยแล้ว' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;