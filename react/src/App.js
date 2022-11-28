import './App.css';
import React, { useEffect, useState } from 'react';
import InfoButton from './components/InfoButton';
import Modal from './components/Modal';
import AudioPlayer from './components/AudioPlayer';
import SkipButton from './components/SkipButton';
import GuessForm from './components/GuessForm';
import PlaylistSearch from './components/PlaylistSearch';
import PlaylistSelection from './components/PlaylistSelection';
import ShowPlaylists from './components/ShowPlaylists';
import Timer from './components/Timer';

function App() {

  let [trackList, setTrackList] = useState([]);
  let [showModal, setShowModal] = useState(true);
  let [trackIndex, setTrackIndex] = useState(0);
  let [currentTrack, setCurrentTrack] = useState(0);  
  let [userAnswer, setUserAnswer] = useState("");
  let [plOptions, setPlOptions] = useState([]);
  let [plIndex, setPlIndex] = useState(null);
  let [showPls, setShowPls] = useState(false);
  let [timer, setTimer] = useState(30);
  let [gameActive, setGameActive] = useState(false);
  let [timerId, setTimerId] = useState(null);

  const serverUrl = 'https://song-genius-api.onrender.com';

  const nextTrack = () => {
    if (gameActive) {
      const newIndex = (trackIndex + 1)%trackList.length;
      setTrackIndex(newIndex);
      setCurrentTrack(trackList[newIndex].track);
      setUserAnswer("");
    }
  }

  const updateTrackList = tl => {
    if (tl) {  
      setTrackList(tl);
      setCurrentTrack(tl[0].track);
      setTrackIndex(0);
    }
  }

  const startTimer = () => {
    const timerId = setInterval(()=>setTimer(timer-1), 1000);
    return timerId;
  }

  const stopTimer = stopTimerId => {
    clearInterval(stopTimerId);
  }

  useEffect(()=>{
    setPlIndex(null)},[plOptions])

  useEffect(()=>{
    if (plIndex !== null && plOptions !== []) {

      updateTrackList(plOptions[plIndex].tracks);
    };
  },[plIndex]);

  // Auto-play when track changes
  useEffect(()=>{if (!showPls && !showModal) {document.getElementById('audio-player').play()}},[currentTrack]);

  useEffect(()=>{
    if (gameActive && timer > 0) {
      setTimeout(()=>setTimer(timer-1), 1000);
    } else if (timer === 0) {
      setGameActive(false);
    }
  }, [timer, gameActive]);

  // Stop timer when hits 0
  useEffect(()=>{
    if (timer == 0) {
      stopTimer(timerId); 
      setGameActive(false);
      document.getElementById("audio-player").pause();
    } 
  }, [timer]);

  return (
    <div className="App">
      <InfoButton setShowModal={setShowModal}/>
      <h1 id="site-logo">Song Genius</h1>
      <PlaylistSearch setPlOptions={setPlOptions} serverUrl={serverUrl} setShowPls={setShowPls}/>
      {!showPls && plOptions[0] && <ShowPlaylists setShowPls={setShowPls}/>}
      {showPls && <PlaylistSelection plOptions={plOptions} setPlIndex={setPlIndex} plIndex={plIndex} setShowPls={setShowPls} setGameActive={setGameActive}/>}
      <AudioPlayer currentTrack={currentTrack}/>
      <Timer timer={timer}/>
      <GuessForm currentTrack={currentTrack} nextTrack={nextTrack} userAnswer={userAnswer} setUserAnswer={setUserAnswer}/>
      <SkipButton nextTrack={nextTrack}/>
      {showModal && <Modal setShowModal={setShowModal}/>}
    </div>
  );
}

export default App;
