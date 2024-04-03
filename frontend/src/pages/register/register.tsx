import React,{useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createClient } from '../../utility/client.ts';

import './register.css'

const Register = () =>{
    const supabase = createClient()
    const navigate = useNavigate()
    const [registerData, setRegisterData] = useState();
    useEffect(() =>{
        async function register(){
            try{
                const res = await fetch('http://127.0.0.1:5000/signup', {
                    method: 'POST',
                    headers:{
                        'Accept': 'application/json',
                        "Content-Type": "application/json"
                     },
                     body: JSON.stringify(registerData)
                  })
                const data = await res.json()
                if (!data){
                    navigate('/login')
                }
                else{
                    alert('Sign up failed!')
                }
                console.log(data)
              }
              catch (error){
                  console.log('Error!', error)
              } 
        }
        if (registerData){
            console.log(registerData)
            register()
        }
    }, [registerData])
    const handle_login = async (event) =>{
        event.preventDefault();
        setRegisterData({'email': event.target.email.value, 'password': event.target.password.value})
    }
    
    return(
        <div className='container'>
            <div className='form-container'>
                <h1>Sign up</h1>
                <form onSubmit={handle_login}>
                    <label htmlFor='email'>Email Address</label>
                    <input type='email' name='email'/>
                    <label htmlFor='password'>Password</label>
                    <input type='' name='password'/>    
                    {/*<div><input type='checkbox'></input><label htmlFor=''>Keep me logged in</label></div>*/}
                    <button id='submit-button' type='submit'>Register</button>
                </form>
                <div><p>Already have an account? <Link to='/login'>Sign in!</Link></p></div>
            </div>
        </div>
    )
}

export default Register;