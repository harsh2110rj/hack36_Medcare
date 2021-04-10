import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Card } from 'react-bootstrap';
import doctor_image from './doctor_image.jpg'
import patient_image from './patient_image.jpg'

import Navbar from './Navbar'
function Home() {

    function Handle1() {
        localStorage.setItem("type", 'doctor');
    }
    function Handle2() {
        localStorage.setItem("type", 'patient');
    }
    return (
        <div>

            <div style={{ 'display': 'flex', 'margin': '50px' }}>
                <Card style={{ width: '38rem', 'margin': 'auto' }}>
                    <Card.Img variant="top" src={doctor_image} />
                    <Card.Body>
                        <Card.Title>Doctors</Card.Title>
                        <Card.Text>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer convallis mi a metus tempus aliquam. In feugiat ex id interdum viverra. Mauris finibus dui sed.</Card.Text>
                        <Link to='/login_doctor' className='login'><Button variant="primary" onClick={Handle1}>
                            <h2>Doctor Login</h2>
                        </Button></Link>
                    </Card.Body>
                </Card>
                <Card style={{ width: '38rem', 'margin': 'auto' }}>
                    <Card.Img variant="top" src={patient_image} />
                    <Card.Body>
                        <Card.Title>Patients</Card.Title>
                        <Card.Text>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer convallis mi a metus tempus aliquam. In feugiat ex id interdum viverra. Mauris finibus dui sed.</Card.Text>
                        <Link to='/login_patient' className='login'><Button variant="primary" onClick={Handle2}>
                            <h2>Patient Login</h2>
                        </Button></Link>
                    </Card.Body>
                </Card>
            </div>
        </div>
    )
}
export default Home;