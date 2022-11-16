import React from 'react';

function GuessForm ( { currentTrack, nextTrack, userAnswer, setUserAnswer } ) {
    
    const evaluateAnswer = (e) => {
        e.preventDefault();
        if ( userAnswer.toLowerCase() === currentTrack.name.toLowerCase() ) {
            console.log("correct");
            setUserAnswer("");
            nextTrack();
        } else {
            console.log("incorrect, try again");
        }
    }
    
    
    return (
        <form>
            <input type="text" value={userAnswer} onChange={e=>setUserAnswer(e.target.value)}/>
            <button onClick={evaluateAnswer}>Submit Guess</button>
        </form>        
    );
}

export default GuessForm;