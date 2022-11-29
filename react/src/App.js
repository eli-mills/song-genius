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
    if (!gameActive) {return}
    const trackTitleRe = /^.+?(?=(?:\s\(|\s-)|$)/;
    const trackTitleParsed = currentTrack.name.match(trackTitleRe)[0];
    if ( userAnswer.toLowerCase() === trackTitleParsed.toLowerCase() ) {
        document.getElementById("result-modal").className="result-correct";
        setResultMessage("Correct! +1 point");
        setScore(score + 1);
        nextTrack();
    } else {
        document.getElementById("result-modal").className="result-incorrect";
        setResultMessage("Nope, try again!");
    }
    flashResult();
    setUserAnswer("");
  }

  const skipTrack = () => {
    if (gameActive) {
      document.getElementById("result-modal").className="result-skipped";
      setResultMessage(`Skipped: ${currentTrack.name} by ${currentTrack.artists[0].name}`);
      setUserAnswer("");
      flashResult();
      nextTrack();
      document.getElementById("guess-form-input").focus();
    }
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
      document.getElementById("guess-form-input").focus();
    } else if (timer === 0) {
      setGameActive(false);
    }
  }, [timer, gameActive]);

  useEffect(()=>{
    if (showResult) {
      document.getElementById("result-modal").style.opacity=1;
    } else {
      document.getElementById("result-modal").style.opacity=0;
    }
  }, [showResult])

  // Stop timer when hits 0
  useEffect(()=>{
    if (timer == 0) {
      setGameActive(false);
      setShowGameOver(true);
      document.getElementById("audio-player").pause();
      document.getElementById("guess-form-input").blur();
    } 
  }, [timer]);

  return (
    <div className="App">
      {showGameOver && <GameOver score={score} tryAgain={tryAgain} choosePlaylist={choosePlaylist}/>}
      <InfoButton setShowModal={setShowModal}/>
      <h1 id="site-logo">Song Genius</h1>
      <PlaylistSearch setPlOptions={setPlOptions} serverUrl={serverUrl} setShowPls={setShowPls}/>
      {!showPls && plOptions[0] && <ShowPlaylists setShowPls={setShowPls}/>}
      {showPls && <PlaylistSelection plOptions={plOptions} setPlIndex={setPlIndex} plIndex={plIndex} setShowPls={setShowPls} setGameActive={setGameActive}/>}
      <div id="result-modal-container">
        <ResultModal resultMessage={resultMessage}/>
      </div>
      <Timer timer={timer}/>
      <AudioPlayer currentTrack={currentTrack}/>
      <GuessForm userAnswer={userAnswer} setUserAnswer={setUserAnswer} evaluateAnswer={evaluateAnswer}/>
      <SkipButton nextTrack={nextTrack} skipTrack={skipTrack}/>
      {showModal && <Modal setShowModal={setShowModal}/>}
    </div>
  );
}

export default App;
