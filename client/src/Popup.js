import React from "react";
import './pop.css'
const Popup = ({ handleClose, show, children }) => {
  const showHideClassName = show ? "modal d-block" : "modal d-none";

  return (
   
    <div className={showHideClassName} >
         <div className="auth-wrapper" >
            
            <div className="auth-inner"  id="lifestyle">
      <div className="modal-container">
        {children}
        {/* {console.log(children)} */}
        <a href="javascript:;" className="modal-close" onClick={handleClose}>
          Cancel
        </a>
        </div>
        </div>
      </div>
    </div>
    
  );
};

export default Popup;