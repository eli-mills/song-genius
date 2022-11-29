import React from 'react';
import {ImCancelCircle} from 'react-icons/im';

function GameOver ({score, tryAgain, choosePlaylist, playerHistory, setShowGameOver}) {
    

    return (
        <div id="game-over-bg" className="tut-modal-bg">
            <div id="game-over" className="tut-modal">
                <ImCancelCircle className="close-button" onClick={()=>choosePlaylist()} />
                <h1>Game Over!</h1>
                <p>Your score: {score}</p>
                <button onClick={()=>tryAgain()}>Try Again</button>
                <button onClick={()=>choosePlaylist()}>Choose Different Playlist</button>
                <h2>Guess History</h2>
                <ul id="guess-history">
                    {playerHistory.map((item, index)=>{
                        return (<li key={index}>
                            {`${item.currentTrack.name} by ${item.currentTrack.artists[0].name}: ${item.result}`}
                        </li>)
                    })}
                </ul>

            </div>
        </div>
    );
}

export default GameOver;