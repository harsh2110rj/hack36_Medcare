
import { Route, Switch } from 'react-router-dom'
import React from 'react'
import Nav from './Nav'
import Login_doctor from './Login_doctor'
import Register_doctor from './Register_doctor'
import Login_patient from './Login_patient'
import Register_patient from './Register_patient'
import Doctor_dashboard from './Doctor_dashboard'
import Patient_dashboard from './Patient_dashboard'
import Logout from './Logout'
import Home from './Home'
import ShowThread from './ShowThread';
import { ShowThreadWithId } from './ShowForum';
import ShowForum from './ShowForum'

function App() {

  return (
    <div className="App">
      <Nav />
      <Switch>
        <Route exact path='/'><Home /></Route>
        <Route path="/login_doctor"><Login_doctor /></Route>
        <Route path="/register_doctor"><Register_doctor /></Route>
        <Route path="/login_patient"><Login_patient /></Route>
        <Route path="/register_patient"><Register_patient /></Route>
        <Route path="/doctor_dashboard"><Doctor_dashboard /></Route>
        <Route path="/patient_dashboard"><Patient_dashboard /></Route>
        <Route path="/logout"><Logout /></Route>
        <Route exact path="/ShowForum" component={ShowForum} />
        <Route exact path="/ShowThread" component={ShowThreadWithId} />
      </Switch>

    </div>

  )
}

export default App;
