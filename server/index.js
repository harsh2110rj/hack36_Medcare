const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express();
const bcrypt = require("bcrypt");
const port = 3001;
const jwt = require("jsonwebtoken");
const session = require("express-session");
const cookieParser = require("cookie-parser");

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

app.listen(port, () => {
    console.log('Server running...');
});