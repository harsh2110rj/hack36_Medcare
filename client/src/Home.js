import React from 'react'
import {Link} from 'react-router-dom'
import './App.css';
import './auth.css'
import Navbar from './Navbar'
function Home(){

    function Handle1(){
        
        localStorage.setItem("type",'doctor');
    }
    function Handle2(){
        localStorage.setItem("type",'patient');
    }
    return(
        <div className="auth-wrapper">
            <Navbar/>
        <Link to='/login_doctor' ><button className="auth-inner" onClick={Handle1}>
        
            <h2>Doctor</h2>
            </button></Link>
            <Link to='/login_patient'><button className="auth-inner" onClick={Handle2}>
            <h2>Patient</h2>
            </button></Link>
            
    </div>
    )
}
export default Home;