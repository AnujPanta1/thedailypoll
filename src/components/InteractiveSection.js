import React, { useEffect, useState } from "react";
import "./InteractiveSection.css";

const InteractiveSection = (props) => {

    // sets the question and option state based on props
    const [question, setQuestion] = useState(props.question);
    const [options, setOptions] = useState(props.options);

    // tracking the chosen vote, and relating setChooseVote from parent
    const choosenVote = props.choosenVote;
    const setChoosenVote = props.setChoosenVote;
    const setVoted = props.setVoted;
    const hasVoted = props.hasVoted;

    // when question props changes, we reset the question state
    useEffect(() => {
        setQuestion(props.question);
        setOptions(props.options);
    }, [props]);

    // if user has not voted yet, sets the choosen vote
    const clickHandler = (index) => {
        if(hasVoted){
            return false;
        }
        setChoosenVote(options[index]);
        setVoted(true);
    }

    // creates the option list, and if voted shows the choosen vote as focused on
    const optionsList = (optionsList) => {
        let active = "hilighted";
        let inactive = "";
        if(choosenVote !== "?"){
            inactive = "pushback";
        }
        return(
            <React.Fragment>
                {optionsList.map((option, index) => {
                        return <p className={` ${option !== choosenVote || choosenVote === "?" ? inactive : active}`} key={index} onClick={() => clickHandler(index)}>{option}</p>
                })}
            </React.Fragment>
        );
    }

    return(
        <div className="info-container">
            <div>
                <p>question of the day...</p>
                <h1>{question}</h1>
            </div>
            <div className="option-container">
                {optionsList(options)}
            </div>
        </div>
    );

}

export default InteractiveSection;
