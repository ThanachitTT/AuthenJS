import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../services/authApi'

import './auth.css'

function Login() {
  const [inputs, setInputs] = useState({ userName: "", password: "" })
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError("")
    setIsSubmitting(true)
    try {
      const response = await authApi.login(inputs)
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token)
        navigate('/')
      }
    } catch (err) {
      if (!err.response) {
        setError('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาตรวจสอบว่า backend ทำงานอยู่ที่ port 5000')
      } else if (err.response.status === 500) {
        setError('เกิดข้อผิดพลาดที่เซิร์ฟเวอร์ กรุณาตรวจสอบการตั้งค่าฐานข้อมูลและ terminal ของ backend')
      } else {
        setError(err.response.data?.message || 'เข้าสู่ระบบไม่สำเร็จ กรุณาลองอีกครั้ง')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="userName" placeholder="Username" autoComplete="username" value={inputs.userName} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" autoComplete="current-password" value={inputs.password} onChange={handleChange} required />
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'กำลังเข้าสู่ระบบ...' : 'Login'}
          </button>
          <div className="auth-link">
            No Account ? <a href="/register">Register Here</a>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Login
