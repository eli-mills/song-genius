import React from 'react';

function GuessForm ( { userAnswer, setUserAnswer, evaluateAnswer } ) {
    
    const submitGuess = (e) => {
        e.preventDefault();
        evaluateAnswer();
    }
    
    return (
        <form id="guess-form">
            <input type="text" autoFocus value={userAnswer} onChange={e=>setUserAnswer(e.target.value)}/>
            <button onClick={submitGuess}>Submit Guess</button>
        </form>        
    );
}

export default GuessForm;