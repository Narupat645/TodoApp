const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    group: {
      type: String,
      default: '',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    due: {
      type: String,
      default: '',
    },
    done: {
      type: Boolean,
      default: false,
    },
    created: {
      type: String,
      default: '',
    },
    // 👇 ฟีเจอร์แท็กคนรับผิดชอบ (ที่เราเพิ่งทำเสร็จไป)
    assignees: {
      type: [String],
      default: []
    },
    // 👇 ฟีเจอร์ระบบสมาชิก: ผูกงานนี้เข้ากับเจ้าของ (User ID)
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);