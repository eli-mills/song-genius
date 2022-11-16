import './App.css';
import React, { useEffect, useState } from 'react';
import InfoButton from './components/InfoButton';
import Modal from './components/Modal';
import AudioPlayer from './components/AudioPlayer';
import SkipButton from './components/SkipButton';
import GuessForm from './components/GuessForm';

function App() {

  let [trackList, setTrackList] = useState([]);
  let [showModal, setShowModal] = useState(true);
  let [trackIndex, setTrackIndex] = useState(0);
  let [currentTrack, setCurrentTrack] = useState(0);  
  let [userAnswer, setUserAnswer] = useState("");

  useEffect(()=>{
    (async function getData () {
      try {
        console.log("Sending fetch request.");
        const data = await fetch("/api", {headers: {"Accept":"application/json"}});
        const dataParsed = await data.json();
        console.log(`Received data: ${JSON.stringify(dataParsed)}`);
        setTrackList(dataParsed);
        setCurrentTrack(dataParsed[0].track);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const nextTrack = () => {
    console.log("next track triggered");
    setTrackIndex((trackIndex + 1)%trackList.length);
    setCurrentTrack(trackList[trackIndex].track);
    setUserAnswer("");
  }

  return (
    <div className="App">
      <button onClick={()=>setShowModal(true)}>
      <InfoButton />
      </button>
      <AudioPlayer currentTrack={currentTrack}/>
      <GuessForm currentTrack={currentTrack} nextTrack={nextTrack} userAnswer={userAnswer} setUserAnswer={setUserAnswer}/>
      <SkipButton nextTrack={nextTrack}/>
      {showModal && <Modal setShowModal={setShowModal}/>}
    </div>
  );
}

export default App;
