import React, { useState } from 'react'
import './LoginForm.css'
import { useNavigate } from 'react-router-dom'

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const navigate = useNavigate();

  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const handleChange = e => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = e => {
    e.preventDefault()
    setSubmitted(true)

    const newErrors = {}
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      const storedUserData = JSON.parse(localStorage.getItem('userData'))
      if (
        storedUserData &&
        storedUserData.email === formData.email &&
        storedUserData.password === formData.password
      ) {
        console.log('Login successful!');
        navigate('/');
        localStorage.removeItem('userData');
        localStorage.setItem('loggedIn', true);
      } else {
        console.log('Invalid email or password')
      }
    }
  }

  return (
    <div className='login-container'>
      <h1>Login</h1>
      <form className='login-form' onSubmit={handleSubmit}>
        <div className='form-group'>
          {submitted && errors.email ? (
            <div className='error-message'>{errors.email}</div>
          ) : (
            <label htmlFor='email'>Email Address</label>
          )}
          <input
            type='email'
            id='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className='form-group'>
          {submitted && errors.password ? (
            <div className='error-message'>{errors.password}</div>
          ) : (
            <label htmlFor='password'>Password</label>
          )}
          <input
            type='password'
            id='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type='submit' className='submit-button'>
          Login
        </button>
      </form>
    </div>
  )
}

export default LoginForm
