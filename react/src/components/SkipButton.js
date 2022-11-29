import React from 'react';
import {BsSkipForwardFill} from 'react-icons/bs';

function SkipButton ( {nextTrack, skipTrack} ) {
    const handleSkip = e => {
        e.preventDefault();
        skipTrack();
    }
    return (
        <button onClick={ handleSkip }>
            <BsSkipForwardFill />
        </button>
    );
}

export default SkipButton;