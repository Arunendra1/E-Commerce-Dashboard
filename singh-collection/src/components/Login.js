import React ,{useEffect} from 'react';
import {useNavigate} from 'react-router-dom'
const Login=()=>{
    const [email,setEmail]=React.useState("");
    const [password,setPassword]=React.useState("");
    const navigate=useNavigate();
    const handleLogin=async()=>{
        console.warn(email,password);
        let result=await  fetch("http://localhost:5000/login", {
            method: "POST",
            body:JSON.stringify({email,password}),
            headers:{
                'content-Type':'application/json'
             }
    });
    result=await result.json();
    console.warn(result);
    if(result.auth){
     localStorage.setItem("user",JSON.stringify(result.user));
     localStorage.setItem("token",JSON.stringify(result.auth));
     navigate('/')
    }else{
        alert("please enter correct details")
    }
}
useEffect(()=>{
    const auth=localStorage.getItem('user');
    if(auth){
        navigate('/')
    }
})
    return (
        <div className="Login">
        <h1 className="login">Login</h1>
        <input className="inputBox" type="text"  value={email} 
                onChange={(e) => setEmail(e.target.value)}  placeholder="Enter Email" />

        <input className="inputBox" type="password"  value={password} 
                onChange={(e) => setPassword(e.target.value)}  placeholder="Enter Password"/>
        <button onClick={handleLogin} type="button" className="loginbutton">Login</button>
    </div>
    )
}
export default Login;