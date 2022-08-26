import React from "react";

import "./MainSection.css";

import InteractiveSection from "./InteractiveSection";
import DataGraph from "./DataGraph";

import {db} from "../firebase-config";
// eslint-disable-next-line
import { collection, addDoc, serverTimestamp, getDocs, setDoc, doc, Timestamp} from "firebase/firestore";
import { useEffect, useState } from "react";

const MainSection = () => {

    // creating references for all databases
    const pollsRef = collection(db, "polls");
    const usersRef = collection(db, "users");
    const dailyPollsRef = collection(db, "dailypolls");

    // main data about the daily, current, and all polls
    const [allPollData, setAllPollData] = useState([]);
    const [currentPollData, setCurrentPollData] = useState({"question": "","votes" : []});
    const [dailyPollId, setDailyPollId] = useState("");

    // tracks if the use has voted yet or not
    const [voted, setVoted] = useState(false);

    // tracking userData
    const [userData, setUserData] = useState({
        "votedPolls": {}
    });

    // tracking chosen vote
    const [choosenVote, setChoosenVote] = useState("?");
    

    // inital call after loading
    useEffect(() => {
        getAllPollData();
    }, //eslint-disable-next-line
    []);

    /* 
        finding the daily poll and setting it as the current poll
        also loading user data if we can, if not setting cookies and creating a new user
    */
    useEffect(() => {
        if(allPollData.length === 0) return;
        for(let poll of allPollData){
            if(poll.id === dailyPollId){
                setCurrentPollData(poll);
            }
        }

        if(getCookie("userKey")){
            loadUser(getCookie("userKey"));
        }else{
            createNewUser();
        }

    }, // eslint-disable-next-line
    [allPollData]);

    useEffect(() => {
        if(Object.keys(userData["votedPolls"]).length === 0 ) return;
        if(Object.keys(currentPollData["votes"]).length === 0) return;

        for(let id in userData["votedPolls"]){
            if(id === currentPollData.id){
                setChoosenVote(userData["votedPolls"][id]);
                setVoted(true);
            }
        }
        
    }, // eslint-disable-next-line
    [userData, currentPollData])

    useEffect(() => {
        if(choosenVote==="?") return;

        const updatePollDocument = async () => {
            let newVote = Object.assign(currentPollData["votes"], {
                [choosenVote]: (currentPollData["votes"][choosenVote] + 1)
            });
            let newPollData = {...currentPollData, "votes":newVote};
            await setDoc(doc(db, "polls", newPollData["id"]), newPollData);
        }

        const updateUserVotes = async () => {
            let currentPollId = currentPollData.id;
            let newVotedPolls = Object.assign(userData["votedPolls"], {[currentPollId] : choosenVote});
            let sendOffData =  {...userData, "votedPolls":newVotedPolls};
            await setDoc(doc(db, "users", getCookie("userKey")), sendOffData);
        }

        updatePollDocument();
        updateUserVotes();
    }, // eslint-disable-next-line
    [choosenVote]);

    // loads the user based on the given id, and set choosen vote for current id if it's possible
    const loadUser = async (userId) => {
        const allUserData = await getDocs(usersRef);

        for(const user of allUserData.docs){
            if(user.id === userId){ 
                setUserData(user.data());
            }
        }
    }

    // creates a new user in the database as well as creating a cookie
    const createNewUser = async () => {
        const newUser = {
            "votedPolls": {}
        }

        await addDoc(usersRef, {
            ...newUser
        }).then((docRef) => {
            document.cookie = `userKey=${docRef.id}`;
        });
    }

    /*
        after getting all poll data and the daily poll data 
        it sets the dailyPollId as well as all poll data
    */ 
    const getAllPollData = async () => {
        const pollData = await getDocs(pollsRef);
        const dailyPoll = await getDocs(dailyPollsRef);

//         for(const doc of dailyPoll.docs){
//             const timeStamp = doc.data()['publishedDate'].seconds*1000;
//             const todaysMidnight = new Date().setHours(0,0,0,0);
//             if(timeStamp === todaysMidnight){
//                 setDailyPollId(doc.data()["poll_id"]);
//             }
//         }
        setDailyPollId(dailyPoll.docs[0].data()["poll_id"]);
        setAllPollData(pollData.docs.map((doc) => ({...doc.data(), id: doc.id})));
    }

    return(
        <div className="graph-interactive-wrapper">
            <InteractiveSection question={currentPollData["question"]} options={Object.keys(currentPollData["votes"])} choosenVote={choosenVote} setChoosenVote={setChoosenVote} setVoted={setVoted} hasVoted={voted}/>
            <DataGraph options={Object.keys(currentPollData["votes"])} votes={currentPollData["votes"]} answered={choosenVote !== "?" ? true : false} choosenIndex={Object.keys(currentPollData["votes"]).indexOf(choosenVote)}></DataGraph>
        </div>
    );

}

export default MainSection;

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}
