import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import ShowThread from './ShowThread';

const Question=(props)=>{
    return(
            <>
        <Link to="ShowThread" onClick={()=>{props.onSelectItem(props.id)}}>
            
                <h4 class="ShowThreadtitle">
                     {props.title}
                </h4>
                <div class="ShowThreadbottom">
                    <p class="ShowThreadtimestamp">
                        {new Date(props.date).toLocaleString()}
                    </p>
                    <p class="ShowThreadcomment-count">
                        {props.commentCount} comments
                    </p>
                    
                    <p>&nbsp;&nbsp;&nbsp;</p><p>
                        Asked by: {props.author} 
                    </p>
                </div>
            </Link>
        </>
    );
}
export default Question;