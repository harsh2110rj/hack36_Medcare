import React from 'react'
import { useEffect } from 'react';
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


const Doc_past = (props) => {
    const month={'Jan':0,'Feb':1,'Mar':2,'Apr':3,'Mar':4,'May':5,'Jun':6,'Jul':7,'Aug':8,'Sep':9,'Oct':10,'Nov':11,'Dec':12};
    const classes = useStyles();
    const [id, setId] = React.useState("");
    const [patients, setPatients] = React.useState([]);
    var date = new Date();
    let curr_time=date.getHours();
    
    // // console.log(tom_date);
    date = date.toDateString();
    let today = date.split(' ')[1] + ' ' + date.split(' ')[2] + ' ' + date.split(' ')[3];
  
    
    useEffect(() => {
        setId(props.id);
        Axios.post('http://localhost:3001/patientList/', {
            id: props.id
        }).then((res) => {
            let temp=[];
            temp.push(res.data);
            let add=[];
           for(let i=0;i<temp.length;i++)
           {
               for(let j=0;j<temp[i].length;j++)
               {
                   let time;
                   if(temp[i][j].slot[0]===':')
                   time=temp[i][j].slot[0][0];
                   else
                   time=temp[i][j].slot[0]+temp[i][j].slot[0];
                   
                   if(today==temp[i][j].date)
                   { 
                       if(time<curr_time)
                       {
                           add.push(temp[i][j]);
                       }
                   }
                   else{
                       const dd=temp[i][j].date.split(' ')[1]; 
                       const yyyy=temp[i][j].date.split(' ')[2]; 
                       const mon=temp[i][j].date.split(' ')[0];
                       console.log(dd);
                       console.log(mon);
                       console.log(yyyy);
                       console.log(date.split(' ')[2]);
                       console.log(date.split(' ')[1]);
                       console.log(date.split(' ')[3]);
                       console.log(month[date.split(' ')[1]]);
                       console.log(month[mon]);
                       if(yyyy<date.split(' ')[3]) 
                       add.push(temp[i][j]);
                     
                       else if(yyyy===date.split(' ')[3] && month[mon]<month[date.split(' ')[1]]){
                        add.push(temp[i][j]);
                       }
                       else if(month[mon]===month[date.split(' ')[1]] && dd<date.split(' ')[2])
                       {
                        add.push(temp[i][j]);   
                       }

                        
                    }
                }
           }
            setPatients(add);
            console.log(add);
        })

    }, []);


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
                            <TableCell align="center">Reason</TableCell>
                            <TableCell align="center">Mobile</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {patients.map((row) => (
                            
                            <TableRow key={row.ID}>
                                <TableCell align="center">{row.patient}</TableCell>
                                <TableCell align="center">{row.slot}</TableCell>
                                <TableCell align="center">{row.date}</TableCell>
                                <TableCell align="center">{row.status}</TableCell>
                                <TableCell align="center">{row.reason}</TableCell>
                                <TableCell align="center">{row.mobile}</TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default Doc_past
