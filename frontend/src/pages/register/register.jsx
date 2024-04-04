import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './register.css';

const Register = () => {
    const navigate = useNavigate();
    const [registerData, setRegisterData] = useState();

    useEffect(() => {
        async function register() {
            try {
                const res = await fetch('http://127.0.0.1:5000/signup', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(registerData)
                });
                const data = await res.json();
                if (res.ok) {
                    navigate('/login');
                } else {
                    alert('Registration failed!');
                }
            } catch (error) {
                console.log('Error:', error);
                alert('Registration failed!');
            }
        }
        if (registerData) {
            register();
        }
    }, [registerData, navigate]);

    const handle_register = (event) => {
        event.preventDefault();
        setRegisterData({ 'email': event.target.email.value, 'password': event.target.password.value });
    };

    return (
        <div className='container'>
            <div className='form-container'>
                <h1>Create an account</h1>
                <form onSubmit={handle_register}>
                    <label htmlFor='email'>Email Address</label>
                    <input type='email' name='email' />
                    <label htmlFor='password'>Password</label>
                    <input type='password' name='password' />
                    <button id='submit-button' type='submit'>Register</button>
                </form>
                <div>
                    <p>Already have an account? <Link to='/login'>Sign in</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
