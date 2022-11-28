import React from 'react';
import PlaylistPreview from './PlaylistPreview';
import {ImCancelCircle, ImSpinner2} from 'react-icons/im';


function PlaylistSelection ({plOptions, setPlIndex, plIndex, setShowPls}) {

    return (
        <div id="pl-select-bg">
            <ImCancelCircle className="close-button" onClick={()=>setShowPls(false)}/>
            {!plOptions[0] && <ImSpinner2 className="spin-loader"/>}
            <ul id="pl-select">
            { 
                plOptions.map( (el, index) => {
                    return <PlaylistPreview key={index} playlist={el} setPlIndex={setPlIndex} myIndex={index} plIndex={plIndex}/>
                })
            }
            </ul>
            <button onClick={()=>{setShowPls(false);document.getElementById('audio-player').play()}}>Choose Playlist and Start</button>
        </div>
    );
}

export default PlaylistSelection;