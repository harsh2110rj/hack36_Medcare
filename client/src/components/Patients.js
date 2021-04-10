import React from 'react'
import {useState,useEffect} from 'react';
import Axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    table: {
      minWidth: 1350,
    },
  });
  
const Patients = () => {
    const classes = useStyles();

    const [patients,setPatients]=useState([]);

    useEffect(() => {  
        Axios.get('http://localhost:3001/patientList/',{
          id:localStorage.getItem("id")
        }).then((res)=>{
            setPatients(res.data);
        })        

        },[]);
        const changeLink=(e,id)=>{
            if(e.target.value.length>=20)
            {
                console.log("sending");
            //  Axios.post('http://localhost:5000/updateLink/',{
            //         id:id,
            //         link:e.target.value
            //  }).then()
        }
        }
        const type=localStorage.getItem("type");

        if(type=="doctor")
        {
    return (
        <div>
            <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
          
            <TableCell align="center">Patient</TableCell>
            <TableCell align="center">Time</TableCell>
            <TableCell align="center">Date</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Link</TableCell>
           
          </TableRow>
        </TableHead>
        <TableBody>
          {patients.map((row) => (
            <TableRow key={row.ID}>
              <TableCell align="center">{row.Name}</TableCell>
              <TableCell align="center">{row.Time}</TableCell>
              <TableCell align="center">{row.Date}</TableCell>
              <TableCell align="center">{row.Status}</TableCell>
              <TableCell align="center">
                  <input type="text" value={row.Link} onChange={(e)=>changeLink(e,row.ID,)} />
                  {/* <button onClick={()=>update(row.ID,row.Link)} >Update Link</button> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>  
        </div>
    )
          }
          else
          {
            return (
              <div>
                
              </div>
          )
            }
}

export default Patients
