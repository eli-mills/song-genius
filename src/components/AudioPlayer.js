import React from 'react';

function AudioPlayer ( {currentTrack} ) {
    return (
        <div>
            <audio src={currentTrack["preview_url"]} controls></audio>
        </div>
    );
}

export default AudioPlayer;