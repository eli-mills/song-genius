import React from 'react';

function GameOver ({score, tryAgain, choosePlaylist}) {
    

    return (
        <div id="game-over-bg" className="tut-modal-bg">
            <div id="game-over" className="tut-modal">
                <h1>Game Over!</h1>
                <p>Your score: {score}</p>
                <button onClick={()=>tryAgain()}>Try Again</button>
                <button onClick={()=>choosePlaylist()}>Choose Different Playlist</button>

            </div>
        </div>
    );
}

export default GameOver;