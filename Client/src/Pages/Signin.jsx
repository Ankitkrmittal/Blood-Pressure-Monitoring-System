import React, { useState } from 'react'
import { useNavigate } from "react-router"
import useAuth from "../context/authContext"
import auth from "../lib/auth";
const Signin = () => {
    const [password,setPassword] = useState("");
    const [email,setEmail] = useState("");
    const navigate = useNavigate();
    const {signin}= useAuth();
    const formSubmitHandler = async(e)=>{
      e.preventDefault();
      const {user,token} = await signin({email,password});
      auth.token=token;
      auth.user=user;
      navigate('/dashboard');

    }
  return (
    <div>
      <form onSubmit={formSubmitHandler}>
        <input
        onChange={(e)=>setEmail(e.target.value)}
        value={email}
        type='text'
        placeholder='Enter Email'></input>
        
        <input
        onChange={(e)=>setPassword(e.target.value)}
        value={password}
        type='password'
        placeholder='Enter password'></input>
        <button type="submit">signin</button>
      </form>
      Not a user signup instead?{" "}
      <button onClick={()=>navigate('/signup')}>signup</button>
    </div>
  )
}

export default Signin