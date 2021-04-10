const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express();
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const port = 3001;
const jwt = require("jsonwebtoken");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const Razorpay = require('razorpay')
const shortid = require('shortid')


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "DELETE"],
    credentials: true
}));
app.use(cookieParser());
const saltRounds = 10;

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'user',
});


app.get('/', (req, res) => {
    res.send('hello');
})

const verifyJWT = (req, res, next) => {

    const token = req.headers["x-access-token"];

    if (!token) {
        res.sendStatus(403);
    } else {
        jwt.verify(token, "mykey", (err, decoded) => {
            if (err) {
                res.sendStatus(403);
            }
            else {
                req.userId = decoded.id;
                next();
            }
        })
    }
}
app.get('/isUserAuth', verifyJWT, (req, res) => {
    res.send("you are authenticated")
});
app.post('/user/doctor', (req, res) => {
    const email = req.body.email;

    const sqlSelect = "SELECT * FROM doctor_details WHERE email=?;"
    db.query(sqlSelect, email, (err, result) => {

        res.send(result);
    })
})
app.post('/user/patient', (req, res) => {
    const email = req.body.email;

    const sqlSelect = "SELECT * FROM patient_details WHERE email=?;"
    db.query(sqlSelect, email, (err, result) => {

        res.send(result);
    })
})
app.post('/show/doctor/category',(req,res)=>{
    const category=req.body.category;
    const sqlSelect = "SELECT * FROM doctor_details WHERE category=?;"
    db.query(sqlSelect, category, (err, result) => {const arr=[];
    for(let i=0;i<result.length;i++)
    {
        arr.push(result[i].name);
    }
    // console.log(arr);
        res.send(arr);
    })
})

app.post('/login/doctor', (req, res) => {

    const email = req.body.email;
    const password = req.body.password;
    const sqlSelect = "SELECT * FROM doctor_details WHERE email=?;"
    db.query(sqlSelect, email, (err, result) => {
        if (err)
            res.send({ error: err });
        else {
            // console.log(result.length);
            if (result.length > 0) {
                bcrypt.compare(password, result[0].password, (err, response) => {
                    // console.log(password==result[0].password);
                    if (response) {

                        const id = result[0].id;
                        const token = jwt.sign({ id }, "mykey", {
                            expiresIn: 60 * 60 * 24
                        })

                        // res.send(result);
                        res.json({ auth: true, token: token, result: result[0], id: id });
                    } else {
                        res.json({ auth: false, message: "Wrong username/password" })
                    }

                })
            }
            else
                res.json({ auth: false, message: 'User does not exist' });
        }

    })
})
app.post('/login/patient', (req, res) => {

    const email = req.body.email;
    const password = req.body.password;
    const sqlSelect = "SELECT * FROM patient_details WHERE email=? ;"
    db.query(sqlSelect, email, (err, result) => {
        if (err)
            res.send({ error: err });
        else {
            // console.log(result.length);
            if (result.length > 0) {
                bcrypt.compare(password, result[0].password, (err, response) => {
                    // console.log(password==result[0].password);
                    if (response) {

                        const id = result[0].id;
                        const token = jwt.sign({ id }, "mykey", {
                            expiresIn: 60 * 60 * 24
                        })

                        // res.send(result);
                        res.json({ auth: true, token: token, result: result });
                    } else {
                        res.json({ auth: false, message: "Wrong username/password" })
                    }

                })
            }
            else
                res.json({ auth: false, message: 'User does not exist' });
        }

    })
})
app.post('/register/doctor', (req, res) => {

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const category = req.body.category;
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err)
            console.log(err);
        const sqlInsert = "INSERT INTO doctor_details (name,email,password,category) VALUES (?,?,?,?);"
        db.query(sqlInsert, [name, email, hash, category], (err, result) => {

        });
    })
});
app.post('/register/patient', (req, res) => {

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err)
            console.log(err);
        const sqlInsert = "INSERT INTO patient_details (name,email,password) VALUES (?,?,?);"
        db.query(sqlInsert, [name, email, hash], (err, result) => {

        });
    })

});
app.post('/patientList', (req, res) => {
    const query = "SELECT * from appointment_details WHERE doc_id=?";
    db.query(query, [req.body.id], (err, result) => {
        res.send(result);
    })
});

app.post('/book/confirm',(req, res)=>{
    const doctor=req.body.doctor;
    const patient=req.body.patient;
    const date=req.body.date;
    const slot=req.body.slot;
    const mobile=req.body.mobile;
    const email=req.body.email;
    const reason=req.body.reason;
    
    const sqlInsert="INSERT INTO  appointment_details (doctor,patient,date,slot,mobile,email,reason) VALUES (?,?,?,?,?,?,?);"
    db.query(sqlInsert,[doctor,patient,date,slot,mobile,email,reason], (err, result) =>{
    })
})
app.post('/book',(req, res)=>{
    const doctor=req.body.doctor;
    const date=req.body.date;
    const sqlSelect="SELECT slot from appointment_details where doctor=? and date=?;"
    db.query(sqlSelect,[doctor,date], (err, result) =>{
        const temp=[];
        for(let i=0;i<result.length;i++)
        {
            temp.push(result[i].slot);
        }
        res.send(temp);
    })
})
app.post('/booked',(req, res)=>{
    const doctor=req.body.doctor;
    const date=req.body.date;
    const sqlSelect="SELECT slot from confirmed_appointment where doctor=? and date=?;"
    db.query(sqlSelect,[doctor,date], (err, result) =>{
        const temp=[];
        for(let i=0;i<result.length;i++)
        {
            temp.push(result[i].slot);
        }
        res.send(temp);
    })
})
app.post('/getBookings',(req,res)=>{
    const doctor=req.body.doctor;
    // console.log(doctor);
    const sqlSelect="SELECT patient,reason,date,slot,mobile,email FROM appointment_details where doctor=?;"
    db.query(sqlSelect,doctor,(err,result)=>{
        // console.log(result);
        res.send(result);
    })
})
app.post('/deleteBooking',(req,res)=>{
    const slot=req.body.slot;
    const patient=req.body.patient;
    const date=req.body.date;
    const doctor=req.body.doctor;
    const sqlDelete="DELETE FROM appointment_details where doctor=? and patient=? and date=? and slot=?;"
    db.query(sqlDelete,[doctor,patient,date,slot],(err,result)=>{
console.log(result);
    })

})

app.post('/confirm',(req,res)=>{
const email=req.body.email;
    const output=` 
    <p> Your appointment with ${req.body.doctor} has been confirmed and the your appointment details are as follows:</p>
    <ul>
    <li> Patient Name : ${req.body.patient} </li>
    <li> Date of Appointment : ${req.body.date} </li>
    <li> Slot : ${req.body.slot} </li>
    </ul>
    `;
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: "healthmedcare0@gmail.com" , // generated ethereal user
          pass: "medcare@123", // generated ethereal password
        },
        tls:{
            rejectUnauthorized: false
        }
      });
    
      // send mail with defined transport object
      let info={
        from: '"MedCare" <healthmedcare0@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Appointment Confirmed", // Subject line
        text: "Hello world?", // plain text body
        html: output, // html body
      };
      transporter.sendMail(info, function (error, response) {
        if (error) {
            console.log(error);
        }
        else {
            console.log("mail sent");
        }
    });
      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
})

app.post('/confirmedBooking',(req,res)=>{
    const doctor=req.body.doctor;
    const patient=req.body.patient;
    const date=req.body.date;
    const slot=req.body.slot;
    const mobile=req.body.mobile;
    console.log('why');
    // const email=req.body.email;
    // const reason=req.body.reason;
    
    const sqlInsert="INSERT INTO  confirmed_appointment (doctor,patient,date,slot,mobile) VALUES (?,?,?,?,?);"
    db.query(sqlInsert,[doctor,patient,date,slot,mobile], (err, result) =>{
    })
})




// VIDEO CHAT PART

const server=require("http").createServer(app);
const io=require("socket.io")(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
});

io.on("connection",(socket)=>{
    socket.emit("me",socket.id);
    socket.on("disconnect",()=>{
        socket.broadcast.emit("callEnded")
    });
    socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	});
});


//forum code starts

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.post("/api/update", (req, res) => {

    const discussion_id = req.body.discussion_id;
    const discussion_detail = req.body.discussion_detail;

    const sqlUpdate = "UPDATE comments SET discussion_detail = ? WHERE discussion_id = ? ;";
    db.query(sqlUpdate, [discussion_detail, discussion_id], (err, result) => {
        res.send("Hello");
        console.log("update ho gaya");
    })

})
app.post("/api/insert", (req, res) => {

    const discussion_id = req.body.discussion_id;
    const discussion_detail = req.body.discussion_detail;

    const sqlInsert = "INSERT INTO comments (discussion_id, discussion_detail) VALUES (?,?);";
    db.query(sqlInsert, [discussion_id, discussion_detail], (err, result) => {
        res.send("Hello");
        console.log("Inside insert: id is = " + discussion_id);
    })
})

app.get("/api/get/:id", (req, res) => {

    const discussion_id = req.params.id;
    const sqlSelect = "SELECT discussion_detail FROM comments WHERE discussion_id = ?;";
    // console.log("id in sqlSelect = "+discussion_id);
    db.query(sqlSelect, discussion_id, (err, result) => {
        res.send(result);
        // console.log("Inside api/get");
        // console.log(result);
    })
})
app.get("/api/get", (req, res) => {


    const sqlSelect = "SELECT * FROM comments;";
    // console.log("id in sqlSelect = "+discussion_id);
    db.query(sqlSelect, (err, result) => {
        res.send(result);
        // console.log("Inside api/get/threads");
        // console.log(result);
    })
})
//forum code ends

//payment code starts
app.use(cors())
app.use(bodyParser.json())

const razorpay = new Razorpay({
    key_id: "rzp_test_ajDpqGNzQ4hAml",
    key_secret: "aNLAATtF4gt7xw4fJkygTVgv"
})

app.get('/logo.svg', (req, res) => {
    res.sendFile(path.join(__dirname, 'logo.svg'))
})

app.post('/verification', (req, res) => {
    // do a validation
    const secret = '12345678'

    console.log(req.body)

    const crypto = require('crypto')

    const shasum = crypto.createHmac('sha256', secret)
    shasum.update(JSON.stringify(req.body))
    const digest = shasum.digest('hex')

    console.log(digest, req.headers['x-razorpay-signature'])

    if (digest === req.headers['x-razorpay-signature']) {
        console.log('request is legit')
        // process it
        require('fs').writeFileSync('payment1.json', JSON.stringify(req.body, null, 4))
    } else {
        // pass it
    }
    res.json({ status: 'ok' })
})

app.post('/razorpay', async (req, res) => {
    const payment_capture = 1
    const amount = 499
    const currency = 'INR'

    const options = {
        amount: amount * 100,
        currency,
        receipt: shortid.generate(),
        payment_capture
    }

    try {
        const response = await razorpay.orders.create(options)
        console.log(response)
        res.json({
            id: response.id,
            currency: response.currency,
            amount: response.amount
        })
    } catch (error) {
        console.log(error)
    }
})
//payment code ends

server.listen(port, () => {
    console.log('Server running...');
});