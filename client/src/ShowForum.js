import logo from './logo.svg';
import ShowThread from './ShowThread'
import './ShowThread.css';
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Question from './Question';
import { render } from '@testing-library/react';
import Axios from 'axios';
import Nav_doctor from './Nav_doctor';
import Nav_patient from './Nav_patient';

var cur_id = 0;
var indexOfSelectedThread = 0;
// var defaultThreads;
const SendClickedItemId = (id) => {
    indexOfSelectedThread = id;
}
// if (localStorage && localStorage.getItem('threads')) {
//   defaultThreads = JSON.parse(localStorage.getItem('threads'));
// }
var initialThreadArr = [
    {
        id: 0,
        title: "",
        author: "",
        date: Date.now(),
        content: "",
        comments: []
    }
]
function ShowForum() {
    const [threadArr, setThreadArr] = useState(initialThreadArr);
    const [submitTask, setSubmitTask] = useState(false)

    useEffect(() => {
        console.log("useEffect called");
        Axios.get("http://localhost:3001/api/get"
        ).then((response) => {

            var currentThreadArr = [];
            for (let i in response.data) {
                console.log("useEffect: i is :")
                console.log(response.data[i]);
                currentThreadArr.push(JSON.parse(response.data[i].discussion_detail))
            }
            setThreadArr(currentThreadArr);
            cur_id = currentThreadArr.length;
            console.log("useEffect: threadArr is :")
            console.log(response);
        });

    }, []);
    console.log("Line 51 " + cur_id);
    const [questionDetail, setQuestionDetail] = useState("");
    const QuestionEvent = (event) => {
        setQuestionDetail(event.target.value);
    }
    var mArrString = "";

    function submitQuestion(queryString) {
        // mArrString = JSON.stringify(defaultThread[id - 1]);
        console.log("App mArrString = " + queryString);
        Axios.post("http://localhost:3001/api/insert",
            {
                discussion_id: cur_id+1,
                discussion_detail: queryString
            }
        )
    }
    function hideConfirmationDialog() {
        if (!submitTask) {
            document.querySelector(".ShowThreadconfirm-bg").style.display = "flex"
            document.querySelector(".ShowThreadcontainer").style.display = "flex"
            setSubmitTask(true)
        } else {
            document.querySelector(".ShowThreadconfirm-bg").style.display = "none"
            document.querySelector(".ShowThreadcontainer").style.display = "none"
            setSubmitTask(false)
        }
    }
    const addNewQuestion = () => {

        var arrElem = {
            id: cur_id+1 ,
            title: questionDetail,
            author: "You",
            date: Date.now(),
            content: "Thread content " + cur_id+1 ,
            comments: []
        }
        threadArr.push(arrElem);
        mArrString = JSON.stringify(arrElem);
        // setThreadArr(threadArr);
        submitQuestion(mArrString);
        setQuestionDetail("");
        cur_id += 1;
        hideConfirmationDialog();
    }

    // const showResponse=()=>{
    //   Axios.get("http://localhost:3001/api/get"
    //   ).then((response) => {

    //     const currentThreadArr = JSON.parse(response.data[0].discussion_detail);
    //     console.log("SHOW Response: threadArr is :")
    //     console.log(currentThreadArr.author);
    //   });

    // }
    const handleConfirmationBox = () => {
        hideConfirmationDialog();
    }

    return (
        <>
        {localStorage.getItem("type")=="doctor"? <Nav_doctor name="Doctor" />:<Nav_patient name="Patient" />}
        
      <br/><br/><br/>
            <div className="ShowThreadmain">
                <ol>
                    {threadArr?.map(
                        (thread) => {

                            return (
                                // <li class="row">
                                //   <Link to="ShowThread" id={thread.id}>
                                //     <h4 class="title">
                                //       {thread.title}
                                //     </h4>
                                //     <div class="bottom">
                                //       <p class="timestamp">
                                //         {new Date(thread.date).toLocaleString()}
                                //       </p>
                                //       <p class="comment-count">
                                //         {thread.comments.length} comments
                                //       </p>
                                //     </div>
                                //   </Link>
                                // </li>
                                <>
                                    <div className="ShowThreadquestion_card">
                                        <Question
                                            id={thread?.id}
                                            title={thread?.title}
                                            date={thread?.date}
                                            commentCount={thread?.comments?.length}
                                            author={thread?.author}
                                            onSelectItem={SendClickedItemId}
                                        />
                                    </div>
                                    <br />
                                </>
                            );
                        }
                    )

                    }
                </ol>
            </div>
            <textarea onChange={QuestionEvent} name="questionDetail" value={questionDetail}></textarea>
            <div className="ShowThreadcontainer">
                <div className="ShowThreadconfirmation-text">
                    Do you really want to submit this question?
    </div>
                <div className="ShowThreadbutton-container">
                    <button
                        className="ShowThreadcancel-button"
                        onClick={() => handleConfirmationBox()}>
                        Cancel
      </button>
                    <button
                        className="ShowThreadconfirmation-button"
                        onClick={addNewQuestion}>
                        Submit
        </button>
                </div>
            </div>
            <button onClick={() => { handleConfirmationBox() }}>
                Add new Question
    </button>
            <div
                className="ShowThreadconfirm-bg"
                onClick={() => handleConfirmationBox()}>
            </div>
        </>
    );
}
const ShowThreadWithId = () => {
    return (
        <>
            <ShowThread
                id={indexOfSelectedThread}
            />
        </>
    );
}
export default ShowForum;
export { ShowThreadWithId};