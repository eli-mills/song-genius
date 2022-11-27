import './App.css';
import React, { useEffect, useState } from 'react';
import InfoButton from './components/InfoButton';
import Modal from './components/Modal';
import AudioPlayer from './components/AudioPlayer';
import SkipButton from './components/SkipButton';
import GuessForm from './components/GuessForm';
import PlaylistSearch from './components/PlaylistSearch';

function App() {

  let [trackList, setTrackList] = useState([]);
  let [showModal, setShowModal] = useState(true);
  let [trackIndex, setTrackIndex] = useState(0);
  let [currentTrack, setCurrentTrack] = useState(0);  
  let [userAnswer, setUserAnswer] = useState("");
  let [plOptions, setPlOptions] = useState([]);
  const serverUrl = 'https://song-genius-api.onrender.com';

  useEffect(()=>{
    (async function _ () {
      try {
        console.log("Sending fetch request.");
        const fetchOptions = {
          headers: {"Accept":"application/json"}
        };
        const data = await fetch(`${serverUrl}/api/plTracks/37i9dQZF1DZ06evO4ohLfG`, fetchOptions);
        const dataParsed = await data.json();
        console.log(`Received data: ${JSON.stringify(dataParsed)}`);
        setTrackList(dataParsed);
        setCurrentTrack(dataParsed[0].track);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // Temporary: set tracklist to the first item in plOptions when plOptions updates.
  useEffect(()=>{
    console.log(JSON.stringify(plOptions));
    (async function _ (){
      setTrackList(plOptions[0]);
      setCurrentTrack(plOptions[0][0].track);
      setTrackIndex(0);
    })();
  }, [plOptions]);

  // Auto-play when track changes
  useEffect(()=>{if (!showModal) document.getElementById('audioPlayer').play()},[currentTrack, showModal]);

  const nextTrack = () => {
    const newIndex = (trackIndex + 1)%trackList.length;
    setTrackIndex(newIndex);
    setCurrentTrack(trackList[newIndex].track);
    setUserAnswer("");
  }

  return (
    <div className="App">
      <InfoButton setShowModal={setShowModal}/>
      <h1 id="siteLogo">Song Genius</h1>
      <PlaylistSearch setPlOptions={setPlOptions} serverUrl={serverUrl}/>
      <AudioPlayer currentTrack={currentTrack}/>
      <GuessForm currentTrack={currentTrack} nextTrack={nextTrack} userAnswer={userAnswer} setUserAnswer={setUserAnswer}/>
      <SkipButton nextTrack={nextTrack}/>
      {showModal && <Modal setShowModal={setShowModal}/>}
    </div>
  );
}

export default App;
