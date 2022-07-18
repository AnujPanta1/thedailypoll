import TopHeader from "./components/TopHeader";
import MainSection from "./components/MainSection";
import React, {useState } from "react";
import SubmitionWindow from "./components/SubmitionWindow";
// eslint-disable-next-line
import AboutSection from "./components/AboutSection";
function App() {

  const [mode, setMode] = useState("voting");

  const flipMode = () => {
    if(mode ==="voting"){
      setMode("creating");
    }else if(mode ==="creating"){
      setMode("voting");
    }else{
      setMode("voting");
    }
  }

  return (
    <div className="App">
      <TopHeader flipMode={flipMode}></TopHeader>
      <MainSection></MainSection>
      {mode === "creating" ? <SubmitionWindow flipMode={flipMode}></SubmitionWindow> : <React.Fragment></React.Fragment>}
    </div>
  );
}

export default App;
