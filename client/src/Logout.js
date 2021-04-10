import React, { useEffect } from 'react'
import {Link} from 'react-router-dom'
import {useHistory} from 'react-router-dom'
import Axios from 'axios'

function Logout(){
    const history=useHistory();
    useEffect(()=>{
        const type = localStorage.getItem('type');
        localStorage.removeItem('token');
        localStorage.removeItem('type');
        localStorage.removeItem('user');
        localStorage.removeItem('id');
        localStorage.removeItem('type');
        history.push('/');
    },[]);
    return(
        <div> 
            <h1>logout</h1>
    </div>
    )
}
export default Logout;