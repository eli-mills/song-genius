import React from 'react';

function Modal ({setShowModal}) {
    return (
        <div className='tut-modal-bg' onClick={()=>setShowModal(false)}>
            <div className="tut-modal" onClick={e=>e.stopPropagation()}>        {/* e.stopPropagation stops click on Modal from closing Modal.*/} 
                <span className="close-button" onClick={()=>setShowModal(false)}>X</span>
                <h1>How to Play</h1>
                <ol>
                    <li>Use the search bar to search for a genre, artist, or playlist.</li>
                    <li>Select the best match from the list.</li>
                    <li>Click "Start Game" to begin.</li>
                    <li>Enter the song's title and click Submit Guess.</li>
                    <li>Or, if you don't know the song, click Skip.</li>
                    <li>Try to get as many guesses as you can before the timer stops!</li>
                </ol>
                <button onClick={()=>setShowModal(false)}>Let's get started!</button>
            </div>
        </div>
    );
}

export default Modal;