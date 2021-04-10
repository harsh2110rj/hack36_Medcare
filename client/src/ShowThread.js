import logo from './logo.svg';
import './ShowThread.css';
import { useEffect, useState } from 'react';
import Axios from 'axios';
var initialThread = [
    {
        id: 0,
        title: "",
        author: "",
        date: Date.now(),
        content: "",
        comments: [
            {
                author: "",
                date: Date.now(),
                content: ""
            }
        ]
    }
]
var id = 0;
function ShowThread(props) {
    const [thread, setThread] = useState(initialThread);
    id = props.id;

    useEffect(() => {
        console.log("useEffect called");
        Axios.get(`http://localhost:3001/api/get/${id}`,
            { discussion_id: id }
        ).then((response) => {
            const currentThread = JSON.parse(response?.data[0]?.discussion_detail);
            setThread(currentThread);
            console.log("useEffect: thread is :")
            console.log(thread);
        });
    }, []);

    const [commentDetail, setCommentDetail] = useState("");
    const CommentEvent = (event) => {
        setCommentDetail(event.target.value);
    }
    const addNewComment = () => {
        var newComment = {
            author: "You",
            date: Date.now(),
            content: commentDetail
        }
        thread?.comments?.push(newComment);
        const queryString = JSON.stringify(thread);
        Axios.post("http://localhost:3001/api/update",
            {
                discussion_id: id,
                discussion_detail: queryString
            }
        )
        setCommentDetail("");
    }
    return (
        <>
            <div class="ShowThreadtop-bar">
                <h1>
                    Comments
            </h1>
            </div>
            <br />
            <h4 class="ShowThreadtitle">
                Question:  {thread?.title}
            </h4>
            <br />
            <div class="ShowThreadbottom">
                <p class="ShowThreadtimestamp">
                    {new Date(thread?.date)?.toLocaleString()}
                </p>
                <p class="ShowThreadcomment-count">
                    {thread?.comments?.length} comments
                </p>
            </div>

            <div class="ShowThreadmain">
                <div class="ShowThreadheader">
                </div>
                <textarea onChange={CommentEvent} name="ShowThreadcommentDetail" value={commentDetail}></textarea>
                <button onClick={addNewComment}>Add comment</button>
                <div class="ShowThreadcomments">
                </div>
            </div>

            <div class="ShowThreadcomment">
                {
                    thread?.comments?.map(
                        (comment) => {
                            return (
                                <>
                                    <div class="ShowThreadtop-comment">
                                        <p class="user">
                                            {comment?.author}
                                        </p>
                                        <p class="ShowThreadcomment-ts">
                                            {new Date(comment?.date).toLocaleString()}-- 
                                        </p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <p class="ShowThreadcomment-content">
                                            {comment?.content}
                                        </p>
                                    </div>
                                  
                                    <br />
                                </>
                            );
                        }
                    )
                }

            </div>


        </>
    );
}

export default ShowThread;



