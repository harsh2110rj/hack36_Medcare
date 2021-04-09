import React, { useState } from 'react'
import {Route,Switch} from 'react-router-dom'
import Axios from 'axios'
import { Redirect, useHistory } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'

import Nav from './Nav'
function Register_doctor() {
   
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");
    const [category,setCategory]=useState("Choose");
const history=useHistory();
    const [name_err, setName_err] = useState(false);
    const [email_err, setEmail_err] = useState(false);
    const [pass_err, setPassword_err] = useState(false);
    const [confPassword_err, setConfPassword_err] = useState(false);
    const type=localStorage.getItem('type');
    function Handle(data) {

        if (name.length < 2 || password.length < 4 || password !== confPassword || category==='Choose' ) {
            if(!name && !email && !password && !confPassword)
            alert('Fill all the details CORRECTLY..')
            else if(name.length<2)
            alert('Name should be atleast 3 characters')
            else if(password.length < 4)
            alert('Weak password')
            else if(password !== confPassword)
            alert('Password not matching with confirm password')
            else if(category==='Choose')
            alert('choose your speciality')
        }
        else
            {
            
            let data={
                name:name,
                email:email,
                password:password,
                category:category
            };
           console.log(data);

                alert('Register successfull')
            Axios.post('http://localhost:3001/register/doctor',
            data ).then((resp)=>{
                                     
            });
            history.push('/login_doctor');
                                  
        }
       
        setName("");
        setEmail("");
        setPassword("");
        setConfPassword("");
        setCategory("Choose");
        data.preventDefault();
    }
    function UserHandler(e) {
        let name = e.target.value;
        if (name.length < 3)
            setName_err(true);
        else
            setName_err(false);
        setName(name);

    }
    function EmailHandler(e) {
        let email = e.target.value;
        if (email.length < 3)
            setEmail_err(true);
        else
            setEmail_err(false);
        setEmail(email);

    }


    function PasswordHandler(e) {
        let p = e.target.value;
        if (p.length < 4)
            setPassword_err(true);
        else
            setPassword_err(false);
        setPassword(p);

    }
    function ConfirmPasswordHandler(e) {
        let cp = e.target.value;
        if (cp.length < 4)
            setConfPassword_err(true);
        else
            setConfPassword_err(false);
        setConfPassword(cp);
    }

    function CategoryHandler(e)
    {
      
        
        let temp=e.target.value;
        setCategory(temp);
    
       
    }


    return (
        <div className="auth-wrapper">
            
        <div className="auth-inner">
           
        <Nav type={type}/>
  
            <h3>Sign Up</h3>
            <form onSubmit={Handle}>
            <div className="form-group">
                <label>Name: </label>
                <input type='text'  className="form-control"  placeholder='Enter name..' value={name} onChange={UserHandler} />
                </div>
                <div className="form-group">
                <label>Email: </label>
                <input type='email'  className="form-control" placeholder='Enter email id..' value={email} onChange={EmailHandler} />
                </div>
                <div className="form-group">
                <label>Password: </label>
                <input type='password'  className="form-control" placeholder='Enter password..' value={password} onChange={PasswordHandler} />
                </div>
                <div className="form-group">
                <label>Confirm Password: </label>
                <input type='password'  className="form-control" placeholder='enter confirm password..' value={confPassword} onChange={ConfirmPasswordHandler} />
                </div>
                <div className="form-group">
                <select value={category} onChange={CategoryHandler} >
                <option value="Choose">Choose</option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Ophthalmologist">Ophthalmologist</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Physician">Physician</option>
                <option value="Psychiatrist">Psychiatrist</option>
                </select>
                </div>
                <button  className="btn btn-primary">Register</button>

            </form>
        </div>
        </div>
    )
}
export default Register_doctor;