import React from 'react'
import {Link} from 'react-router-dom'

function Nav_doctor(props)
{
    return(
        <div>
            <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
          <Link className="navbar-brand" to='/doctor_dashboard'>Dashboard</Link>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav ml-auto">
            <li className="nav-item">
                <span className="nav-link">{props.name}</span>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to='/doctor/pending_appointments' >Pending Appointments</Link>
              </li>
    
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
export default Nav_doctor;