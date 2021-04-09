import React,{useState,useEffect} from 'react'
import {Link} from 'react-router-dom'
import Nav_doctor from './Nav_doctor'
import Axios from 'axios'
function Doctor_dashboard(){
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    useEffect(() => {
        const token = localStorage.getItem('token');
        const user=localStorage.getItem('user');
        console.log(user);
                setEmail(user);
                Axios.post('http://localhost:3001/user/doctor',{email:user}).then((resp)=>{
                    console.log(resp.data);
                    setName(resp.data[0].name);
                    })
               
    },[]);
    return(
        <div> 
             <h1>hello</h1>
            <Nav_doctor  name={name}/>
           <h1>Dashboard of doctor</h1>
    </div>
    )
}
export default Doctor_dashboard;