import './App.css';
import { useState } from 'react';
import InfoButton from './components/InfoButton';
import Modal from './components/Modal';
import AudioPlayer from './components/AudioPlayer';
import SkipButton from './components/SkipButton';
import GuessForm from './components/GuessForm';
import playlist from './data/playlist';

function App() {
  const trackList = playlist;
  
  let [showModal, setShowModal] = useState(true);
  let [trackIndex, setTrackIndex] = useState(0);
  let [currentTrack, setCurrentTrack] = useState(trackList[trackIndex].track);  
  let [userAnswer, setUserAnswer] = useState("");

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
