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
import GameOver from './components/GameOver';
import ResultModal from './components/ResultModal';

function App() {
  const serverUrl = 'https://song-genius-api.onrender.com';
  const gameTime = 60;

  let [trackList, setTrackList] = useState([]);
  let [showModal, setShowModal] = useState(true);
  let [trackIndex, setTrackIndex] = useState(0);
  let [currentTrack, setCurrentTrack] = useState(0);  
  let [userAnswer, setUserAnswer] = useState("");
  let [plOptions, setPlOptions] = useState([]);
  let [plIndex, setPlIndex] = useState(null);
  let [showPls, setShowPls] = useState(false);
  let [timer, setTimer] = useState(gameTime);
  let [gameActive, setGameActive] = useState(false);
  let [showGameOver, setShowGameOver] = useState(false);
  let [score, setScore] = useState(0);
  let [showResult, setShowResult] = useState(false);
  let [resultMessage, setResultMessage] = useState("");
  let [resultTimer, setResultTimer] = useState(null);

  

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

  const evaluateAnswer = () => {
    const trackTitleRe = /^.+?(?=(?:\s\(|\s-)|$)/;
    const trackTitleParsed = currentTrack.name.match(trackTitleRe)[0];
    if ( userAnswer.toLowerCase() === trackTitleParsed.toLowerCase() ) {
        setResultMessage("Correct! +1 point")
        setScore(score + 1);
        nextTrack();
    } else {
        setResultMessage("Nope, try again!");
    }
    flashResult();
    setUserAnswer("");
  }

  const skipTrack = () => {
    setResultMessage(`Skipped: ${currentTrack.name} by ${currentTrack.artists[0].name}`);
    setUserAnswer("");
    flashResult();
    nextTrack();
  }

  const flashResult = () => {
    clearTimeout(resultTimer);
    setShowResult(true);
    setResultTimer(setTimeout(()=>setShowResult(false), 2000));
  }

  const resetGame = () => {
    setScore(0);
    setTimer(gameTime);
    setTrackIndex(0);
    setCurrentTrack(trackList[0].track);
    setUserAnswer("");
  }

  const tryAgain = () => {
    resetGame();
    setShowGameOver(false);
    setGameActive(true);
  }

  const choosePlaylist = () => {
      resetGame();
      setShowGameOver(false);
      setShowPls(true);
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
      setGameActive(false);
      setShowGameOver(true);
      document.getElementById("audio-player").pause();
    } 
  }, [timer]);

  
  // useEffect(()=>{
  //   if (resultMessage !== "") flashResult()
  // }, [resultMessage])

  return (
    <div className="App">
      {showGameOver && <GameOver score={score} tryAgain={tryAgain} choosePlaylist={choosePlaylist}/>}
      <InfoButton setShowModal={setShowModal}/>
      <h1 id="site-logo">Song Genius</h1>
      <PlaylistSearch setPlOptions={setPlOptions} serverUrl={serverUrl} setShowPls={setShowPls}/>
      {!showPls && plOptions[0] && <ShowPlaylists setShowPls={setShowPls}/>}
      {showPls && <PlaylistSelection plOptions={plOptions} setPlIndex={setPlIndex} plIndex={plIndex} setShowPls={setShowPls} setGameActive={setGameActive}/>}
      <AudioPlayer currentTrack={currentTrack}/>
      <Timer timer={timer}/>
      {showResult && <ResultModal resultMessage={resultMessage}/>}
      <GuessForm userAnswer={userAnswer} setUserAnswer={setUserAnswer} evaluateAnswer={evaluateAnswer}/>
      <SkipButton nextTrack={nextTrack} skipTrack={skipTrack}/>
      {showModal && <Modal setShowModal={setShowModal}/>}
    </div>
  );
}

export default App;
