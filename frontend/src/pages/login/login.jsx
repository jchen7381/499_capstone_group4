import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './login.css';

const Login = () => {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState();

    useEffect(() => {
        async function login() {
            try {
                const res = await fetch('http://127.0.0.1:5000/login', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(loginData)
                });
                const ret = await res.json();
                if (res.ok) {
                    const new_cookie = {access_token: ret.session.access_token, refresh_token: ret.session.refresh_token}
                    document.cookie = `session=` + JSON.stringify(new_cookie)
                    navigate('/workspace');
                } else {
                    alert('Login failed!');
                }
            } catch (error) {
                console.log('Error:', error);
                alert('Login failed!');
            }
        }
        if (loginData) {
            login();
        }
    }, [loginData, navigate]);

    const handle_login = (event) => {
        event.preventDefault();
        setLoginData({ 'email': event.target.email.value, 'password': event.target.password.value });
    };

    return (
        <div className='container'>
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
