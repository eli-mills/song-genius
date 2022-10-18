import React from 'react';
import {BsSkipForwardFill} from 'react-icons/bs';

function SkipButton ( {state, trackList} ) {
    const {trackIndex, setTrackIndex, setCurrentTrack} = state;
    const handleSkip = e => {
        e.preventDefault();
        setTrackIndex((trackIndex + 1)%trackList.length);
        setCurrentTrack(trackList[trackIndex].track);
    }
    return (
        <button onClick={ handleSkip }>
            <BsSkipForwardFill />
        </button>
    );
}

export default SkipButton;