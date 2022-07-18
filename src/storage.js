const MainSection = () => {

    const pollsRef = collection(db, "polls");
    const usersRef = collection(db, "users");
    const dailyPollsRef = collection(db, "dailypolls");

    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState([]);
    const [votes, setVotes] = useState({});

    const [allPollData, setAllPollData] = useState([]);
    const [currentPoll, setCurrentPoll] = useState({});
    const [dailyPollId, setDailyPollId] = useState("");
    
    const [choosenVote, setChoosenVote] = useState("?");
    const [userData, setUserData] = useState({});

    useEffect(() => {
        getAllPolls();
    },// eslint-disable-next-line
    []);

    // find the daily poll based on the date and sets the current poll to that
    useEffect(() => {
        if(allPollData.length === 0) return;
        for(let poll of allPollData){
            if(poll.id === dailyPollId){
                setCurrentPoll(poll);
            }
        }
    }, // eslint-disable-next-line
    [allPollData]);

    useEffect(() => {
        if(Object.keys(currentPoll).length === 0) return;
        setQuestion(currentPoll['question']);
        setVotes(currentPoll['votes']);
        setOptions(Object.keys(currentPoll['votes']));
        if(getCookie("userKey")){
            loadUserVotes();
        }else{
            createNewUser();
        }
    }, // eslint-disable-next-line
    [currentPoll]);

    useEffect(() => {
        if(choosenVote === "?") return;



        const updatePollDocument = async () => {
            let newVote = Object.assign(currentPoll['votes'], {[choosenVote]: (currentPoll['votes'][choosenVote] + 1)});
            let newPollData = {...currentPoll, 'votes': newVote};
            await setDoc(doc(db, "polls", newPollData['id']), newPollData);
        }

        const updateUserVotes = async () => {
            const currentPollId = currentPoll.id;
            console.log(userData);
            let newVotedPolls = Object.assign(userData["votedPolls"], {[currentPollId] : choosenVote});
            let sendOffData = {...userData, "votedPolls":newVotedPolls};
            console.log(sendOffData);
            // await setDoc(doc(db, "users", getCookie("userKey")), newVotedPolls);
            setUserData(newVotedPolls);
        }

        updatePollDocument();
        updateUserVotes();

    }, //eslint-disable-next-line
    [choosenVote])
    
    // gets all poll data and sets the daily poll id and all poll data
    const getAllPolls = async () => {
        const allPollData = await getDocs(pollsRef);
        const dailyPollsData = await getDocs(dailyPollsRef);
        for(const doc of dailyPollsData.docs){
            const timeStamp = doc.data()['publishedDate'].seconds*1000;
            const todaysMidnight = new Date().setHours(0,0,0,0);
            if(timeStamp === todaysMidnight){
                setDailyPollId(doc.data()['poll_id']);
            }
        }
        setAllPollData(allPollData.docs.map((doc) => ({...doc.data(), id: doc.id})));
    }

    const loadUserVotes = async (userId) => {
        const allUserData = await getDocs(usersRef);

        for(const user of allUserData.docs){
            if(user.id === userId){
                console.log(user.data());
                setUserData(user.data());
            }
        }
    }

    const createNewUser = async () => {
        const newUser={
            "votedPolls": {}
        }
        await addDoc(usersRef, {
            ...newUser
        }).then((docRef)=>{
            document.cookie = `userKey=${docRef.id};`
        })
    }

    return(
        <div className="graph-interactive-wrapper">
            <InteractiveSection question={question} options={options} choosenVote={choosenVote} setChoosenVote={setChoosenVote}/>
            <DataGraph options={options} votes={votes} answered={choosenVote !== "?" ? true : false} choosenIndex={options.indexOf(choosenVote)}></DataGraph>
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