import React from 'react';

function AudioPlayer ( {currentTrack} ) {
    return (
        <audio src={currentTrack["preview_url"]} id="audioPlayer" controls></audio>
    );
}

export default AudioPlayer;