import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import { useAuthContext } from '../../utility/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState();
    const {user, setUser} = useAuthContext()
    useEffect(() => {
        async function login() {
            try {
                const res = await fetch('http://127.0.0.1:5000/login', {
                    method: 'POST',
                    mode: "cors",
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(loginData)
                });
                console.log(res)
                if (res.ok) {
                    setUser(true)
                    navigate('/dashboard')
                } else {
                    console.log(ret)
                    alert('Invalid Email or Password');
                }
            } catch (error) {
                console.log('Error:', error);
            }
        }
        if (loginData) {
            login();
        }
    }, [loginData]);

    const handle_login = (event) => {
        event.preventDefault();
        setLoginData({ 'email': event.target.email.value, 'password': event.target.password.value });
    };

    return (
        <div className='container'>
            <div className='title'>
                <h1>Memo</h1>
            </div>
            <div className='form-container'>
                <h1>Sign in</h1>
                <form onSubmit={handle_login}>
                    <label htmlFor='email'>Email Address</label>
                    <input type='email' name='email' />
                    <label htmlFor='password'>Password</label>
                    <input type='password' name='password' />
                    <button id='submit-button' type='submit'>Login</button>
                </form>
                <div>
                    <p>Don't have an account? <Link to='/register'>Register here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;