import React, { useState } from "react";
import "./SubmitionWindow.css";

import {db} from "../firebase-config";
import { collection, addDoc, serverTimestamp} from "firebase/firestore"; 


const SubmitionWindow = (props) => {

    const flipMode = props.flipMode;

    const [options, setOptions] = useState([]);
    const [newOption, setNewOption] = useState("");
    const [question, setQuestion] = useState("");

    const addOption = () => {
        setOptions([...options, newOption]);
        setNewOption("");
    }

    const deleteOption = (deleteIned) => {
        setOptions(options.filter((option, index) => {
            return deleteIned !== index; 
        }))
    }

    const submitPoll = async () => {

        const emptyRegex = new RegExp("^$");
        if(emptyRegex.test(question)){
            alert("Please input a valid question.");
        }
        if(options.length < 2){
            alert("You need at least 2 options.");
        }
        const newPoll = {
            "question": question,
            "votes": createEmptyVotes(options),
            "createdAt": serverTimestamp()
        }
        await addDoc(collection(db, "polls"), {
            ...newPoll
        });
    }

    const createEmptyVotes = (arryOfOptions) => {
        let emptyVotes = {};
        for(let opt of arryOfOptions){
            emptyVotes[opt] = 0;
        }
        return emptyVotes;
    }

    return(
        <div className="submition-window">
            <div className="top">
                <h3>creating poll</h3>
                <button onClick={() => {flipMode()}}>Exit</button>
            </div>
            <div className="section">
                <p>question</p>
                <input placeholder="type question..." type="text" value={question} onChange={(e) => setQuestion(e.target.value)}></input>
                <button onClick={() => submitPoll()}>Submit!</button>
            </div>
            <div className="section">
                <p>options</p>
                <input placeholder="type option..." type="text" value={newOption} onChange={(e) => setNewOption(e.target.value)}></input>
                <button onClick={() => addOption()}>Add Option</button>
            </div>
            <div className="options-display">
                {
                    options.map((option, index) => {
                        return <Option option={option} key={index} id={index} delteSelf={deleteOption}></Option>
                    })
                }
            </div>
        </div>
    );

}

const Option = (props) => {
    return(
        <div className="option-container-a">
            <p>{props.option}</p>
            <button onClick={() => {props.delteSelf(props.id)}}>&#10006;</button>
        </div>
    );
}

export default SubmitionWindow;