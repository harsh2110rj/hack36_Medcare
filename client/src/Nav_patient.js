import React from 'react'
import {Link} from 'react-router-dom'

function Nav_patient(props)
{
    return(
        <div>
            <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
          <Link className="navbar-brand" to='/patient_dashboard'>Dashboard</Link>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav ml-auto">
            <li className="nav-item">
                <span className="nav-link">{props.name}</span>  
              </li>
              <Link className="nav-link" to="/ShowForum">Show Forum</Link>
              <li className="nav-item">
                <Link className="nav-link" to='/logout' >Logout</Link>
              </li>
              
        
            </ul>
          </div>
        </div>
      </nav>

 </div>
    );
}
export default Nav_patient;