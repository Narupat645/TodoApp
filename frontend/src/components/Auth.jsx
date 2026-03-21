import React, { useState } from 'react';
import api from '../api';

export default function Auth({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // เลือกว่าจะยิง API ไปที่เข้าสู่ระบบ หรือ สมัครสมาชิก
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const res = await api.post(endpoint, { username, password });

            // ถ้าสำเร็จ ส่ง Token และ Username กลับไปให้ App.jsx เก็บไว้
            onLogin(res.data.token, res.data.username);
        } catch (err) {
            // ถ้าพิมพ์ผิด หรือชื่อซ้ำ ให้โชว์ Error สีแดง
            setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>
                    {isLogin ? '👋 เข้าสู่ระบบ TaskFlow' : '✨ สมัครสมาชิกใหม่'}
                </h2>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">ชื่อผู้ใช้งาน</label>
                        <input
                            type="text"
                            className="form-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">รหัสผ่าน (ขั้นต่ำ 6 ตัว)</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength="6"
                        />
                    </div>
                    <button type="submit" className="btn-save" style={{ width: '100%', marginTop: '10px', padding: '12px' }}>
                        {isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    {isLogin ? 'ยังไม่มีบัญชีใช่ไหม? ' : 'มีบัญชีอยู่แล้ว? '}
                    <span
                        style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 'bold' }}
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? 'สมัครเลยที่นี่' : 'ล็อกอินเลย'}
                    </span>
                </p>
            </div>
        </div>
    );
}