import React,{useState,useEffect} from 'react'
import {Link} from 'react-router-dom'
import Nav_patient from './Nav_patient'
import { Button, Card } from 'react-bootstrap';
import doctor_image from './doctor_image.jpg'
import patient_image from './patient_image.jpg'
import Axios from 'axios'
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import VideoCall from './VideoCall';
import { ContextProvider } from './Context';
import Pat_upcoming from './components/Pat_upcoming';
import Pat_past from './components/Pat_past';
import patient_img from './patient_1.webp'

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));


function Patient_dashboard(){
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [id,setId]=useState(0);
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    const [pending,setPending]=useState(0);
    const [confirmed,setConfirmed]=useState(0);
    useEffect(() => {
        const token = localStorage.getItem('token');
        const user=localStorage.getItem('user');
        
        const id=localStorage.getItem('id');
        let pid=parseInt(id);
        console.log(user);
        console.log('id:'+id);
                setEmail(user);
                Axios.post('http://localhost:3001/user/patient',{email:user}).then((resp)=>{
                    setId(localStorage.getItem("id"));
                    // console.log(resp.data);
                    setName(resp?.data[0]?.name);
                  //  console.log("id in pat dash",localStorage.getItem("id"));
                    })
     Axios.post('http://localhost:3001/user/patient/pending',{patient_id:id}).then((response)=>{
          setPending(response?.data?.length)  
          
     })
        Axios.post('http://localhost:3001/user/patient/confirmed', { patient_id: id }).then((response) => {
            setConfirmed(response?.data?.length)
            
        })
    },[]);
    return(
        <>
        <div> 
            <h1>hello</h1>
            <Nav_patient  name={name}/>
            <AppBar position="static">
                <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                    <Tab label="Profile" {...a11yProps(0)} />
                    <Tab label="Upcoming Appointment" {...a11yProps(1)} />
                    <Tab label="Past Appointment" {...a11yProps(2)} />
                    <Tab label="Video Call" {...a11yProps(3)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                    Profile
                 <div style={{ 'display': 'flex', 'margin': '50px' }}>
                        <Card style={{ width: '25rem', 'margin': "auto", backgroundColor: "#FFDEAD" }}>
                            <Card.Body>
                                <Card.Img variant="top" src={patient_img} />
                                <br /><br />

                            </Card.Body>
                        </Card>
                        <Card style={{ width: '35rem', height: '25rem', 'margin': "auto", backgroundColor: "#FFFACD" }}>
                            <Card.Body>
                                <Card.Title><h1 style={{ fontSize: "40px", fontFamily: "Times New Roman" }}>Profile</h1></Card.Title>
                                <br /><br />
                                <Card.Text>
                                    <p style={{ fontSize:"20px",fontFamily: "Times New Roman", }}> Name: {name}</p>
                                    <p style={{ fontSize:"20px",fontFamily: "Times New Roman", }}> Email: {email}</p>
                                    <p style={{ fontSize:"20px",fontFamily: "Times New Roman", }}> Pending Appointments: {pending}</p>
                                    <p style={{ fontSize:"20px",fontFamily: "Times New Roman", }}> Confirmed Appointments: {confirmed}</p>

                                </Card.Text>

                            </Card.Body>
                        </Card>

                    </div>
</TabPanel>
            <TabPanel value={value} index={1}>
               <Pat_upcoming id={id} />
</TabPanel>
            <TabPanel value={value} index={2}>
                <Pat_past id={id} />
</TabPanel>
            <TabPanel value={value} index={3}>
            <ContextProvider>
            <VideoCall />
          </ContextProvider>
</TabPanel>
            
    </div>
           
</>
    )
}
export default Patient_dashboard;