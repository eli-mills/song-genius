import React from 'react';

function Modal ({setShowModal}) {
    return (
        <div className='tut-modal-bg' onClick={()=>setShowModal(false)}>
            <div className="tut-modal" onClick={e=>e.stopPropagation()}>        {/* e.stopPropagation stops click on Modal from closing Modal.*/} 
                <h1>How to Play</h1>
                <ol>
                    <li>Click Play to play song clip.</li>
                    <li>Press Replay to replay the clip.</li>
                    <li>Adjust volume with volume button.</li>
                    <li>Enter the song's title and click Submit Guess.</li>
                    <li>Or, if you don't know the song, click Skip.</li>
                </ol>
            </div>
        </div>
    );
}

export default Modal;