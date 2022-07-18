import React from "react";

import "./TopHeader.css";

const TopHeader = (props) => {


    const flipMode = props.flipMode;

    return(
        <nav className="top-header">
            <p className="logo ">The Daily Poll</p>
            <div className="link-container">
                <p onClick={() => flipMode()}>Submit poll</p>
            </div>
        </nav>
    );
}

export default TopHeader;