import React from "react";
import "./AboutSection.css";


const AboutSection = () => {
    return(
        <div className="about-section">
            <div className="section">
                <h1>about us</h1>
                <p>
                    The Daily Poll is an opportunity to see 
                    the opinions of users all across the world. We let users submit 
                    polls to be considered for the daily poll. If you wish to just answer 
                    and not create that's perfectly fine!
                </p>
            </div>
            <div className="section">
                <h1>easy to use</h1>
                <ol>
                    <li>answer the daily poll, and view results</li>
                    <li>click around and answer other user submited polls </li>
                    <li>create a custom poll and publish</li>
                    <li>come back tomorrow for another poll!</li>
                </ol>
            </div>
        </div>
    );
}

export default AboutSection;