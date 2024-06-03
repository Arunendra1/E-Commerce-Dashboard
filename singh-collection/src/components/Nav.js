import React  from 'react';
import {Link,useNavigate} from 'react-router-dom';

const Nav=(props)=>{
    const auth=localStorage.getItem('user')
    const navigate=useNavigate()
    const logout=()=>{
        localStorage.clear();
        navigate('/signup')
    }
    return(
    <div>
        <img alt=" logo" className="logo" src="https://api.logo.com/api/v2/images?logo=logo_cb10078e-b770-418c-ae64-bb2acbd72467&u=1711925108&width=500&height=400&fit=contain&margins=100&format=webp&quality=60"></img>
       {
         auth ?<ul className="nav-ul">
            <li><Link to="/">Products</Link></li>
            <li><Link to="/add">Add Products</Link></li>
            <li><Link to="/update">Update Products</Link></li>
            {/* <li><Link to="/profile">Profile</Link></li> */}
            <li><Link onClick={logout} to="/signup">Logout ({JSON.parse(auth).name})</Link></li>
  
        </ul>
        :<ul className="nav-ul nav-right">
             <li><Link to="/signup">Sign Up</Link></li>
            <li><Link to="/login">Login</Link></li>  
        </ul>}
    </div> )
}
export default Nav;