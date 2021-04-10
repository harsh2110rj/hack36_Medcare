import React,{useState,useEffect} from 'react'
import {Link} from 'react-router-dom'
import Nav_patient from './Nav_patient'
import Axios from 'axios'
function Patient_dashboard(){
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    useEffect(() => {
        const token = localStorage.getItem('token');
        const user=localStorage.getItem('user');
        console.log(user);
                setEmail(user);
                Axios.post('http://localhost:3001/user/patient',{email:user}).then((resp)=>{
                    console.log(resp.data[0].name);
                    setName(resp.data[0].name);
                    })
                                   
    },[]);
    return(
        <div> 
            <h1>hello</h1>
            <Nav_patient  name={name}/>
           <h1>Dashboard of patient</h1>
    </div>
    )
}
export default Patient_dashboard;