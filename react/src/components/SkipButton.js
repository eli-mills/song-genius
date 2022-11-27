import React from 'react';
import {BsSkipForwardFill} from 'react-icons/bs';

function SkipButton ( {nextTrack} ) {
    const handleSkip = e => {
        e.preventDefault();
        nextTrack();
    }
    return (
        <button onClick={ handleSkip }>
            <BsSkipForwardFill />
        </button>
    );
}

export default SkipButton;