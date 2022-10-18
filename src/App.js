import './App.css';
import { useState, useEffect } from 'react';
import InfoButton from './components/InfoButton';
import Modal from './components/Modal';
import AudioPlayer from './components/AudioPlayer';
import SkipButton from './components/SkipButton';
import playlist from './data/playlist';

function App() {
  const trackList = playlist;
  
  let [showModal, setShowModal] = useState(true);
  let [trackIndex, setTrackIndex] = useState(0);
  let [currentTrack, setCurrentTrack] = useState(trackList[trackIndex].track);  

  return (
    <div className="App">
      <button onClick={()=>setShowModal(true)}>
      <InfoButton />
      </button>
      <AudioPlayer currentTrack={currentTrack}/>
      <SkipButton state={{trackIndex, setTrackIndex, setCurrentTrack}} trackList={trackList}/>
      {showModal && <Modal setShowModal={setShowModal}/>}
    </div>
  );
}

export default App;
