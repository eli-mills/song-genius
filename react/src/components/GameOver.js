import React from 'react';

function GameOver ({score, tryAgain, choosePlaylist}) {
    

    return (
        <div id="game-over">
            <h1>Game Over!</h1>
            <p>Your score: {score}</p>
            <button onClick={()=>tryAgain()}>Try Again</button>
            <button onClick={()=>choosePlaylist()}>Choose Different Playlist</button>

        </div>
    );
}

export default GameOver;