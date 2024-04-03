import React,{useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createClient } from '../../utility/client.ts';

import './login.css'

const Login = () =>{
    const supabase = createClient()
    const navigate = useNavigate()
    const [loginData, setLoginData] = useState();
    useEffect(() =>{
        async function login(){
            try{
                const res = await fetch('http://127.0.0.1:5000/login', {
                    method: 'POST',
                    headers:{
                        'Accept': 'application/json',
                        "Content-Type": "application/json"
                     },
                     body: JSON.stringify(loginData)
                  })
                const ret = await res.json()
                const access_token = ret.session.access_token
                const refresh_token = ret.session.refresh_token
                const {data, error} = await supabase.auth.setSession({access_token, refresh_token})
                navigate('/dashboard')
                console.log(data)
              }
              catch (error){
                  console.log('Error', error)
                  alert("Login failed!")
                  return
              }

        }
        if (loginData){
            console.log(loginData)
            login()
        }
    }, [loginData])
    const handle_login = async (event) =>{
        event.preventDefault();
        setLoginData({'email': event.target.email.value, 'password': event.target.password.value})
    }
    async function getUser(){
        try{
        const res = await fetch('http://127.0.0.1:5000/get_user', {
                method: 'GET',
                headers:{
                    'Accept': 'application/json',
                    "Content-Type": "application/json"
                 },
              })
            const data = await res.json()
            console.log(data)
          }
          catch (error){
            console.log(error)
          }
      }
    return(
        <div className='container'>
            <div className='form-container'>
                <h1>Sign in</h1>
                <form onSubmit={handle_login}>
                    <label htmlFor='email'>Email Address</label>
                    <input type='email' name='email'/>
                    <label htmlFor='password'>Password</label>
                    <input type='' name='password'/>    
                    {/*<div><input type='checkbox'></input><label htmlFor=''>Keep me logged in</label></div>*/}
                    <button id='submit-button' type='submit'>login</button>
                </form>
                <div><p>Don't have an account? <Link to='/register'>Sign up!</Link></p></div>
            </div>
        </div>
    )
}

export default Login;