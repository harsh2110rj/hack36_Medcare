import React, { useState,useEffect } from 'react'
import {Link} from 'react-router-dom'

function Nav(props)
{

    return(
        <div>
         

            <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
          <Link className="navbar-brand" to='/'>Home</Link>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                {props.type==='doctor'?<Link className="nav-link" to='/register_doctor'>Register</Link>
                :<Link className="nav-link" to='/register_patient'>Register</Link>}
              </li>
              <li className="nav-item">
              {props.type==='doctor'?<Link className="nav-link" to='/login_doctor'>Login</Link>
                :<Link className="nav-link" to='/login_patient'>Login</Link>}
              </li>
            </ul>
              <Link className="nav-link" to="/ShowForum">Show Forum</Link>
          </div>
        </div>
      </nav>

 </div>
    );
}
export default Nav;