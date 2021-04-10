const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express();
const bcrypt = require("bcrypt");
const port = 3001;
const jwt=require("jsonwebtoken");
const session = require("express-session");
const cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST","DELETE"],
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

const verifyJWT=(req,res,next)=>{
    
    const token=req.headers["x-access-token"];

    if(!token){
        res.sendStatus(403);
    }else{
        jwt.verify(token,"mykey",(err,decoded)=>{
            if(err){
                res.sendStatus(403);
            }
            else{
                req.userId=decoded.id;
                next();
            }
        })
    }
}
app.get('/isUserAuth',verifyJWT,(req,res)=>{
    res.send("you are authenticated")
});
app.post('/user/doctor',(req,res)=>{
    const email=req.body.email;
   
    const sqlSelect = "SELECT * FROM doctor_details WHERE email=?;"
    db.query(sqlSelect, email, (err, result) => {
    
        res.send(result);
    })
})
app.post('/user/patient',(req,res)=>{
    const email=req.body.email;
   
    const sqlSelect = "SELECT * FROM patient_details WHERE email=?;"
    db.query(sqlSelect, email, (err, result) => {
    
        res.send(result);
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

                        const id=result[0].id;
                        const token=jwt.sign({id},"mykey",{
                            expiresIn:60*60*24
                        })
                       
                        // res.send(result);
                        res.json({auth:true,token:token,result:result});
                    } else {
                        res.json({ auth:false,message: "Wrong username/password" })
                    }

                })
            }
            else
                res.json({auth:false, message: 'User does not exist' });
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

                        const id=result[0].id;
                        const token=jwt.sign({id},"mykey",{
                            expiresIn:60*60*24
                        })
                        
                        // res.send(result);
                        res.json({auth:true,token:token,result:result});
                    } else {
                        res.json({ auth:false,message: "Wrong username/password" })
                    }

                })
            }
            else
                res.json({auth:false, message: 'User does not exist' });
        }

    })
})
app.post('/register/doctor', (req, res) => {

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const category=req.body.category;
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err)
            console.log(err);
        const sqlInsert = "INSERT INTO doctor_details (name,email,password,category) VALUES (?,?,?,?);"
        db.query(sqlInsert, [name, email, hash,category], (err, result) => {

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

app.listen(port, () => {
    console.log('Server running...');
});