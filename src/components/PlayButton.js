import React from 'react';
import {AiFillPlaySquare} from 'react-icons/ai';

function PlayButton () {
    const clickPlayButton = e => {
        document.querySelector("[data-testid='play-button']").click();
        e.preventDefault();
    }

    return (
        <button onClick={clickPlayButton}>
            <AiFillPlaySquare />
        </button>
    );
}

export default PlayButton;