import React, { useState } from 'react'
import {Route,Switch} from 'react-router-dom'
import Axios from 'axios'
import { Redirect, useHistory } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'

import Nav from './Nav'
function Register_patient(){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");
    const history=useHistory();
    const [name_err, setName_err] = useState(false);
    const [email_err, setEmail_err] = useState(false);
    const [pass_err, setPassword_err] = useState(false);
    const [confPassword_err, setConfPassword_err] = useState(false);
    const type=localStorage.getItem('type');
    function Handle(data) {

        if (name.length < 2 || password.length < 4 || password !== confPassword  ) {
            if(!name && !email && !password && !confPassword)
            alert('Fill all the details CORRECTLY..')
            else if(name.length<2)
            alert('Name should be atleast 3 characters')
            else if(password.length < 4)
            alert('Weak password')
            else if(password !== confPassword)
            alert('Password not matching with confirm password')
           
        }
        else
            {
            
            let data={
                name:name,
                email:email,
                password:password,
               
            };
           

                alert('Register successfull')
            Axios.post('http://localhost:3001/register/patient',
            data ).then((resp)=>{
                                     
            });
            history.push('/login_patient');
                                  
        }
       
        setName("");
        setEmail("");
        setPassword("");
        setConfPassword("");
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
               
                <button  className="btn btn-primary">Register</button>

            </form>
        </div> </div>
    )
}
export default Register_patient;
