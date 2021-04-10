import React, { useState,useEffect } from "react";
import ReactDOM from "react-dom";
import Axios from 'axios'
import Popup from './Popup'
import {useHistory} from 'react-router-dom'
import './pop.css'

//payment
function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = () => {
      resolve(true)
    }
    script.onerror = () => {
      resolve(false)
    }
    document.body.appendChild(script)
  })
}

const __DEV__ = document.domain === 'localhost'
//payment

function Appointment(props) {

  // payment
  const [nameRazor, setNameRazor] = useState("Adam");

  async function displayRazorpay() {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?')
      return
    }

    const data = await fetch('http://localhost:3001/razorpay', { method: 'POST' }).then((t) =>
      t.json()
    )

    console.log(data)

    const options = {
      key: __DEV__ ? "rzp_test_ajDpqGNzQ4hAml" : 'PRODUCTION_KEY',
      currency: data.currency,
      amount: data.amount.toString(),
      order_id: data.id,
      name: 'Donation',
      description: 'Thank you for nothing. Please give us some money',
      image: 'http://localhost:3001/logo.svg',
      handler: function (response) {
        alert("Payment session ends. Wait for email notification!")
        modalClose();
      },
      prefill: {
        name: "Adam",
        email: 'test@gmail.com',
        phone_number: '9899999999'
      }
    }
    const paymentObject = new window.Razorpay(options)
    paymentObject.open()
  }
//payment


const history=useHistory();
  const [patient_name,setPatient_name]=useState("");
  
  useEffect(() => {
      const token = localStorage.getItem('token');
      const user=localStorage.getItem('user');
              Axios.post('http://localhost:3001/user/patient',{email:user}).then((resp)=>{
                  // console.log(resp.data[0].name);
                  setPatient_name(resp.data[0].name);
                  })
  },[]);

  var date = new Date();
  let curr_time=date.getHours();
  var tom_date = new Date(date);
  var day_after_tom = new Date(tom_date);
  tom_date.setDate(date.getDate() + 1);
  day_after_tom.setDate(tom_date.getDate() + 1);
  // console.log(tom_date);
  date = date.toDateString();

  tom_date = tom_date.toDateString();
  day_after_tom = day_after_tom.toDateString();
  
  // console.log(date);
  // console.log(curr_time);
  let today = date.split(' ')[1] + ' ' + date.split(' ')[2] + ' ' + date.split(' ')[3];
  let tomorrow = tom_date.split(' ')[1] + ' ' + tom_date.split(' ')[2] + ' ' + tom_date.split(' ')[3];
  let day_after_tomorrow = day_after_tom.split(' ')[1] + ' ' + day_after_tom.split(' ')[2] + ' ' + day_after_tom.split(' ')[3];
  const pid=localStorage.getItem('id');

  const [modal, setModal] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [slot,setSlot]=useState("Choose");
  const [book_Date,setBookDate]=useState("Choose");
  const [arr1,setArr1]=useState([]);
  const [arr2,setArr2]=useState([]);
  const [arr3,setArr3]=useState([]);


  function handleSubmit(e) {
   let pat_id=parseInt(pid);
    if(!email || !mobile || !reason || slot==="Choose" || book_Date==="Choose")
    {alert('Fill all the details CORRECTLY..')}
    else{
      displayRazorpay();

       let data={
         patient:patient_name, email:email , reason:reason , slot:slot, date:book_Date, mobile:mobile , doctor:props.doctor, doc_id:props.id, pat_id: pat_id
       }

       Axios.post('http://localhost:3001/book/confirm',data).then((resp)=>{  
         console.log(resp);                                   
      });
setBookDate("Choose");
setEmail("");
setReason("");
setSlot("Choose");
setMobile("");
      
    }
    // history.push('/patient/book');
    


    e.preventDefault();
    return 0;
   
  }

  function modalOpen() {
    setModal(true);
  }

  function modalClose() {
    setModal(false);
  }

  function EmailHandler(e){
    setEmail(e.target.value);
  }

  function MobileHandler(e){
    setMobile(e.target.value);
  }

  function SlotHandler(e){
    setSlot(e.target.value);
  }
  function DateHandler(e){
    setBookDate(e.target.value);
    const temp=['9:00-10:00','10:00-11:00','11:00-12:00','14:00-15:00','15:00-16:00','16:00-17:00'];
console.log(e.target.value);
    if(e.target.value===today)
    {
     
      const Add=[];
      let data={doctor:props.doctor,date:today};
      let Array=[];
      Axios.post('http://localhost:3001/booked',data).then((resp)=>{
           Array=Array.concat(resp.data);
           console.log(Array);

    })
      Axios.post('http://localhost:3001/book',data).then((resp)=>{
        Array=Array.concat(resp.data);
        console.log(Array);
        for(let i=0;i<temp.length;i++)
        {
          let check;
          if(temp[i][2]===':')
          check=temp[i][0]+temp[i][1];
          else
          check=temp[i][0];
          console.log(check);
          if(!(Array.includes(temp[i])) && curr_time<check){
            Add.push(temp[i]);
          }
        }
        console.log(Add);
        setArr1(Add);
      })
      
    }
    else if(e.target.value===tomorrow){
     
      const Add=[];
      let data={doctor:props.doctor,date:tomorrow};
      let Array=[];
      Axios.post('http://localhost:3001/booked',data).then((resp)=>{
           Array=Array.concat(resp.data);
           console.log(Array);

    })
     
      Axios.post('http://localhost:3001/book',data).then((resp)=>{
        Array=Array.concat(resp.data);
        console.log(Array);
        for(let i=0;i<temp.length;i++)
        {
          if(!(Array.includes(temp[i]))){
            Add.push(temp[i]);
          }
        }
        setArr2(Add);
      })
    }
    else if(e.target.value===day_after_tomorrow){
      const Add=[];
      let data={doctor:props.doctor,date:day_after_tomorrow};
      let Array=[];
      Axios.post('http://localhost:3001/booked',data).then((resp)=>{
           Array=Array.concat(resp.data);
           console.log(Array);

    })
     
      Axios.post('http://localhost:3001/book',data).then((resp)=>{
        Array=Array.concat(resp.data);
        console.log(Array);
        for(let i=0;i<temp.length;i++)
        {
          // console.log(temp[i]);
          if(!(Array.includes(temp[i]))){
            Add.push(temp[i]);
          }
        }
        console.log(Add);
        setArr3(Add);
      })
    }
    return 0;
  }
function ReasonHandler(e){
  setReason(e.target.value);
}
  return (

    <div className="App" >

      <a href="javascript:;" onClick={modalOpen}>
        {props.doctor}
      </a>
      <Popup show={modal} handleClose={modalClose}>
        <h2>Book your appointment</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group" >
            <label>Name: </label>
            <input type='text' className="form-control" placeholder='Enter patient name...' value={patient_name} readOnly= {true}/>
          </div>
          <div className="form-group">
            <label>Phone No. </label>
            <input type='text' className="form-control" placeholder='Enter mobile number..' value={mobile} onChange={MobileHandler}/>
          </div>
          <div className="form-group">
            <label>Email: </label>
            <input type='email' className="form-control" placeholder='Enter email..' value={email} onChange={EmailHandler}/>
          </div>
          <div className="form-group">
            <select value={book_Date} onChange={DateHandler} >
              <option value="Choose">Select the date</option>
              <option value={today}>{today}</option>
              <option value={tomorrow}>{tomorrow}</option>
              <option value={day_after_tomorrow}>{day_after_tomorrow}</option>
            </select>
            </div>

            {
              
              book_Date===today?
              <div className="form-group">
            <select value={slot} onChange={SlotHandler} >
              <option value="Choose">Choose from the available slots</option>
             {arr1.map((item,i)=>(
               <option value={item}>{item}</option>
             ))}
            </select>
            </div>  :  book_Date===tomorrow ?
            <div className="form-group">
            <select value={slot} onChange={SlotHandler} >
              <option value="Choose">Choose from the available slots</option>
             {arr2.map((item,i)=>(
               <option value={item}>{item}</option>
             ))}
            </select>
            </div>  :  book_Date===day_after_tomorrow ?
            <div className="form-group">
            <select value={slot} onChange={SlotHandler} >
              <option value="Choose">Choose from the available slots</option>
             {arr3.map((item,i)=>(
               <option value={item}>{item}</option>
             ))}
            </select>
            </div>  : ' '
            
            }
    
            
         
          <div className="form-group">
            <label>Reason: </label>
            <input type='textarea' className="form-control" placeholder='reason ..' value={reason} onChange={ReasonHandler} />
          </div>
          <button className="btn btn-primary">Schedule</button>

        </form>


      </Popup>
    </div>
  );
}


export default Appointment;
