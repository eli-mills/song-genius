import './App.css';
import React, { useEffect, useState } from 'react';
import InfoButton from './components/InfoButton';
import Modal from './components/Modal';
import AudioPlayer from './components/AudioPlayer';
import SkipButton from './components/SkipButton';
import GuessForm from './components/GuessForm';
import playlist from './data/playlist';

function App() {

  let [trackList, setTrackList] = useState(null);
  let [showModal, setShowModal] = useState(true);
  let [trackIndex, setTrackIndex] = useState(0);
  let [currentTrack, setCurrentTrack] = useState(0);  
  let [userAnswer, setUserAnswer] = useState("");

  const getData = async () => {
    try {
      console.log("Sending fetch request.");
      const data = await fetch("/", {headers: {"Accept":"application/json"}});
      const dataParsed = await data.json();
      console.log(`Received data: ${dataParsed}`);
      setTrackList(dataParsed);
      setCurrentTrack(trackList[trackIndex].track);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(()=>{getData()}, []);

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
