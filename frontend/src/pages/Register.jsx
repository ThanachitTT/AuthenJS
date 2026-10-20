import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../services/authApi'

import './auth.css'

const emptyInputs = { userName: "", email: "", password: "", cpassword: "" };

function Register() {
  const [inputs, setInputs] = useState(emptyInputs)
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

    if (inputs.password !== inputs.cpassword) {
      setError('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน')
      return
    }

    setError("")
    setIsSubmitting(true)
    try {
      const response = await authApi.register(inputs)
      if (response.status === 201) {
        alert(response.data.message)
        navigate('/login')
      }
    } catch (err) {
      if (!err.response) {
        setError('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาตรวจสอบว่า backend ทำงานอยู่ที่ port 5000')
      } else if (err.response.status === 500) {
        setError('เกิดข้อผิดพลาดที่เซิร์ฟเวอร์ กรุณาตรวจสอบการตั้งค่าฐานข้อมูลและ terminal ของ backend')
      } else {
        setError(err.response.data?.message || 'สมัครสมาชิกไม่สำเร็จ กรุณาลองอีกครั้ง')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="userName" placeholder="Username" value={inputs.userName} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={inputs.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={inputs.password} onChange={handleChange} required />
          <input type="password" name="cpassword" placeholder="Confirm Password" value={inputs.cpassword} onChange={handleChange} required />
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'กำลังสมัครสมาชิก...' : 'Sign Up'}
          </button>
          <div className="auth-link">
            Have an Account ? <a href="/login">Login Here</a>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Register
