import React from 'react';

function GuessForm ( { currentTrack, nextTrack, userAnswer, setUserAnswer } ) {
    
    const evaluateAnswer = (e) => {
        e.preventDefault();
        const trackTitleRe = /^.+?(?=(?:\s\(|\s-)|$)/;
        const trackTitleParsed = currentTrack.name.match(trackTitleRe)[0];
        if ( userAnswer.toLowerCase() === trackTitleParsed.toLowerCase() ) {
            console.log("correct");
            setUserAnswer("");
            nextTrack();
        } else {
            console.log("incorrect, try again");
        }
    }
    
    return (
        <form>
            <input type="text" autoFocus value={userAnswer} onChange={e=>setUserAnswer(e.target.value)}/>
            <button onClick={evaluateAnswer}>Submit Guess</button>
        </form>        
    );
}

export default GuessForm;