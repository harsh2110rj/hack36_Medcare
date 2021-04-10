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

const Pat_upcoming = (props) => {
    const classes = useStyles();
    const [id, setId] = React.useState("");
    const [patients, setPatients] = React.useState([]);

    useEffect(() => {
        setId(props.id);
      //  console.log("id in upcoming",props.id);
        Axios.post('http://localhost:3001/appointmentList/', {
            id: props.id
        }).then((res) => {
           // console.log(res.data);
            setPatients(res.data);
        })

    }, []);
    return (
        <div>
             <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>

                            <TableCell align="center">Doctor</TableCell>
                            <TableCell align="center">Time</TableCell>
                            <TableCell align="center">Date</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Mobile</TableCell>
                            <TableCell align="center">Link</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {patients.map((row) => (
                            <TableRow key={row.ID}>
                                <TableCell align="center">{row.doctor}</TableCell>
                                <TableCell align="center">{row.slot}</TableCell>
                                <TableCell align="center">{row.date}</TableCell>
                                <TableCell align="center">{row.status}</TableCell>
                                <TableCell align="center">{row.mobile}</TableCell>
                                <TableCell align="center">{row.Link}</TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default Pat_upcoming